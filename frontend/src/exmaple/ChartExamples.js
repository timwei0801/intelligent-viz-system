import React, { useState } from 'react';
import UnifiedChart from '../components/charts/UnifiedChart';

const ChartExamples = () => {
  // 範例資料
  const [sampleData] = useState({
    // 線圖資料
    lineData: {
      labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
      datasets: [{
        label: '銷售額',
        data: [12, 19, 3, 5, 2, 3],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      }]
    },

    // 柱狀圖資料
    barData: {
      labels: ['產品A', '產品B', '產品C', '產品D'],
      datasets: [{
        label: '銷量',
        data: [300, 500, 200, 400],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 205, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)'
        ]
      }]
    },

    // 圓餅圖資料
    pieData: {
      labels: ['桌機', '筆電', '平板', '手機'],
      data: [30, 25, 15, 30]
    },

    // 面積圖資料
    areaData: {
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      datasets: [
        {
          label: '收入',
          data: [100, 150, 120, 180],
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.3)',
        },
        {
          label: '支出',
          data: [80, 90, 100, 95],
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.3)',
        }
      ]
    },

    // 散佈圖資料
    scatterData: {
      datasets: [{
        label: '數據點',
        data: [
          { x: 10, y: 20 },
          { x: 15, y: 25 },
          { x: 20, y: 30 },
          { x: 25, y: 35 },
          { x: 30, y: 40 }
        ],
        backgroundColor: 'rgba(255, 99, 132, 0.7)'
      }]
    },

    // 多系列資料
    multiSeriesData: {
      labels: ['1月', '2月', '3月', '4月', '5月'],
      datasets: [
        {
          label: '線上銷售',
          data: [65, 59, 80, 81, 56],
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
        },
        {
          label: '實體銷售',
          data: [28, 48, 40, 19, 86],
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
        }
      ]
    }
  });

  const [selectedChart, setSelectedChart] = useState('line');

  const chartTypes = [
    { value: 'line', label: '線圖', data: 'lineData' },
    { value: 'bar', label: '柱狀圖', data: 'barData' },
    { value: 'pie', label: '圓餅圖', data: 'pieData' },
    { value: 'area', label: '面積圖', data: 'areaData' },
    { value: 'scatter', label: '散佈圖', data: 'scatterData' },
    { value: 'stackedArea', label: '堆疊面積圖', data: 'multiSeriesData' },
    { value: 'stackedBar', label: '堆疊柱狀圖', data: 'multiSeriesData' },
    { value: 'horizontalBar', label: '水平柱狀圖', data: 'barData' },
    { value: 'doughnut', label: '甜甜圈圖', data: 'pieData' }
  ];

  const handleError = (error) => {
    console.error('圖表錯誤:', error);
    alert(`圖表載入失敗: ${error.message}`);
  };

  const handleDataChange = (processedData) => {
    console.log('處理後的資料:', processedData);
  };

  return (
    <div className="chart-examples">
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h1>圖表類型展示</h1>
        
        {/* 圖表選擇器 */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ marginRight: '10px' }}>選擇圖表類型：</label>
          <select 
            value={selectedChart} 
            onChange={(e) => setSelectedChart(e.target.value)}
            style={{ 
              padding: '8px 12px', 
              fontSize: '14px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          >
            {chartTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* 圖表展示區域 */}
        <div style={{ 
          height: '500px', 
          border: '1px solid #ddd', 
          borderRadius: '8px',
          padding: '20px',
          backgroundColor: '#fff'
        }}>
          <UnifiedChart
            type={selectedChart}
            data={sampleData[chartTypes.find(t => t.value === selectedChart)?.data]}
            options={{
              title: chartTypes.find(t => t.value === selectedChart)?.label,
              responsive: true,
              maintainAspectRatio: false
            }}
            onError={handleError}
            onDataChange={handleDataChange}
            theme="default"
            interactive={true}
          />
        </div>

        {/* 範例程式碼 */}
        <div style={{ marginTop: '30px' }}>
          <h3>使用方式：</h3>
          <pre style={{ 
            backgroundColor: '#f5f5f5', 
            padding: '15px', 
            borderRadius: '4px',
            overflow: 'auto',
            fontSize: '12px'
          }}>
{`import UnifiedChart from './components/charts/UnifiedChart';

// 基本使用
<UnifiedChart
  type="${selectedChart}"
  data={${JSON.stringify(sampleData[chartTypes.find(t => t.value === selectedChart)?.data], null, 2)}}
  options={{
    title: "${chartTypes.find(t => t.value === selectedChart)?.label}",
    responsive: true
  }}
/>

// 進階使用
<UnifiedChart
  type="${selectedChart}"
  data={data}
  options={options}
  onError={(error) => console.error(error)}
  onDataChange={(processedData) => console.log(processedData)}
  theme="default"
  interactive={true}
  plugins={['tooltip', 'legend']}
/>`}
          </pre>
        </div>

        {/* 支援的圖表類型清單 */}
        <div style={{ marginTop: '30px' }}>
          <h3>目前支援的圖表類型：</h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '10px',
            marginTop: '15px'
          }}>
            {chartTypes.map(type => (
              <div 
                key={type.value}
                style={{
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  backgroundColor: selectedChart === type.value ? '#e3f2fd' : '#f9f9f9',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onClick={() => setSelectedChart(type.value)}
              >
                <strong>{type.label}</strong>
                <br />
                <small style={{ color: '#666' }}>類型: {type.value}</small>
              </div>
            ))}
          </div>
        </div>

        {/* 快速測試區域 */}
        <div style={{ marginTop: '30px' }}>
          <h3>快速測試：</h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
            marginTop: '15px'
          }}>
            {/* 基礎圖表示例 */}
            <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px' }}>
              <h4>基礎線圖</h4>
              <div style={{ height: '200px' }}>
                <UnifiedChart
                  type="line"
                  data={sampleData.lineData}
                  options={{ title: '月度銷售趨勢' }}
                />
              </div>
            </div>

            <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px' }}>
              <h4>基礎柱狀圖</h4>
              <div style={{ height: '200px' }}>
                <UnifiedChart
                  type="bar"
                  data={sampleData.barData}
                  options={{ title: '產品銷量比較' }}
                />
              </div>
            </div>

            <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px' }}>
              <h4>圓餅圖</h4>
              <div style={{ height: '200px' }}>
                <UnifiedChart
                  type="pie"
                  data={sampleData.pieData}
                  options={{ title: '市場佔有率' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartExamples;