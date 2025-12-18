import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Badge } from "lucide-react";
import { ExpenseSummaryChart } from "../components/ExpenseSummaryChart";

const ExpenseSummary = ({ goBack }) => {
  return (
    <div
      className={
        "flex flex-col gap-5 sm:container mx-auto px-6 sm:px-16 lg:px-16 py-3"
      }
    >
      <div className="flex flex-col gap-4 text-lg bg-background py-4 w-full">
        <div className="flex gap-2 col-span-3 items-center relative">
          <ArrowLeft
            className="absolute left-2 top-[50%] translate-y-[-50%]"
            onClick={() => goBack()}
          />
          <div className="mx-auto subLabel px-4 py-2 rounded-full border-[0.3px] border-(--border-color)">
            Expenses Summary
          </div>
        </div>
        <Tabs defaultValue="today" className={"mt-5 rounded-md"}>
          <TabsList className={"flex justify-center w-full"}>
            <TabsTrigger value="today" className={"subLabel2"}>
              Today
            </TabsTrigger>
            <TabsTrigger className={"subLabel2"} value="week">
              This Week
            </TabsTrigger>
            <TabsTrigger className={"subLabel2"} value="month">
              This Month
            </TabsTrigger>
          </TabsList>
          <TabsContent value="today">
            <Card className="@container/card">
              <CardHeader>
                <CardDescription>Total Expenses</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  ₹{500}
                </CardTitle>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                  More Expenses than Yesterday
                </div>
                <div className="text-muted-foreground">
                  Increase in expenses by 100 rupees
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="week">
            <Card className="@container/card">
              <CardHeader>
                <CardDescription>Total Expenses</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  ₹{500}
                </CardTitle>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                  More Expenses than Yesterday
                </div>
                <div className="text-muted-foreground">
                  Increase in expenses by 100 rupees
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="month">
            <Card className="@container/card">
              <CardHeader>
                <CardDescription>Total Expenses</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  ₹{500}
                </CardTitle>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                  More Expenses than Yesterday
                </div>
                <div className="text-muted-foreground">
                  Increase in expenses by 100 rupees
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
        <div>
          <ExpenseSummaryChart />
        </div>
      </div>
    </div>
  );
};
export default ExpenseSummary;
