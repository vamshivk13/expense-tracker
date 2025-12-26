"use client";

import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  XAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { getFormattedAmount } from "../util/DateUtility";

export const description = "A bar chart with a label";

const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
];

const chartConfig = {
  category: {
    label: "Spends",
    color: "var(--bar-chart-color)",
  },
};

export function ExpenseSummaryBarChart({ transactions }) {
  const [transactionsByCategory, setTransactionsByCategory] = useState([]);
  console.log("Trans By Cat", transactions);
  useEffect(() => {
    const byCategory = transactions.reduce((acc, cur) => {
      const cat = cur.category;
      if (acc[cat] == undefined) {
        acc[cat] = 0;
      }
      acc[cat] = acc[cat] + cur.amount;
      return acc;
    }, {});

    const transactionsByCategory = Object.entries(byCategory).map(
      ([category, amount]) => ({
        category,
        amount,
      })
    );
    const transactionsByCategoryTop = transactionsByCategory
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
    setTransactionsByCategory(transactionsByCategoryTop);
    console.log("BY CATEGORY", byCategory);
  }, [transactions]);

  return (
    <Card className="py-4 bg-background w-full sm:py-0 border-none outline-none shadow-none">
      <CardHeader className="border-none flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <CardTitle className={"mainLabel"}>Top Spends</CardTitle>
      </CardHeader>
      <CardContent className="px-0 w-full sm:p-6 border-none shadow-none outline-none">
        <ResponsiveContainer width={"100%"} height={300}>
          <ChartContainer config={chartConfig} className={"w-full h-full"}>
            <BarChart
              accessibilityLayer
              className="h-full"
              data={transactionsByCategory}
              margin={{
                top: 20,
                left: 10,
                right: 10,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                className="subLabel3 font-semibold"
                dataKey="category"
                tickLine={false}
                tickMargin={15}
                axisLine={false}
                interval={0} // ⬅️ force-show all ticks
                minTickGap={0}
                tickFormatter={(value) =>
                  value.length >= 10 ? value.slice(0, 10) + ".." : value
                }
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="amount" fill="var(--color-category)" radius={4}>
                <LabelList
                  dataKey={"amount"}
                  position="top"
                  offset={12}
                  className="fill-foreground subLabel2"
                  fontSize={12}
                  formatter={(val) => getFormattedAmount(val)}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
