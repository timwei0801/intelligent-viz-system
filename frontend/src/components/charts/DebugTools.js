// frontend/src/components/DebugTools.js - 調試工具
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Alert,
  Chip,
  Grid,
  TextField
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BugReportIcon from '@mui/icons-material/BugReport';
import axios from 'axios';

const DebugTools = ({ analysisResult, charts, API_BASE_URL }) => {
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // 測試 API 連接
  const testAPIConnection = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/health`);
      setTestResult({
        type: 'success',
        message: 'API 連接正常',
        data: response.data
      });
    } catch (error) {
      setTestResult({
        type: 'error',
        message: 'API 連接失敗',
        error: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  // 測試圖表生成
  const testChartGeneration = async (chartType = 'bar') => {
    if (!analysisResult) {
      setTestResult({
        type: 'error',
        message: '請先上傳資料'
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/generate-chart`, {
        data: analysisResult.data.slice(0, 5), // 只測試前5筆資料
        chartType: chartType,
        dataAnalysis: analysisResult.analysis
      });

      setTestResult({
        type: 'success',
        message: `${chartType} 圖表生成測試成功`,
        data: {
          success: response.data.success,
          hasConfig: !!response.data.chartConfig,
          hasOptions: !!response.data.recommendedOptions
        }
      });
    } catch (error) {
      setTestResult({
        type: 'error',
        message: `${chartType} 圖表生成測試失敗`,
        error: error.response?.data?.error || error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 2, mt: 2, bgcolor: '#f5f5f5' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <BugReportIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6">調試工具</Typography>
      </Box>

      <Grid container spacing={2}>
        {/* API 測試 */}
        <Grid item xs={12} md={6}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>🔌 API 連接測試</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Button 
                variant="outlined" 
                onClick={testAPIConnection}
                disabled={loading}
                fullWidth
              >
                測試 API 連接
              </Button>
            </AccordionDetails>
          </Accordion>
        </Grid>

        {/* 圖表生成測試 */}
        <Grid item xs={12} md={6}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>📊 圖表生成測試</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button 
                  variant="outlined" 
                  onClick={() => testChartGeneration('bar')}
                  disabled={loading || !analysisResult}
                  size="small"
                >
                  測試長條圖
                </Button>
                <Button 
                  variant="outlined" 
                  onClick={() => testChartGeneration('pie')}
                  disabled={loading || !analysisResult}
                  size="small"
                >
                  測試圓餅圖
                </Button>
                <Button 
                  variant="outlined" 
                  onClick={() => testChartGeneration('line')}
                  disabled={loading || !analysisResult}
                  size="small"
                >
                  測試線圖
                </Button>
              </Box>
            </AccordionDetails>
          </Accordion>
        </Grid>

        {/* 資料狀態 */}
        <Grid item xs={12}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>📋 資料狀態檢查</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    分析結果狀態
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Chip 
                      label={`資料: ${analysisResult ? '✅ 已載入' : '❌ 未載入'}`}
                      color={analysisResult ? 'success' : 'error'}
                      size="small"
                    />
                    <Chip 
                      label={`行數: ${analysisResult?.data?.length || 0}`}
                      color="info"
                      size="small"
                    />
                    <Chip 
                      label={`欄位: ${analysisResult?.analysis?.columns?.length || 0}`}
                      color="info"
                      size="small"
                    />
                    <Chip 
                      label={`數值欄位: ${Object.values(analysisResult?.analysis?.types || {}).filter(t => t === 'numerical').length}`}
                      color="warning"
                      size="small"
                    />
                    <Chip 
                      label={`分類欄位: ${Object.values(analysisResult?.analysis?.types || {}).filter(t => t === 'categorical').length}`}
                      color="secondary"
                      size="small"
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    圖表狀態
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Chip 
                      label={`已生成圖表: ${charts.length}`}
                      color="primary"
                      size="small"
                    />
                    {charts.map((chart, index) => (
                      <Chip 
                        key={chart.id}
                        label={`${index + 1}. ${chart.type}`}
                        variant="outlined"
                        size="small"
                      />
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>

        {/* 測試結果 */}
        {testResult && (
          <Grid item xs={12}>
            <Alert 
              severity={testResult.type} 
              onClose={() => setTestResult(null)}
              sx={{ mt: 1 }}
            >
              <Typography variant="body2" fontWeight="bold">
                {testResult.message}
              </Typography>
              {testResult.error && (
                <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                  錯誤: {testResult.error}
                </Typography>
              )}
              {testResult.data && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="caption">
                    詳細資訊: {JSON.stringify(testResult.data, null, 2)}
                  </Typography>
                </Box>
              )}
            </Alert>
          </Grid>
        )}

        {/* 原始資料預覽 */}
        {analysisResult && (
          <Grid item xs={12}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>🔍 原始資料預覽</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TextField
                  multiline
                  rows={8}
                  fullWidth
                  value={JSON.stringify({
                    sampleData: analysisResult.data.slice(0, 3),
                    analysis: analysisResult.analysis,
                    columns: analysisResult.analysis?.columns,
                    types: analysisResult.analysis?.types
                  }, null, 2)}
                  variant="outlined"
                  InputProps={{
                    sx: { fontFamily: 'monospace', fontSize: '0.8rem' }
                  }}
                  label="資料結構"
                />
              </AccordionDetails>
            </Accordion>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};

export default DebugTools;