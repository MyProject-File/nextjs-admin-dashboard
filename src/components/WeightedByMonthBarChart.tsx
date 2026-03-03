"use client";

import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function WeightedByMonthBarChart({ labels, values }: { labels: string[]; values: number[] }) {
  const data = {
    labels,
    datasets: [
      {
        label: "Weighted CV",
        data: values,
        backgroundColor: "#10b981", // green
        borderRadius: 6,
      },
    ],
  };

  const options: any = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Funnel Weighted CV by Month" },
    },
  };

  return (
    <div className="h-[350px]">
      <Bar data={data} options={options} />
    </div>
  );
}
