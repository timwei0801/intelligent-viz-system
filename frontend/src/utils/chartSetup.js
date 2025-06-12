import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// 註冊所有必要的 Chart.js 組件
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

// 設定 Chart.js 全域預設值
ChartJS.defaults.font = {
  family: "'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
  size: 12
};

ChartJS.defaults.color = '#666';
ChartJS.defaults.responsive = true;
ChartJS.defaults.maintainAspectRatio = false;

export default ChartJS;

export const getDefaultChartOptions = (chartType) => {
  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      tooltip: {
        enabled: true
      }
    }
  };

  switch (chartType?.toLowerCase()) {
    case 'pie':
    case 'doughnut':
      return {
        ...baseOptions,
        plugins: {
          ...baseOptions.plugins,
          legend: { position: 'bottom' }
        }
      };
    
    case 'radar':
      return {
        ...baseOptions,
        scales: {
          r: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0,0,0,0.1)'
            },
            angleLines: {
              color: 'rgba(0,0,0,0.1)'
            },
            pointLabels: {
              font: { size: 10 }
            }
          }
        }
      };
    
    case 'polararea':
      return {
        ...baseOptions,
        scales: {
          r: {
            beginAtZero: true
          }
        }
      };

    case 'bubble':
      return {
        ...baseOptions,
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
            grid: { color: 'rgba(0,0,0,0.1)' }
          },
          y: {
            type: 'linear',
            grid: { color: 'rgba(0,0,0,0.1)' }
          }
        }
      };

    case 'scatter':
      return {
        ...baseOptions,
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
            grid: { color: 'rgba(0,0,0,0.1)' }
          },
          y: {
            type: 'linear',
            grid: { color: 'rgba(0,0,0,0.1)' }
          }
        }
      };

    // === 新增的圖表類型選項 ===
    case 'horizontalbar':
      return {
        ...baseOptions,
        indexAxis: 'y',
        scales: {
          x: { 
            beginAtZero: true,
            grid: { color: 'rgba(0,0,0,0.1)' }
          },
          y: { 
            type: 'category',
            grid: { color: 'rgba(0,0,0,0.1)' }
          }
        }
      };

    case 'stackedbar':
      return {
        ...baseOptions,
        scales: {
          x: { 
            stacked: true,
            grid: { color: 'rgba(0,0,0,0.1)' }
          },
          y: { 
            stacked: true, 
            beginAtZero: true,
            grid: { color: 'rgba(0,0,0,0.1)' }
          }
        }
      };

    case 'groupedbar':
      return {
        ...baseOptions,
        scales: {
          x: { grid: { color: 'rgba(0,0,0,0.1)' } },
          y: { 
            beginAtZero: true,
            grid: { color: 'rgba(0,0,0,0.1)' }
          }
        }
      };

    case 'stackedarea':
      return {
        ...baseOptions,
        scales: {
          x: { 
            stacked: true,
            grid: { color: 'rgba(0,0,0,0.1)' }
          },
          y: { 
            stacked: true, 
            beginAtZero: true,
            grid: { color: 'rgba(0,0,0,0.1)' }
          }
        },
        elements: {
          line: { 
            fill: true,
            tension: 0.4
          }
        }
      };

    case 'stepline':
      return {
        ...baseOptions,
        scales: {
          x: { grid: { color: 'rgba(0,0,0,0.1)' } },
          y: { 
            beginAtZero: true,
            grid: { color: 'rgba(0,0,0,0.1)' }
          }
        },
        elements: {
          line: { 
            stepped: true,
            tension: 0
          }
        }
      };

    case 'mixedchart':
      return {
        ...baseOptions,
        scales: {
          x: { grid: { color: 'rgba(0,0,0,0.1)' } },
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            beginAtZero: true,
            grid: { color: 'rgba(0,0,0,0.1)' }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            beginAtZero: true,
            grid: {
              drawOnChartArea: false,
              color: 'rgba(0,0,0,0.1)'
            }
          }
        }
      };

    case 'gauge':
      return {
        ...baseOptions,
        cutout: '80%',
        rotation: Math.PI,
        circumference: Math.PI,
        plugins: {
          ...baseOptions.plugins,
          legend: { display: false },
          tooltip: { enabled: false }
        }
      };

    case 'area':
      return {
        ...baseOptions,
        scales: {
          x: { grid: { color: 'rgba(0,0,0,0.1)' } },
          y: { 
            beginAtZero: true,
            grid: { color: 'rgba(0,0,0,0.1)' }
          }
        },
        elements: {
          line: { 
            fill: true,
            tension: 0.4
          }
        }
      };
    
    default:
      return {
        ...baseOptions,
        scales: {
          x: { grid: { color: 'rgba(0,0,0,0.1)' } },
          y: { 
            beginAtZero: true,
            grid: { color: 'rgba(0,0,0,0.1)' }
          }
        }
      };
  }
};