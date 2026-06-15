import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const PriceTrends = () => {
  // Chart Data
  const data = {
    labels: [
      "Jul 2022",
      "Jan 2023",
      "Jul 2023",
      "Jan 2024",
      "Jul 2024",
      "Dec 2024",
    ],
    datasets: [
      {
        label: "Kalpataru Jade Skyline",
        data: [8000, 8500, 9000, 9500, 10000, 10700],
        borderColor: "#6C63FF",
        backgroundColor: "rgba(108, 99, 255, 0.2)",
        tension: 0.4,
      },
      {
        label: "Baner",
        data: [7500, 7800, 8000, 8200, 8500, 9000],
        borderColor: "#FF6384",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.4,
      },
    ],
  };

  // Chart Options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: { size: 12 },
        },
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: { callback: (value) => `₹${value / 1000}K` },
      },
    },
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-md max-w-5xl mx-auto">
      {/* Title Section */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Price Trends for Kalpataru Jade Skyline vs. Baner{" "}
          <span className="text-sm text-gray-500">(Apartments)</span>
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          <span className="text-green-600 font-bold">6.40%</span> appreciation
          in avg. price / sq.ft (Built-up Area) for Kalpataru Jade Skyline in
          last 1 year
        </p>
      </div>

      {/* Timeframe Selector */}
      <div className="flex justify-end mb-4">
        <p className="text-sm text-gray-600 border border-gray-300 rounded-md px-3 py-1 cursor-pointer hover:bg-gray-100">
          In last 5 years
        </p>
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-lg p-4 shadow-lg mb-6">
        <Line data={data} options={options} />
      </div>

      {/* Comparison Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Add More to Compare Button */}
        <div className="border-2 border-dashed border-rose-500 rounded-lg p-4 flex flex-col items-center justify-center my-text hover:bg-rose-100 cursor-pointer">
          <p className="text-xl font-bold">+</p>
          <p className="text-sm">ADD MORE to compare</p>
        </div>

        {/* Project Card */}
        <div className="border rounded-lg shadow-md p-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-1">PROJECT</h3>
          <p className="text-base font-semibold text-gray-800">
            Kalpataru Jade Skyline
          </p>
          <p className="text-green-600 font-semibold text-sm">6.40%</p>
          <p className="text-sm text-gray-500">₹10.7K/sq.ft</p>
          <p className="text-xs text-gray-400">Last 1 Year Avg. rate</p>
        </div>

        {/* Locality Card */}
        <div className="border rounded-lg shadow-md p-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-1">
            LOCALITY (Apartments)
          </h3>
          <p className="text-base font-semibold text-gray-800">Baner</p>
          <p className="text-green-600 font-semibold text-sm">1.76%</p>
          <p className="text-sm text-gray-500">₹10.1K/sq.ft</p>
          <p className="text-xs text-gray-400">Last 1 Year Avg. rate</p>
        </div>
      </div>
    </div>
  );
};

export default PriceTrends;
