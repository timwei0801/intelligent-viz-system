import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AreaChart = ({ data, options = {} }) => {
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: !!options.title,
        text: options.title || '面積圖'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        stacked: options.stacked || false,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      x: {
        stacked: options.stacked || false,
        grid: {
          display: false
        }
      }
    },
    elements: {
      line: {
        tension: 0.4
      },
      point: {
        radius: 0,
        hoverRadius: 5
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  const chartData = {
    labels: data.labels || [],
    datasets: (data.datasets || []).map((dataset, index) => ({
      label: dataset.label || `數據 ${index + 1}`,
      data: dataset.data || [],
      borderColor: dataset.borderColor || `hsl(${index * 60}, 70%, 50%)`,
      backgroundColor: dataset.backgroundColor || `hsla(${index * 60}, 70%, 50%, 0.3)`,
      borderWidth: dataset.borderWidth || 2,
      fill: true,
      ...dataset
    }))
  };

  return <Line data={chartData} options={{ ...defaultOptions, ...options }} />;
};

export default AreaChart;