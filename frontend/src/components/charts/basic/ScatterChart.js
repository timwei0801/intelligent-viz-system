import React from 'react';
import { Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

const ScatterChart = ({ data, options = {} }) => {
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: !!options.title,
        text: options.title || '散佈圖'
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
        radius: options.pointRadius || 5,
        hoverRadius: options.hoverRadius || 8
      }
    }
  };

  const chartData = {
    datasets: (data.datasets || []).map((dataset, index) => ({
      label: dataset.label || `數據 ${index + 1}`,
      data: dataset.data || [],
      backgroundColor: dataset.backgroundColor || `hsla(${index * 60}, 70%, 50%, 0.7)`,
      borderColor: dataset.borderColor || `hsl(${index * 60}, 70%, 40%)`,
      borderWidth: dataset.borderWidth || 1,
      ...dataset
    }))
  };

  return <Scatter data={chartData} options={{ ...defaultOptions, ...options }} />;
};

export default ScatterChart;
