import { chart } from "@/src/client/chart";
import { Computed } from "@legendapp/state/react";
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Line,
  LineChart,
} from "recharts";

export const Chart = () => {
  return (
    <Computed>
      {() => (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chart.state.ticks.get()} >
            <CartesianGrid strokeDasharray={"5 5"} stroke="hsl(var(--bc))" strokeOpacity={0.2}/>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="price" stroke="hsl(var(--in))" />
            <Line type="monotone" dataKey="holder" stroke="#8884d8" />
            <Line type="monotone" dataKey="trader" stroke="#82ca9d" />
            {/* <Line type="monotone" dataKey="takeProfit" stroke="hsl(var(--su))" /> */}
            {/* <Line type="monotone" dataKey="stopLoss" stroke="hsl(var(--er))" /> */}
          </LineChart>
        </ResponsiveContainer>
      )}
    </Computed>
  );
};
