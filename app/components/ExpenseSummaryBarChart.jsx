"use client";

import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
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
import { Separator } from "@/components/ui/separator";

export const description = "A bar chart with a label";

const chartConfig = {
  category: {
    label: "Spends",
    color: "var(--bar-chart-color)",
  },
};

function hashHue(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = str.charCodeAt(i) + ((h << 5) - h);
  }
  return ((h % 360) + 360) % 360; // normalize to 0–360
}

function toKey(label) {
  return String(label);
}

function colorForCategory(name) {
  const L = 0.7; // lightness
  const C = 0.4; // chroma (saturation)
  const H = hashHue(name);

  return `oklch(${L} ${C} ${H})`;
}

function hashLightness(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = str.charCodeAt(i) + ((h << 5) - h);
  }

  // map hash → 0.25–0.85 lightness range
  return 0.25 + ((h % 100) / 100) * 0.6;
}

function grayForCategory(name) {
  const L = hashLightness(name); // 0.25–0.85
  return `oklch(${L} 0 0)`; // chroma = 0 = grayscale
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
        config[key] = {
          label: category,

          color: grayForCategory(category),
        };
      }
    }

    setPieConfig(config);

    setTransactionsByCategory(transactionsByCategoryTop);
    console.log("BY CATEGORY", byCategory);
  }, [transactions]);

  const renderLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    value,
    name,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        className="text-foreground"
        x={x}
        y={y}
        textAnchor="middle"
        fill="white"
        dominantBaseline="central"
        fontSize={12}
      >
        ₹{value}
      </text>
    );
  };

  return (
    <div className="py-4">
      <CardHeader className="border-none flex flex-col items-stretch border-b !p-0 sm:flex-col">
        <CardTitle className={"mainLabel"}>Top Spends</CardTitle>
        <CardDescription className="flex items-center subLabel2 gap-2 !text-muted-foreground mr-auto mt-2 sm:mt-0">
          Overview of your top spending categories
          <TrendingUp size={13} className="text-foreground" />
        </CardDescription>
      </CardHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 items-center">
        <Card className="py-4 bg-background w-full sm:py-0 border-none outline-none shadow-none">
          <CardContent className="px-0 w-full sm:p-6 border-none shadow-none outline-none">
            <div className="subLabel2 text-muted-foreground flex mb-3">
              <div className="ml-auto">Bar Chart</div>
            </div>
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
                  <Bar dataKey="amount" fill="var(--color-category)" radius={2}>
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
        <Card className="py-4 sm:block hidden bg-background w-full sm:py-0 border-none outline-none shadow-none">
          <CardContent className="px-0 w-full sm:p-6 border-none shadow-none outline-none">
            <div className="subLabel2 text-muted-foreground flex mb-3">
              <div className="ml-auto">Pie Chart</div>
            </div>
            <ResponsiveContainer width={"100%"} height={300}>
              <ChartContainer config={pieConfig} className={"w-full h-full"}>
                <PieChart>
                  <Pie
                    data={transactionsByCategory}
                    dataKey="amount"
                    nameKey={"category"}
                    label={renderLabel}
                    stroke="#fff"
                    strokeWidth={2}
                    labelLine={false}
                  >
                    {transactionsByCategory.map((item) => (
                      <Cell
                        key={item.category}
                        fill={pieConfig[item.category]?.color}
                      />
                    ))}
                  </Pie>
                  <ChartLegend
                    content={<ChartLegendContent nameKey="category" />}
                    className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
                  />
                </PieChart>
              </ChartContainer>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
