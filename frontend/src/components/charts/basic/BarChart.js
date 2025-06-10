import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ data, options = {} }) => {
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: !!options.title,
        text: options.title || '柱狀圖'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
    elements: {
      bar: {
        borderRadius: options.borderRadius || 4,
        borderSkipped: false
      }
    }
  };

  const chartData = {
    labels: data.labels || [],
    datasets: (data.datasets || []).map((dataset, index) => ({
      label: dataset.label || `數據 ${index + 1}`,
      data: dataset.data || [],
      backgroundColor: dataset.backgroundColor || `hsla(${index * 60}, 70%, 50%, 0.7)`,
      borderColor: dataset.borderColor || `hsl(${index * 60}, 70%, 40%)`,
      borderWidth: dataset.borderWidth || 1,
      ...dataset
    }))
  };

  return <Bar data={chartData} options={{ ...defaultOptions, ...options }} />;
};

export default BarChart;