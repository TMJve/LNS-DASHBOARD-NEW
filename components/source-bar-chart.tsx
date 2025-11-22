// components/source-bar-chart.tsx
"use client";

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// 1. Define the type of data we expect
type SourceData = {
  source: string | null;
  count: number;
};

// Define the props for our component
type ChartProps = {
  data: SourceData[];
};

// 2. Define a simple chart config for our "count" data
const chartConfig = {
  count: {
    label: "Leads",
    color: "hsl(var(--chart-1))", // Use the first chart color from globals.css
  },
} satisfies ChartConfig;

export function SourceBarChart({ data }: ChartProps) {
  // 3. Transform data to handle 'null' sources
  const chartData = data.map((item) => ({
    ...item,
    source: item.source || "Unknown",
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Leads by Source</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-[300px]">
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="source" // <-- Use 'source' for the X-axis
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              // Optional: shorten long names
              // tickFormatter={(value) => value.slice(0, 10)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="count" // <-- Use 'count' for the bar height
              fill="var(--color-count)" // Use the color from our config
              radius={8}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}