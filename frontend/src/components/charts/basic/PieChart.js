import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data, options = {} }) => {
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
          padding: 20
        }
      },
      title: {
        display: !!options.title,
        text: options.title || '圓餅圖'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  const colors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
    '#9966FF', '#FF9F40', '#FF6384', '#C7C7C7'
  ];

  const chartData = {
    labels: data.labels || [],
    datasets: [{
      data: data.data || [],
      backgroundColor: data.backgroundColor || colors.slice(0, data.data?.length || 0),
      borderColor: data.borderColor || '#fff',
      borderWidth: data.borderWidth || 2,
      hoverBorderWidth: 3,
      hoverOffset: 4
    }]
  };

  return <Pie data={chartData} options={{ ...defaultOptions, ...options }} />;
};

export default PieChart;
