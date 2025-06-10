// 資料格式驗證工具
export const validateData = (data, expectedFormat) => {
  if (!data) {
    throw new Error('資料不能為空');
  }

  switch (expectedFormat) {
    case 'timeseries':
      if (!data.labels || !Array.isArray(data.labels)) {
        throw new Error('時間序列資料需要 labels 陣列');
      }
      if (!data.datasets || !Array.isArray(data.datasets)) {
        throw new Error('時間序列資料需要 datasets 陣列');
      }
      break;
    
    case 'categorical':
      if (!data.labels || !data.data) {
        throw new Error('分類資料需要 labels 和 data');
      }
      break;
    
    case 'scatter':
      if (!data.datasets || !Array.isArray(data.datasets)) {
        throw new Error('散佈圖資料需要 datasets 陣列');
      }
      break;
  }
  
  return true;
};

// 自動偵測資料格式
export const detectDataFormat = (data) => {
  if (data.labels && data.datasets) {
    return 'timeseries';
  }
  if (data.labels && data.data && !data.datasets) {
    return 'categorical';
  }
  if (data.datasets && data.datasets[0]?.data?.[0]?.x !== undefined) {
    return 'scatter';
  }
  if (Array.isArray(data)) {
    return 'array';
  }
  return 'unknown';
};

// ========== 基礎圖表處理器 ==========

// 線圖處理器
export const lineProcessor = (data, options = {}) => {
  validateData(data, 'timeseries');
  
  return {
    labels: data.labels,
    datasets: data.datasets.map((dataset, index) => ({
      label: dataset.label || `數據 ${index + 1}`,
      data: dataset.data,
      borderColor: dataset.borderColor || `hsl(${index * 60}, 70%, 50%)`,
      backgroundColor: dataset.backgroundColor || `hsla(${index * 60}, 70%, 50%, 0.1)`,
      tension: options.smooth ? 0.4 : 0.1,
      fill: options.fill || false,
      pointRadius: options.showPoints !== false ? 4 : 0,
      ...dataset
    }))
  };
};

// 面積圖處理器
export const areaProcessor = (data, options = {}) => {
  validateData(data, 'timeseries');
  
  return {
    labels: data.labels,
    datasets: data.datasets.map((dataset, index) => ({
      label: dataset.label || `數據 ${index + 1}`,
      data: dataset.data,
      borderColor: dataset.borderColor || `hsl(${index * 60}, 70%, 50%)`,
      backgroundColor: dataset.backgroundColor || `hsla(${index * 60}, 70%, 50%, 0.3)`,
      tension: 0.4,
      fill: true,
      pointRadius: 0,
      ...dataset
    }))
  };
};

// 堆疊面積圖處理器
export const stackedAreaProcessor = (data, options = {}) => {
  validateData(data, 'timeseries');
  
  return {
    labels: data.labels,
    datasets: data.datasets.map((dataset, index) => ({
      label: dataset.label || `數據 ${index + 1}`,
      data: dataset.data,
      borderColor: dataset.borderColor || `hsl(${index * 60}, 70%, 50%)`,
      backgroundColor: dataset.backgroundColor || `hsla(${index * 60}, 70%, 50%, 0.6)`,
      tension: 0.4,
      fill: 'origin',
      pointRadius: 0,
      ...dataset
    }))
  };
};

// 柱狀圖處理器
export const barProcessor = (data, options = {}) => {
  // 支援多種資料格式
  if (data.labels && data.datasets) {
    // Chart.js 標準格式
    return {
      labels: data.labels,
      datasets: data.datasets.map((dataset, index) => ({
        label: dataset.label || `數據 ${index + 1}`,
        data: dataset.data,
        backgroundColor: dataset.backgroundColor || `hsla(${index * 60}, 70%, 50%, 0.7)`,
        borderColor: dataset.borderColor || `hsl(${index * 60}, 70%, 40%)`,
        borderWidth: dataset.borderWidth || 1,
        borderRadius: options.borderRadius || 4,
        ...dataset
      }))
    };
  }
  
  // 簡化格式: { labels: [], data: [] }
  if (data.labels && data.data) {
    return {
      labels: data.labels,
      datasets: [{
        label: options.label || '數據',
        data: data.data,
        backgroundColor: options.backgroundColor || 'hsla(210, 70%, 50%, 0.7)',
        borderColor: options.borderColor || 'hsl(210, 70%, 40%)',
        borderWidth: 1,
        borderRadius: options.borderRadius || 4
      }]
    };
  }
  
  throw new Error('柱狀圖需要 labels 和 data 或 datasets');
};

