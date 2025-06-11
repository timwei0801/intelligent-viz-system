// ==========================================
// 檔案位置: frontend/src/App.js (完整修復版)
// ==========================================

import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Chip,
  Stack,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  ButtonGroup
} from '@mui/material';
import { 
  Download as DownloadIcon, 
  Delete as DeleteIcon, 
  Settings as SettingsIcon,
  TableChart as TableIcon,
  BarChart as ChartIcon,
  SmartToy as AIIcon,
  Psychology as ClaudeIcon,
  AutoAwesome as HybridIcon,
  Science as VizMLIcon
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  Filler,
} from 'chart.js';
import { 
  Bar, 
  Line, 
  Scatter, 
  Pie, 
  Doughnut,
  Radar,
  PolarArea,
  Bubble 
} from 'react-chartjs-2';
import axios from 'axios';

// 引入 CSS 樣式
import './App.css';

// 導入現有的組件
import { 
  DataPreviewTable, 
  ChartCustomizationDialog, 
  QuickFilterToolbar,
  DataQualityChecker 
} from './DataManipulationComponents';

// 導入新的圖表組件
import PlotlyChart from './components/charts/plotly/PlotlyChart';
import RadarChart from './components/charts/basic/RadarChart';
import { PolarAreaChart, BubbleChart } from './components/charts/basic/PolarBubbleCharts';
import WaterfallChart from './components/charts/advanced/WaterfallChart';
import GaugeChart from './components/charts/business/GaugeChart';

// 條件性導入圖表範例組件
let ChartExamples = null;
try {
  ChartExamples = require('./components/charts/SimpleChartTest').default;
} catch (error) {
  console.log('ChartExamples 組件未找到，將跳過載入');
}

// 註冊 Chart.js 組件
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  ChartTooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  Filler
);

const API_BASE_URL = 'http://localhost:3001';

// 圖表類型配置
const CHART_TYPES = {
  // 基礎圖表
    bar: { name: '長條圖', category: 'basic', color: '#1976d2', icon: '📊' },
  line: { name: '線圖', category: 'basic', color: '#388e3c', icon: '📈' },
  scatter: { name: '散佈圖', category: 'basic', color: '#f57c00', icon: '⚫' },
  pie: { name: '圓餅圖', category: 'basic', color: '#7b1fa2', icon: '🥧' },
  doughnut: { name: '甜甜圈圖', category: 'basic', color: '#c2185b', icon: '🍩' },
  area: { name: '面積圖', category: 'basic', color: '#00796b', icon: '🏔️' },
  radar: { name: '雷達圖', category: 'advanced', color: '#5d4037', icon: '🕸️' },
  polarArea: { name: '極坐標圖', category: 'advanced', color: '#455a64', icon: '🎯' },
  bubble: { name: '氣泡圖', category: 'advanced', color: '#e64a19', icon: '🫧' },
  
  // 新增的 Chart.js 圖表
  stackedbar: { name: '堆疊長條圖', category: 'advanced', color: '#3f51b5', icon: '📊' },
  groupedbar: { name: '分組長條圖', category: 'advanced', color: '#009688', icon: '📊' },
  mixedchart: { name: '混合圖表', category: 'advanced', color: '#ff5722', icon: '📈' },
  horizontalbar: { name: '水平長條圖', category: 'basic', color: '#795548', icon: '📊' },
  stackedarea: { name: '堆疊面積圖', category: 'advanced', color: '#607d8b', icon: '🏔️' },
  gauge: { name: '儀表板圖', category: 'business', color: '#9c27b0', icon: '⏲️' },
  stepline: { name: '階梯線圖', category: 'advanced', color: '#ff9800', icon: '📈' },
  
  // 原有統計圖表
  histogram: { name: '直方圖', category: 'statistical', color: '#3f51b5', icon: '📊' },
  boxplot: { name: '箱型圖', category: 'statistical', color: '#009688', icon: '📦' },
  violin: { name: '小提琴圖', category: 'statistical', color: '#795548', icon: '🎻' },
  heatmap: { name: '熱力圖', category: 'advanced', color: '#ff5722', icon: '🔥' },
  
  // 原有進階圖表
  waterfall: { name: '瀑布圖', category: 'business', color: '#607d8b', icon: '💧' },
  funnel: { name: '漏斗圖', category: 'business', color: '#9c27b0', icon: '🏺' }
};

function App() {
  const [file, setFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [recommendation, setRecommendation] = useState(null);
  const [charts, setCharts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // 新增狀態
  const [mainTab, setMainTab] = useState(0); // 0: 圖表, 1: 資料表, 2: 範例
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [customDialogOpen, setCustomDialogOpen] = useState(false);
  const [currentChartType, setCurrentChartType] = useState('');
  const [filteredData, setFilteredData] = useState(null);

  // 檔案拖放處理
  const onDrop = (acceptedFiles) => {
    const uploadedFile = acceptedFiles[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setError('');
      setAnalysisResult(null);
      setRecommendation(null);
      setCharts([]);
      setSelectedColumns([]);
      setFilteredData(null);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/json': ['.json']
    }
  });

  // 上傳並分析檔案
  const handleFileUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(`${API_BASE_URL}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setAnalysisResult(response.data.data);
      setFilteredData(response.data.data.data); // 初始化篩選資料
    } catch (err) {
      setError(err.response?.data?.error || '檔案上傳失敗');
    } finally {
      setLoading(false);
    }
  };

  // Claude 推薦
  const handleClaudeRecommendation = async () => {
    if (!userInput || !analysisResult) return;

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/api/analyze-intent`, {
        userInput,
        dataInfo: analysisResult.analysis
      });

      setRecommendation({
        claude_recommendation: response.data.data,
        method: 'claude-only'
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Claude 推薦失敗');
    } finally {
      setLoading(false);
    }
  };

  // VizML 推薦
  const handleVizMLRecommendation = async () => {
    if (!analysisResult) return;

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/api/vizml-recommend`, {
        data: filteredData || analysisResult.data
      });

      setRecommendation({
        vizml_recommendation: response.data.vizml_recommendation,
        method: 'vizml-only'
      });
    } catch (err) {
      setError(err.response?.data?.error || 'VizML 推薦失敗');
    } finally {
      setLoading(false);
    }
  };

  // 混合推薦
  const handleHybridRecommendation = async () => {
    if (!userInput || !analysisResult) return;

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/api/hybrid-recommend`, {
        userInput,
        data: filteredData || analysisResult.data,
        dataInfo: analysisResult.analysis
      });

      setRecommendation(response.data);
    } catch (err) {
      setError(err.response?.data?.error || '混合推薦失敗');
    } finally {
      setLoading(false);
    }
  };

  // 生成圖表 (快速生成)
  const handleGenerateChart = async (chartType) => {
    if (!analysisResult) return;

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/api/generate-chart`, {
        data: filteredData || analysisResult.data,
        chartType: chartType,
        dataAnalysis: analysisResult.analysis
      });

      const newChart = {
        id: Date.now(),
        type: chartType,
        config: response.data.chartConfig,
        options: response.data.recommendedOptions,
        timestamp: new Date().toLocaleString(),
        dataSource: `${(filteredData || analysisResult.data).length} 筆資料`
      };

      setCharts(prev => [...prev, newChart]);
    } catch (err) {
      setError(err.response?.data?.error || '圖表生成失敗');
    } finally {
      setLoading(false);
    }
  };

  // 自訂圖表生成
  const handleCustomChart = (chartType) => {
    setCurrentChartType(chartType);
    setCustomDialogOpen(true);
  };

  const handleCustomGenerate = async (config) => {
    if (!analysisResult) return;

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/api/generate-chart`, {
        data: filteredData || analysisResult.data,
        chartType: currentChartType,
        options: config,
        dataAnalysis: analysisResult.analysis
      });

      const newChart = {
        id: Date.now(),
        type: currentChartType,
        config: response.data.chartConfig,
        options: config,
        timestamp: new Date().toLocaleString(),
        dataSource: `${(filteredData || analysisResult.data).length} 筆資料`,
        customized: true
      };

      setCharts(prev => [...prev, newChart]);
    } catch (err) {
      setError(err.response?.data?.error || '自訂圖表生成失敗');
    } finally {
      setLoading(false);
    }
  };

  // 刪除圖表
  const handleDeleteChart = (chartId) => {
    setCharts(prev => prev.filter(chart => chart.id !== chartId));
  };

  // 匯出圖表
  const handleExportChart = (chart) => {
    try {
      const canvas = document.querySelector(`#chart-${chart.id} canvas`);
      if (canvas) {
        const url = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `${chart.type}_chart_${chart.id}.png`;
        link.href = url;
        link.click();
      }
    } catch (err) {
      setError('圖表匯出失敗');
    }
  };

  // 欄位選擇處理
  const handleColumnSelect = (column) => {
    setSelectedColumns(prev => 
      prev.includes(column) 
        ? prev.filter(col => col !== column)
        : [...prev, column]
    );
  };

  // 資料篩選處理
  const handleDataFilter = (filterConfig) => {
    console.log('篩選配置:', filterConfig);
  };

  // 資料排序處理
  const handleDataSort = (column, order) => {
    if (!analysisResult) return;
    
    const sorted = [...(filteredData || analysisResult.data)].sort((a, b) => {
      const aVal = a[column];
      const bVal = b[column];
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return order === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      return order === 'asc' 
        ? aStr.localeCompare(bStr) 
        : bStr.localeCompare(aStr);
    });
    
    setFilteredData(sorted);
  };

  // 資料限制處理
  const handleDataLimit = (limit) => {
    if (!analysisResult) return;
    
    const limited = (filteredData || analysisResult.data).slice(0, limit);
    setFilteredData(limited);
  };

  // 修正後的渲染圖表組件
  const renderChart = (chart) => {
    const { type, config } = chart;
    
    try {
      // 檢查是否為 D3.js 瀑布圖
      if (type.toLowerCase() === 'waterfall') {
        return (
          <WaterfallChart 
            data={config.data} 
            options={config.options} 
          />
        );
      }
      
      // 檢查是否為 Plotly 圖表
      if (config.type === 'plotly') {
        return (
          <PlotlyChart 
            data={config.data} 
            layout={config.layout} 
            options={config.options} 
          />
        );
      }

      // 檢查是否為特殊處理的圖表（儀表板圖）
      if (type.toLowerCase() === 'gauge') {
        return (
          <GaugeChart 
            data={config.data} 
            options={config.options} 
          />
        );
      }
      
      // Chart.js 圖表
      switch (type.toLowerCase()) {
        case 'bar':
        case 'stackedbar':
        case 'groupedbar':
        case 'horizontalbar':
          return <Bar data={config.data} options={config.options} />;
        
        case 'line':
        case 'stepline':
          return <Line data={config.data} options={config.options} />;
        
        case 'area':
        case 'stackedarea':
          return <Line data={config.data} options={config.options} />;
        
        case 'mixedchart':
          return <Bar data={config.data} options={config.options} />;
        
        case 'scatter':
          return <Scatter data={config.data} options={config.options} />;
        case 'pie':
          return <Pie data={config.data} options={config.options} />;
        case 'doughnut':
          return <Doughnut data={config.data} options={config.options} />;
        case 'radar':
          return <RadarChart data={config.data} options={config.options} />;
        case 'polararea':
          return <PolarAreaChart data={config.data} options={config.options} />;
        case 'bubble':
          return <BubbleChart data={config.data} options={config.options} />;
        
        // 統計圖表使用 Plotly
        case 'boxplot':
        case 'box':
        case 'violin':
        case 'histogram':
        case 'heatmap':
          return (
            <PlotlyChart 
              data={config.data} 
              layout={config.layout} 
              options={config.options} 
            />
          );
        
        default:
          return <Bar data={config.data} options={config.options} />;
      }
    } catch (error) {
      console.error('圖表渲染錯誤:', error);
      return (
        <Box sx={{ 
          p: 3, 
          textAlign: 'center',
          border: '2px dashed #f44336',
          borderRadius: 2,
          backgroundColor: '#ffebee'
        }}>
          <Typography color="error" variant="h6" gutterBottom>
            ⚠️ 圖表渲染失敗
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            圖表類型: {type}
          </Typography>
          <Typography variant="caption" color="error" sx={{ fontSize: '0.75rem' }}>
            {error.message}
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Button 
              size="small" 
              variant="outlined" 
              onClick={() => window.location.reload()}
            >
              重新載入頁面
            </Button>
          </Box>
        </Box>
      );
    }
  };

  // 按類別分組圖表類型
  const groupedChartTypes = Object.entries(CHART_TYPES).reduce((acc, [key, value]) => {
    if (!acc[value.category]) {
      acc[value.category] = [];
    }
    acc[value.category].push({ key, ...value });
    return acc;
  }, {});

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
        🎯 智能視覺化推薦系統 v2.0
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* 檔案上傳區域 */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: 'fit-content' }}>
            <Typography variant="h5" gutterBottom>
              📁 上傳資料檔案
            </Typography>
            
            <Box
              {...getRootProps()}
              sx={{
                border: '2px dashed',
                borderColor: isDragActive ? 'primary.main' : 'grey.300',
                borderRadius: 2,
                p: 4,
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: isDragActive ? 'action.hover' : 'transparent',
                mb: 2,
                transition: 'all 0.3s ease'
              }}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <Typography color="primary">放開檔案到這裡...</Typography>
              ) : (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    📤 拖放檔案到這裡
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    支援格式：CSV, Excel, JSON
                  </Typography>
                </Box>
              )}
            </Box>

            {file && (
              <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="body2">
                  <strong>已選擇：</strong>{file.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  大小: {(file.size / 1024).toFixed(1)} KB
                </Typography>
              </Box>
            )}

            <Button
              variant="contained"
              onClick={handleFileUpload}
              disabled={!file || loading}
              fullWidth
              size="large"
            >
              {loading ? <CircularProgress size={24} /> : '🚀 上傳並分析'}
            </Button>
          </Paper>
        </Grid>

        {/* 資料分析結果 */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: 'fit-content' }}>
            <Typography variant="h5" gutterBottom>
              📊 資料分析結果
            </Typography>
            
            {analysisResult ? (
              <Box>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.50', borderRadius: 1 }}>
                      <Typography variant="h4" color="primary">
                        {(filteredData || analysisResult.data).length}
                      </Typography>
                      <Typography variant="body2">
                        {filteredData && filteredData.length !== analysisResult.data.length 
                          ? `篩選後 (原${analysisResult.rowCount})` 
                          : '資料行數'
                        }
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'secondary.50', borderRadius: 1 }}>
                      <Typography variant="h4" color="secondary">
                        {analysisResult.columnCount}
                      </Typography>
                      <Typography variant="body2">欄位數</Typography>
                    </Box>
                  </Grid>
                </Grid>
                
                <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                  📈 欄位類型分布
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                  <Chip 
                    label={`數值型: ${analysisResult.analysis.summary.numericalColumns}`} 
                    color="primary" 
                    size="small" 
                  />
                  <Chip 
                    label={`類別型: ${analysisResult.analysis.summary.categoricalColumns}`} 
                    color="secondary" 
                    size="small" 
                  />
                  <Chip 
                    label={`時間型: ${analysisResult.analysis.summary.temporalColumns}`} 
                    color="success" 
                    size="small" 
                  />
                </Stack>

                <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                  🏷️ 欄位清單
                </Typography>
                <Box sx={{ maxHeight: 150, overflow: 'auto' }}>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {analysisResult.analysis.columns.map((col, index) => (
                      <Chip 
                        key={index} 
                        label={col} 
                        variant={selectedColumns.includes(col) ? "filled" : "outlined"}
                        size="small" 
                        onClick={() => handleColumnSelect(col)}
                        clickable
                        sx={{ mb: 1 }}
                      />
                    ))}
                  </Stack>
                </Box>
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="text.secondary" variant="h6">
                  ⏳ 請先上傳資料檔案
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* 自然語言輸入區域 */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              🗣️ 描述您的視覺化需求
            </Typography>
            
            <TextField
              fullWidth
              multiline
              rows={3}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="例如：我想看看銷售額隨時間的變化趨勢，並且要能夠比較不同產品類別的表現，用顏色區分不同地區的資料..."
              sx={{ mb: 3 }}
            />
            
            {/* AI 推薦按鈕組 */}
            <Box>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AIIcon /> AI 智能推薦
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Button
                    variant="outlined"
                    fullWidth
                    size="large"
                    onClick={handleClaudeRecommendation}
                    disabled={!userInput || !analysisResult || loading}
                    startIcon={<ClaudeIcon />}
                    sx={{ 
                      borderColor: '#FF6B35',
                      color: '#FF6B35',
                      '&:hover': { borderColor: '#FF6B35', backgroundColor: '#FF6B3515' }
                    }}
                  >
                    Claude 語義分析
                  </Button>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Button
                    variant="outlined"
                    fullWidth
                    size="large"
                    onClick={handleVizMLRecommendation}
                    disabled={!analysisResult || loading}
                    startIcon={<VizMLIcon />}
                    sx={{ 
                      borderColor: '#4CAF50',
                      color: '#4CAF50',
                      '&:hover': { borderColor: '#4CAF50', backgroundColor: '#4CAF5015' }
                    }}
                  >
                    VizML 統計分析
                  </Button>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    onClick={handleHybridRecommendation}
                    disabled={!userInput || !analysisResult || loading}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <HybridIcon />}
                    sx={{ 
                      backgroundColor: '#9C27B0',
                      '&:hover': { backgroundColor: '#7B1FA2' }
                    }}
                  >
                    混合智能推薦
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>

        {/* 資料品質檢查區域 */}
        {analysisResult && (
          <Grid item xs={12}>
            <DataQualityChecker 
              data={filteredData || analysisResult.data} 
              analysis={analysisResult.analysis} 
            />
          </Grid>
        )}

        {/* 推薦結果展示 */}
        {recommendation && (
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                🎯 AI 推薦結果
              </Typography>
              
              <Grid container spacing={3}>
                {/* 推薦的圖表類型 */}
                <Grid item xs={12} md={8}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        🤖 推薦的圖表類型
                      </Typography>
                      
                      {/* 根據推薦方法顯示不同的結果 */}
                      {recommendation.method === 'claude-only' && recommendation.claude_recommendation?.chartTypes && (
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                          {recommendation.claude_recommendation.chartTypes.map((chart, index) => (
                            <Button
                              key={index}
                              variant="contained"
                              size="small"
                              onClick={() => handleGenerateChart(chart)}
                              disabled={loading}
                              sx={{ mb: 1 }}
                            >
                              {CHART_TYPES[chart]?.icon} {CHART_TYPES[chart]?.name || chart.toUpperCase()}
                            </Button>
                          ))}
                        </Stack>
                      )}
                      
                      {recommendation.method === 'vizml-only' && recommendation.vizml_recommendation?.prediction?.recommended_charts && (
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                          {recommendation.vizml_recommendation.prediction.recommended_charts.map((chart, index) => (
                            <Button
                              key={index}
                              variant="contained"
                              size="small"
                              onClick={() => handleGenerateChart(chart)}
                              disabled={loading}
                              sx={{ mb: 1 }}
                            >
                              {CHART_TYPES[chart]?.icon} {CHART_TYPES[chart]?.name || chart.toUpperCase()}
                            </Button>
                          ))}
                        </Stack>
                      )}
                      
                      {recommendation.hybrid_analysis?.recommendation && (
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                          {recommendation.hybrid_analysis.recommendation.map((chart, index) => (
                            <Button
                              key={index}
                              variant="contained"
                              size="small"
                              onClick={() => handleGenerateChart(chart)}
                              disabled={loading}
                              sx={{ mb: 1 }}
                            >
                              {CHART_TYPES[chart]?.icon} {CHART_TYPES[chart]?.name || chart.toUpperCase()}
                            </Button>
                          ))}
                        </Stack>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
                
                {/* 推薦理由 */}
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        💡 推薦理由
                      </Typography>
                      
                      {recommendation.claude_recommendation?.reasoning && (
                        <Typography variant="body2" paragraph>
                          <strong>Claude 分析：</strong><br />
                          {recommendation.claude_recommendation.reasoning}
                        </Typography>
                      )}
                      
                      {recommendation.vizml_recommendation?.prediction?.reasoning && (
                        <Typography variant="body2" paragraph>
                          <strong>VizML 分析：</strong><br />
                          {recommendation.vizml_recommendation.prediction.reasoning}
                        </Typography>
                      )}
                      
                      {recommendation.hybrid_analysis && (
                        <Box>
                          <Typography variant="body2" paragraph>
                            <strong>混合分析結果：</strong>
                          </Typography>
                          <Chip 
                            label={`信心度提升: +${Math.round((recommendation.hybrid_analysis.confidence_boost || 0) * 100)}%`}
                            color="success" 
                            size="small" 
                            sx={{ mb: 1 }} 
                          />
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        )}

        {/* 主要內容區域 - 分頁顯示 */}
        {analysisResult && (
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 0 }}>
              <Tabs 
                value={mainTab} 
                onChange={(e, v) => setMainTab(v)} 
                centered
                sx={{ borderBottom: 1, borderColor: 'divider' }}
              >
                <Tab 
                  icon={<ChartIcon />} 
                  label="圖表工作區" 
                  iconPosition="start"
                />
                <Tab 
                  icon={<TableIcon />} 
                  label="資料檢視" 
                  iconPosition="start"
                />
                {ChartExamples && (
                  <Tab 
                    icon={<SettingsIcon />} 
                    label="圖表範例" 
                    iconPosition="start"
                  />
                )}
              </Tabs>

              {/* 圖表工作區 */}
              {mainTab === 0 && (
                <Box sx={{ p: 3 }}>
                  {/* 快速操作工具欄 */}
                  <QuickFilterToolbar
                    data={filteredData || analysisResult.data}
                    analysis={analysisResult.analysis}
                    onFilter={handleDataFilter}
                    onSort={handleDataSort}
                    onLimit={handleDataLimit}
                  />

                  {/* 圖表類型選擇器 */}
                  <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
                    🎨 選擇圖表類型
                  </Typography>
                  
                  {Object.entries(groupedChartTypes).map(([category, chartTypes]) => (
                    <Box key={category} sx={{ mb: 4 }}>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        {category === 'basic' && '📊 基礎圖表'}
                        {category === 'advanced' && '🚀 進階圖表'} 
                        {category === 'statistical' && '📈 統計圖表'}
                        {category === 'business' && '💼 商業圖表'}
                      </Typography>
                      <Box sx={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: 1,
                        alignItems: 'flex-start'
                      }}>
                        {chartTypes.map((chart) => (
                          <Box key={chart.key} sx={{ 
                            mb: 2,
                            minWidth: 'fit-content'
                          }}>
                            <ButtonGroup 
                              variant="outlined" 
                              size="small"
                              sx={{ 
                                height: 'auto',
                                '& .MuiButton-root': {
                                  whiteSpace: 'nowrap',
                                  minHeight: '36px',
                                  px: 2
                                }
                              }}
                            >
                              <Button
                                onClick={() => handleGenerateChart(chart.key)}
                                disabled={loading}
                                sx={{ 
                                  borderColor: chart.color,
                                  color: chart.color,
                                  '&:hover': { 
                                    borderColor: chart.color,
                                    backgroundColor: `${chart.color}15`
                                  }
                                }}
                              >
                                {chart.icon} {chart.name}
                              </Button>
                              <Button
                                onClick={() => handleCustomChart(chart.key)}
                                disabled={loading}
                                sx={{ 
                                  borderColor: chart.color,
                                  color: chart.color,
                                  minWidth: '40px',
                                  px: 1,
                                  '&:hover': { 
                                    borderColor: chart.color,
                                    backgroundColor: `${chart.color}15`
                                  }
                                }}
                              >
                                <SettingsIcon sx={{ fontSize: 16 }} />
                              </Button>
                            </ButtonGroup>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}

              {/* 資料檢視 */}
              {mainTab === 1 && (
                <Box sx={{ p: 3 }}>
                  <DataPreviewTable
                    data={filteredData || analysisResult.data}
                    analysis={analysisResult.analysis}
                    onColumnSelect={handleColumnSelect}
                    selectedColumns={selectedColumns}
                  />
                </Box>
              )}

              {/* 圖表範例 */}
              {mainTab === 2 && ChartExamples && (
                <Box sx={{ p: 3 }}>
                  <ChartExamples />
                </Box>
              )}
            </Paper>
          </Grid>
        )}

        {/* 生成的圖表展示 */}
        {charts.length > 0 && (
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                📈 生成的圖表 ({charts.length})
              </Typography>
              <Grid container spacing={3}>
                {charts.map((chart) => (
                  <Grid item xs={12} lg={6} key={chart.id}>
                    <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Box>
                          <Typography variant="h6">
                            {CHART_TYPES[chart.type]?.icon} {CHART_TYPES[chart.type]?.name || chart.type.toUpperCase()} 圖表
                            {chart.customized && <Chip label="自訂" size="small" color="primary" sx={{ ml: 1 }} />}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            建立時間: {chart.timestamp} | 資料來源: {chart.dataSource}
                          </Typography>
                        </Box>
                        <Stack direction="row" spacing={1}>
                          <Tooltip title="自訂設定">
                            <IconButton onClick={() => handleCustomChart(chart.type)} size="small">
                              <SettingsIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="匯出圖表">
                            <IconButton onClick={() => handleExportChart(chart)} size="small">
                              <DownloadIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="刪除圖表">
                            <IconButton onClick={() => handleDeleteChart(chart.id)} size="small" color="error">
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </Box>
                      <Box id={`chart-${chart.id}`} sx={{ height: 400 }}>
                        {renderChart(chart)}
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* 圖表自訂對話框 */}
      <ChartCustomizationDialog
        open={customDialogOpen}
        onClose={() => setCustomDialogOpen(false)}
        chartType={currentChartType}
        data={filteredData || (analysisResult?.data || [])}
        analysis={analysisResult?.analysis}
        onGenerate={handleCustomGenerate}
      />
    </Container>
  );
}

export default App;