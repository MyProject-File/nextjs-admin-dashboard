"use client";

import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function StageDoughnutChart({ labels, values }: { labels: string[]; values: number[] }) {
  const total = values.reduce((a, b) => a + b, 0);

  const percentages = values.map((v) => (total > 0 ? ((v / total) * 100).toFixed(1) : 0));

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: ["#06b6d4", "#1e293b", "#22c55e", "#f59e0b", "#a855f7", "#ef4444", "#94a3b8"],
      },
    ],
  };

  const options: any = {
    plugins: {
      legend: { position: "right" },
      title: { display: true, text: "CV Distribution by Stage" },
    },
  };

  return (
    <div className="h-[350px]">
      <Doughnut data={data} options={options} />
    </div>
  );
}
