"use client";

import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function AccountBarChart({ labels, values }: { labels: string[]; values: number[] }) {
  const data = {
    labels,
    datasets: [
      {
        label: "Funnel CV",
        data: values,
        backgroundColor: "#06b6d4", // blue
        borderRadius: 6,
      },
    ],
  };

  const options: any = {
    indexAxis: "y",
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Funnel CV by Account (Top 10)" },
    },
  };

  return (
    <div className="h-[350px]">
      <Bar data={data} options={options} />
    </div>
  );
}
