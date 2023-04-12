import { chart } from "@/src/client/chart";
import { Computed } from "@legendapp/state/react";
import { FC } from "react";
import { CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, Line, LineChart } from "recharts";

interface IChartProps {
  lines: { dataKey: string; color: string; dot?: boolean }[];
}
export const Chart: FC<IChartProps> = ({ lines }) => {
  return (
    <Computed>
      {() => (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chart.state.ticks.get()}>
            <CartesianGrid strokeDasharray={"5 5"} stroke="hsl(var(--bc))" strokeOpacity={0.2} />
            <XAxis dataKey="date" />
            <YAxis type="number" domain={["dataMin", "dataMax"]} />
            <Tooltip contentStyle={{ backgroundColor: "hsl(var(--b2))" }} />
            <Legend />
            {lines.map(({ dataKey, color, dot = false }) => (
              <Line key={dataKey} type="monotone" dot={dot} dataKey={dataKey} stroke={color} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </Computed>
  );
};
