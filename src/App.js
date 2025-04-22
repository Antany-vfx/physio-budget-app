import { Card, CardContent } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem } from "./components/ui/select";

export default function App() {
  return (
    <div className="p-6 text-center space-y-4">
      <h1 className="text-2xl font-bold text-blue-600">Physio Budget App</h1>
      <Card>
        <CardContent>
          <Input placeholder="Enter patient name" />
          <div className="mt-2">
            <Select value="" onValueChange={(val) => alert(`Selected ${val}`)}>
              <SelectItem value="">Select Session</SelectItem>
              <SelectItem value="session1">Session 1</SelectItem>
              <SelectItem value="session2">Session 2</SelectItem>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}