// 水平柱狀圖處理器
export const horizontalBarProcessor = (data, options = {}) => {
  const processedData = barProcessor(data, options);
  return {
    ...processedData,
    indexAxis: 'y' // Chart.js v3+ 語法
  };
};

// 堆疊柱狀圖處理器
export const stackedBarProcessor = (data, options = {}) => {
  validateData(data, 'timeseries');
  
  return {
    labels: data.labels,
    datasets: data.datasets.map((dataset, index) => ({
      label: dataset.label || `數據 ${index + 1}`,
      data: dataset.data,
      backgroundColor: dataset.backgroundColor || `hsla(${index * 60}, 70%, 50%, 0.7)`,
      borderColor: dataset.borderColor || `hsl(${index * 60}, 70%, 40%)`,
      borderWidth: 1,
      stack: dataset.stack || 'Stack 0',
      ...dataset
    }))
  };
};

// 群組柱狀圖處理器
export const groupedBarProcessor = (data, options = {}) => {
  validateData(data, 'timeseries');
  
  return {
    labels: data.labels,
    datasets: data.datasets.map((dataset, index) => ({
      label: dataset.label || `數據 ${index + 1}`,
      data: dataset.data,
      backgroundColor: dataset.backgroundColor || `hsla(${index * 60}, 70%, 50%, 0.7)`,
      borderColor: dataset.borderColor || `hsl(${index * 60}, 70%, 40%)`,
      borderWidth: 1,
      borderRadius: 4,
      ...dataset
    }))
  };
};

// 圓餅圖處理器
export const pieProcessor = (data, options = {}) => {
  // 支援簡化格式
  if (data.labels && data.data) {
    const colors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
      '#9966FF', '#FF9F40', '#FF6384', '#C7C7C7'
    ];
    
    return {
      labels: data.labels,
      datasets: [{
        data: data.data,
        backgroundColor: data.backgroundColor || colors.slice(0, data.data.length),
        borderColor: '#fff',
        borderWidth: 2,
        hoverBorderWidth: 3,
        hoverOffset: 4
      }]
    };
  }
  
  // Chart.js 標準格式
  if (data.labels && data.datasets) {
    return data;
  }
  
  throw new Error('圓餅圖需要 labels 和 data');
};

// 甜甜圈圖處理器（繼承圓餅圖處理器）
export const doughnutProcessor = (data, options = {}) => {
  return pieProcessor(data, options);
};

// 散佈圖處理器
export const scatterProcessor = (data, options = {}) => {
  if (data.datasets) {
    return {
      datasets: data.datasets.map((dataset, index) => ({
        label: dataset.label || `數據 ${index + 1}`,
        data: dataset.data, // 應該是 [{x: 1, y: 2}, ...] 格式
        backgroundColor: dataset.backgroundColor || `hsla(${index * 60}, 70%, 50%, 0.7)`,
        borderColor: dataset.borderColor || `hsl(${index * 60}, 70%, 40%)`,
        pointRadius: dataset.pointRadius || 5,
        ...dataset
      }))
    };
  }
  
  // 自動轉換簡單陣列格式
  if (Array.isArray(data) && data[0]?.x !== undefined) {
    return {
      datasets: [{
        label: options.label || '數據',
        data: data,
        backgroundColor: options.backgroundColor || 'hsla(210, 70%, 50%, 0.7)',
        borderColor: options.borderColor || 'hsl(210, 70%, 40%)',
        pointRadius: options.pointRadius || 5
      }]
    };
  }
  
  throw new Error('散佈圖需要 datasets 或座標點陣列');
};

