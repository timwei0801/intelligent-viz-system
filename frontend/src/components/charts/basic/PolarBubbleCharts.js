import React from 'react';
import { PolarArea, Bubble } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(RadialLinearScale, ArcElement, LinearScale, PointElement, Tooltip, Legend);

export const PolarAreaChart = ({ data, options = {} }) => {
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: !!options.title,
        text: options.title || '極坐標圖'
      }
    },
    scales: {
      r: {
        beginAtZero: true
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
      data: data.data || data.datasets?.[0]?.data || [],
      backgroundColor: data.backgroundColor || colors.slice(0, data.data?.length || 0),
      borderColor: data.borderColor || '#fff',
      borderWidth: data.borderWidth || 2,
      ...data.datasets?.[0]
    }]
  };

  return <PolarArea data={chartData} options={{ ...defaultOptions, ...options }} />;
};

export const BubbleChart = ({ data, options = {} }) => {
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: !!options.title,
        text: options.title || '氣泡圖'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const point = context.parsed;
            return `(${point.x}, ${point.y}) 大小: ${point._custom || 'N/A'}`;
          }
        }
      }
    },
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        title: {
          display: !!options.xAxisTitle,
          text: options.xAxisTitle || 'X軸'
        }
      },
      y: {
        title: {
          display: !!options.yAxisTitle,
          text: options.yAxisTitle || 'Y軸'
        }
      }
    },
    elements: {
      point: {
        borderWidth: 1
      }
    }
  };

  const chartData = {
    datasets: (data.datasets || []).map((dataset, index) => ({
      label: dataset.label || `數據 ${index + 1}`,
      data: dataset.data || [],
      backgroundColor: dataset.backgroundColor || `hsla(${index * 60}, 70%, 50%, 0.6)`,
      borderColor: dataset.borderColor || `hsl(${index * 60}, 70%, 40%)`,
      borderWidth: dataset.borderWidth || 1,
      ...dataset
    }))
  };

  return <Bubble data={chartData} options={{ ...defaultOptions, ...options }} />;
};

export default { PolarAreaChart, BubbleChart };