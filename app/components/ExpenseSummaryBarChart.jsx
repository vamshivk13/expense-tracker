"use client";

import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Pie,
  PieChart,
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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { getFormattedAmount } from "../util/DateUtility";

export const description = "A bar chart with a label";

const chartConfig = {
  category: {
    label: "Spends",
    color: "var(--bar-chart-color)",
  },
};

function colorFromLabel(label) {
  const hue = hashToHue(label); // 0..360
  const sat = 65; // saturation %
  const light = 55; // lightness %
  return `rgb(${hue}deg ${sat}% ${light}%)`;
}

/** Hash a string to a hue in 0..360 */
function hashToHue(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0; // simple fast hash
  }
  return h % 360;
}

function toKey(label) {
  return String(label);
}

export function ExpenseSummaryBarChart({ transactions }) {
  const [transactionsByCategory, setTransactionsByCategory] = useState([]);
  const [pieConfig, setPieConfig] = useState({});
  console.log("Trans By Cat", transactions);

  console.log("PIE CONfig", pieConfig);

  const chartWidth = window.innerWidth * 1; // or use actual chart container width
  const tickCount = 5; // number of X-axis labels
  const avgCharWidth = 7; // approx px per character for your font
  const maxChars = Math.floor(chartWidth / tickCount / avgCharWidth);

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

    //Get Top spent tags by category

    const transactionsByCategoryTop = transactionsByCategory
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    const config = {};
    for (const { category } of transactionsByCategoryTop) {
      const key = toKey(category);
      if (!config[key]) {
        const hueDeg = hashToHue(category); // 0..360
        const lPct = (0.7 * 100).toFixed(1) + "%";
        const cVal = (0.3).toFixed(3); // OKLCH chroma value
        config[key] = {
          label: category,
          color: `var(--chart-1)`,
          // color: `oklch(${lPct} ${cVal} ${hueDeg})`,
        };
      }
    }

    setPieConfig(config);

    setTransactionsByCategory(transactionsByCategoryTop);
    console.log("BY CATEGORY", byCategory);
  }, [transactions]);

  return (
    <div>
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
                    value.length >= maxChars
                      ? value.slice(0, maxChars) + ".."
                      : value
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
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Pie Chart - Legend</CardTitle>
          <CardDescription>January - June 2024</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={pieConfig}
            className="mx-auto aspect-square max-h-[300px]"
          >
            <PieChart>
              <Pie
                data={transactionsByCategory}
                dataKey="amount"
                color="color"
              />
              <ChartLegend
                content={<ChartLegendContent nameKey="category" />}
                className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
              />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
