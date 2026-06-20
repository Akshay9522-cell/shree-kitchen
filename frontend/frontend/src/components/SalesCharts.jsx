import { useEffect, useState } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import { getSalesAnalytics } from "../services/adminService";

export default function SalesChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const res = await getSalesAnalytics();

      console.log("API RESPONSE:", res.data);

      // Backend already returns:
      // [{ month: "Jun", revenue: 2445 }]

      setData(res.data.sales || []);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">
        Sales Analytics
      </h2>

     <ResponsiveContainer width="100%" height={350}>
  <LineChart data={data}>
    <CartesianGrid strokeDasharray="3 3" />

    <XAxis dataKey="month" />

    <YAxis />

    <Tooltip
      formatter={(value) => [
        `₹${value}`,
        "Revenue",
      ]}
    />

    <Line
      type="monotone"
      dataKey="revenue"
      strokeWidth={3}
      dot={{ r: 6 }}
    />
  </LineChart>
</ResponsiveContainer>
    </div>
  );
}