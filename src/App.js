import React, { useState } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem } from "./components/ui/select";

const days = ["Monday", "Tuesday", "Wednesday", "Friday", "Saturday", "Sunday"];
const physioPlans = [
  "Stroke Recovery (Intensive)",
  "Parkinson's Rehab (Moderate)",
  "Geriatric Post-op Recovery",
  "Elderly Mobility & Fall Prevention",
  "Custom"
];

const sessionOptions = Array.from({ length: 20 }, (_, i) => `Session ${i + 1}`);
const numericOptions = [0, 5, 10, 15, 20, 25, 30, 40, 50, 75, 100];
const hourOptions = ["00", "01", "02", "03"];
const minuteOptions = ["00", "15", "30", "45"];

export default function MonthlyBudgetApp() {
  const [physioLogs, setPhysioLogs] = useState(
    Array.from({ length: 5 }, (_, i) => ({
      name: `Physio ${i + 1}`,
      weeklySessions: days.map((day) => ({
        day,
        patient: "",
        plan: "",
        duration: "",
        sessionType: "",
        fuelCost: 0,
        incomeFromPatient: 0,
        sessionSalary: 0
      })),
      salary: 1200
    }))
  );

  const [headSalary, setHeadSalary] = useState(1500);
  const [equipment, setEquipment] = useState(600);
  const [marketing, setMarketing] = useState(400);
  const [software, setSoftware] = useState(150);
  const [phoneInternet, setPhoneInternet] = useState(100);
  const [miscellaneous, setMiscellaneous] = useState(250);

  const updateLog = (index, dayIndex, field, value) => {
    const updated = [...physioLogs];
    updated[index].weeklySessions[dayIndex][field] = value;
    setPhysioLogs(updated);
  };

  const getSessionTotal = (session) => {
    return Number(session.incomeFromPatient || 0);
  };

  const getWeeklyTotal = (sessions) =>
    sessions.reduce((sum, s) => sum + getSessionTotal(s), 0);

  const totalIncome = physioLogs.reduce(
    (sum, physio) => sum + physio.weeklySessions.reduce((s, p) => s + Number(p.incomeFromPatient || 0), 0),
    0
  );

  const totalFuel = physioLogs.reduce(
    (sum, physio) => sum + physio.weeklySessions.reduce((s, p) => s + Number(p.fuelCost || 0), 0),
    0
  );

  const totalSessionSalary = physioLogs.reduce(
    (sum, physio) => sum + physio.weeklySessions.reduce((s, p) => s + Number(p.sessionSalary || 0), 0),
    0
  );

  const totalExpenses =
    headSalary +
    totalFuel +
    totalSessionSalary +
    equipment +
    marketing +
    software +
    phoneInternet +
    miscellaneous;

  const netIncome = totalIncome - totalExpenses;

  const downloadCSV = () => {
    const headers = [
      "Physio Name",
      "Day",
      "Patient",
      "Plan",
      "Duration",
      "Session Type",
      "Fuel Cost",
      "Income From Patient",
      "Session Salary",
      "Subtotal"
    ];

    let csv = headers.join(",") + "\n";

    physioLogs.forEach((physio) => {
      physio.weeklySessions.forEach((session) => {
        const duration = session.duration || "";
        const row = [
          physio.name,
          session.day,
          session.patient,
          session.plan,
          duration,
          session.sessionType,
          session.fuelCost,
          session.incomeFromPatient,
          session.sessionSalary,
          getSessionTotal(session).toFixed(2)
        ];
        csv += row.join(",") + "\n";
      });
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "physio_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 max-w-6xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold mb-4">Detailed Weekly Billing & Summary</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="text-xs font-semibold">Head Salary</div>
        <div className="text-xs font-semibold">Equipment</div>
        <div className="text-xs font-semibold">Marketing</div>
        <div className="text-xs font-semibold">Software</div>
        <div className="text-xs font-semibold">Phone & Internet</div>
        <div className="text-xs font-semibold">Miscellaneous</div>

        <Input type="number" value={headSalary} onChange={(e) => setHeadSalary(Number(e.target.value))} placeholder="Head Salary" />
        <Input type="number" value={equipment} onChange={(e) => setEquipment(Number(e.target.value))} placeholder="Equipment" />
        <Input type="number" value={marketing} onChange={(e) => setMarketing(Number(e.target.value))} placeholder="Marketing" />
        <Input type="number" value={software} onChange={(e) => setSoftware(Number(e.target.value))} placeholder="Software" />
        <Input type="number" value={phoneInternet} onChange={(e) => setPhoneInternet(Number(e.target.value))} placeholder="Phone & Internet" />
        <Input type="number" value={miscellaneous} onChange={(e) => setMiscellaneous(Number(e.target.value))} placeholder="Miscellaneous" />
      </div>

      {physioLogs.map((physio, index) => (
        <Card key={index} className="mb-6">
          <CardContent className="space-y-2">
            <Input
              className="text-lg font-semibold mb-2"
              value={physio.name}
              onChange={(e) => {
                const updated = [...physioLogs];
                updated[index].name = e.target.value;
                setPhysioLogs(updated);
              }}
              placeholder="Physio Name"
            />

            <div className="grid grid-cols-9 gap-2 font-semibold text-sm text-gray-700 bg-gray-100 px-2 py-1 rounded">
              <div>Day</div>
              <div>Patient</div>
              <div>Plan</div>
              <div>Duration (HH:MM)</div>
              <div>Session</div>
              <div>Fuel</div>
              <div>Income</div>
              <div>Salary</div>
              <div>Subtotal</div>
            </div>

            {physio.weeklySessions.map((session, dayIndex) => (
              <div key={dayIndex} className="grid grid-cols-9 gap-2 items-center text-xs border-b py-2">
                <div className="font-semibold text-gray-500">{session.day}</div>
                <Input
                  placeholder="Patient Name"
                  value={session.patient}
                  onChange={(e) => updateLog(index, dayIndex, "patient", e.target.value)}
                />
                <Select
                  value={session.plan}
                  onValueChange={(val) => updateLog(index, dayIndex, "plan", val)}
                >
                  <SelectTrigger className="text-gray-500">
                    {session.plan || "Select Plan"}
                  </SelectTrigger>
                  <SelectContent>
                    {physioPlans.map((plan, i) => (
                      <SelectItem key={i} value={plan}>
                        {plan}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex gap-1">
                  <Select
                    value={session.duration.split(":" )[0] || ""}
                    onValueChange={(val) => updateLog(index, dayIndex, "duration", `${val}:${session.duration.split(":" )[1] || "00"}`)}
                  >
                    <SelectTrigger>{session.duration.split(":" )[0] || "HH"}</SelectTrigger>
                    <SelectContent>
                      {hourOptions.map((h) => (
                        <SelectItem key={h} value={h}>{h}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={session.duration.split(":" )[1] || ""}
                    onValueChange={(val) => updateLog(index, dayIndex, "duration", `${session.duration.split(":" )[0] || "00"}:${val}`)}
                  >
                    <SelectTrigger>{session.duration.split(":" )[1] || "MM"}</SelectTrigger>
                    <SelectContent>
                      {minuteOptions.map((m) => (
                        <SelectItem key={m} value={m}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Select
                  value={session.sessionType}
                  onValueChange={(val) => updateLog(index, dayIndex, "sessionType", val)}
                >
                  <SelectTrigger className="text-gray-500">
                    {session.sessionType || "Select Session"}
                  </SelectTrigger>
                  <SelectContent>
                    {sessionOptions.map((opt, i) => (
                      <SelectItem key={i} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={String(session.fuelCost)}
                  onValueChange={(val) => updateLog(index, dayIndex, "fuelCost", Number(val))}
                >
                  <SelectTrigger className="text-gray-500">
                    {session.fuelCost ? `${session.fuelCost} KWD` : "Fuel Cost"}
                  </SelectTrigger>
                  <SelectContent>
                    {numericOptions.map((val, i) => (
                      <SelectItem key={i} value={String(val)}>
                        {val} KWD
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={String(session.incomeFromPatient)}
                  onValueChange={(val) => updateLog(index, dayIndex, "incomeFromPatient", Number(val))}
                >
                  <SelectTrigger className="text-gray-500">
                    {session.incomeFromPatient ? `${session.incomeFromPatient} KWD` : "Income from Patient"}
                  </SelectTrigger>
                  <SelectContent>
                    {numericOptions.map((val, i) => (
                      <SelectItem key={i} value={String(val)}>
                        {val} KWD
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={String(session.sessionSalary)}
                  onValueChange={(val) => updateLog(index, dayIndex, "sessionSalary", Number(val))}
                >
                  <SelectTrigger className="text-gray-500">
                    {session.sessionSalary ? `${session.sessionSalary} KWD` : "Physio Salary"}
                  </SelectTrigger>
                  <SelectContent>
                    {numericOptions.map((val, i) => (
                      <SelectItem key={i} value={String(val)}>
                        {val} KWD
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="text-xs font-medium">{getSessionTotal(session).toFixed(2)} KWD</div>
              </div>
            ))}

            <div className="text-sm mt-2 font-semibold">
              Weekly Total for {physio.name}: {getWeeklyTotal(physio.weeklySessions).toFixed(2)} KWD
            </div>
          </CardContent>
        </Card>
      ))}

      <Card>
        <CardContent className="space-y-2">
          <h3 className="text-lg font-semibold">Monthly Summary</h3>
          <div>Total Income from Patients: {totalIncome} KWD</div>
          <div>Total Transport & Fuel: {totalFuel} KWD</div>
          <div>Total Session-based Salary: {totalSessionSalary} KWD</div>
          <div>Head of Physio Salary: {headSalary} KWD</div>
          <div>Equipment Maintenance/Supplies: {equipment} KWD</div>
          <div>Marketing & Ads: {marketing} KWD</div>
          <div>Software & CRM: {software} KWD</div>
          <div>Phone & Internet: {phoneInternet} KWD</div>
          <div>Miscellaneous: {miscellaneous} KWD</div>
          <div className="text-lg font-bold">Total Expenses: {totalExpenses} KWD</div>
          <div className="text-xl font-bold text-green-600">Net Income: {netIncome} KWD</div>
          <button
            onClick={downloadCSV}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Export to CSV
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
