import React from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const RadarChart = ({ data, options = {} }) => {
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: !!options.title,
        text: options.title || '雷達圖'
      }
    },
    scales: {
      r: {
        beginAtZero: true,
        max: options.max || 100,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        angleLines: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        pointLabels: {
          font: {
            size: 12
          }
        }
      }
    },
    elements: {
      line: {
        borderWidth: 2
      },
      point: {
        radius: 3,
        hoverRadius: 5
      }
    }
  };

  const chartData = {
    labels: data.labels || [],
    datasets: (data.datasets || []).map((dataset, index) => ({
      label: dataset.label || `數據 ${index + 1}`,
      data: dataset.data || [],
      borderColor: dataset.borderColor || `hsl(${index * 60}, 70%, 50%)`,
      backgroundColor: dataset.backgroundColor || `hsla(${index * 60}, 70%, 50%, 0.2)`,
      pointBackgroundColor: dataset.pointBackgroundColor || dataset.borderColor,
      pointBorderColor: dataset.pointBorderColor || '#fff',
      pointHoverBackgroundColor: dataset.pointHoverBackgroundColor || '#fff',
      pointHoverBorderColor: dataset.pointHoverBorderColor || dataset.borderColor,
      borderWidth: dataset.borderWidth || 2,
      pointRadius: dataset.pointRadius || 3,
      ...dataset
    }))
  };

  return <Radar data={chartData} options={{ ...defaultOptions, ...options }} />;
};

export default RadarChart;