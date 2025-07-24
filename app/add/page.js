import {
  Card,
  CardDescription,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Page() {
  return (
    <div className={"h-[calc(100vh-50px)]"}>
      <Card className="h-full">
        <CardHeader>
          <CardDescription>Add Expense</CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor={"id"}>amount</Label>
            <Input type="number" id="amount" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
