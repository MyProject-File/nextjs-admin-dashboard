"use client";

import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function FunnelCvByMonthChart({ labels, values }: { labels: string[]; values: number[] }) {
  const data = {
    labels,
    datasets: [
      {
        label: "Funnel CV",
        data: values,
        backgroundColor: "#06b6d4", // ✅ cyan
        borderRadius: 8,
      },
    ],
  };

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Funnel CV by Month" },
    },
    scales: {
      y: {
        ticks: {
          callback: (v: any) => `€${v / 1000}K`,
        },
      },
    },
  };

  return (
    <div className="h-[320px]">
      <Bar data={data} options={options} />
    </div>
  );
}
