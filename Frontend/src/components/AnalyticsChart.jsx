import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip);

const data = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Revenue",
      data: [5000, 7000, 8000, 12000, 15000, 18000],
      backgroundColor: "rgba(75, 192, 192, 0.5)",
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: "Monthly Revenue",
    },
  },
};

function AnalyticsChart() {
  return <Bar data={data} options={options} />;
}

export default AnalyticsChart;