// 氣泡圖處理器
export const bubbleProcessor = (data, options = {}) => {
  if (data.datasets) {
    return {
      datasets: data.datasets.map((dataset, index) => ({
        label: dataset.label || `數據 ${index + 1}`,
        data: dataset.data, // 應該是 [{x: 1, y: 2, r: 10}, ...] 格式
        backgroundColor: dataset.backgroundColor || `hsla(${index * 60}, 70%, 50%, 0.5)`,
        borderColor: dataset.borderColor || `hsl(${index * 60}, 70%, 40%)`,
        borderWidth: dataset.borderWidth || 1,
        ...dataset
      }))
    };
  }
  
  throw new Error('氣泡圖需要包含 x, y, r 座標的資料點');
};

// 雷達圖處理器
export const radarProcessor = (data, options = {}) => {
  validateData(data, 'timeseries');
  
  return {
    labels: data.labels,
    datasets: data.datasets.map((dataset, index) => ({
      label: dataset.label || `數據 ${index + 1}`,
      data: dataset.data,
      borderColor: dataset.borderColor || `hsl(${index * 60}, 70%, 50%)`,
      backgroundColor: dataset.backgroundColor || `hsla(${index * 60}, 70%, 50%, 0.2)`,
      borderWidth: dataset.borderWidth || 2,
      pointRadius: dataset.pointRadius || 3,
      pointHoverRadius: dataset.pointHoverRadius || 5,
      ...dataset
    }))
  };
};

// 極座標圖處理器
export const polarAreaProcessor = (data, options = {}) => {
  return pieProcessor(data, options); // 使用相同的處理邏輯
};

// 時間序列處理器
export const timeSeriesProcessor = (data, options = {}) => {
  // 確保時間格式正確
  if (data.labels) {
    const processedLabels = data.labels.map(label => {
      if (typeof label === 'string') {
        return new Date(label);
      }
      return label;
    });
    
    return {
      ...lineProcessor(data, options),
      labels: processedLabels
    };
  }
  
  return lineProcessor(data, options);
};

// 迷你圖處理器
export const sparklineProcessor = (data, options = {}) => {
  const processedData = lineProcessor(data, options);
  
  // 移除圖例和標題
  return {
    ...processedData,
    options: {
      plugins: {
        legend: { display: false },
        title: { display: false }
      },
      scales: {
        x: { display: false },
        y: { display: false }
      },
      elements: {
        point: { radius: 0 }
      }
    }
  };
};

// 階梯線圖處理器
export const steppedProcessor = (data, options = {}) => {
  const processedData = lineProcessor(data, options);
  
  return {
    ...processedData,
    datasets: processedData.datasets.map(dataset => ({
      ...dataset,
      stepped: true,
      tension: 0
    }))
  };
};

// 多軸處理器
export const multiAxisProcessor = (data, options = {}) => {
  validateData(data, 'timeseries');
  
  return {
    labels: data.labels,
    datasets: data.datasets.map((dataset, index) => ({
      label: dataset.label || `數據 ${index + 1}`,
      data: dataset.data,
      borderColor: dataset.borderColor || `hsl(${index * 60}, 70%, 50%)`,
      backgroundColor: dataset.backgroundColor || `hsla(${index * 60}, 70%, 50%, 0.1)`,
      yAxisID: dataset.yAxisID || (index === 0 ? 'y' : 'y1'),
      ...dataset
    }))
  };
};

// 處理器註冊表
export const PROCESSORS = {
  lineProcessor,
  areaProcessor,
  stackedAreaProcessor,
  barProcessor,
  horizontalBarProcessor,
  stackedBarProcessor,
  groupedBarProcessor,
  pieProcessor,
  doughnutProcessor,
  scatterProcessor,
  bubbleProcessor,
  radarProcessor,
  polarAreaProcessor,
  timeSeriesProcessor,
  sparklineProcessor,
  steppedProcessor,
  multiAxisProcessor
};

// 獲取處理器的輔助函數
export const getProcessor = (processorName) => {
  const processor = PROCESSORS[processorName];
  if (!processor) {
    throw new Error(`找不到處理器: ${processorName}`);
  }
  return processor;
};