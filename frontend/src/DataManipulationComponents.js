import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Grid,
  Switch,
  FormControlLabel,
  Autocomplete,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Collapse,
  Slider,
  Divider,
  Alert,
  LinearProgress,
  Badge
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Settings as SettingsIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  Analytics as AnalyticsIcon,
  TableChart as TableChartIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';

// ⭐ 導入統計學配置
import { getStatisticalChartConfig } from './utils/chartStatistics';

// 資料預覽表格組件
export const DataPreviewTable = ({ data, analysis, onColumnSelect, selectedColumns = [] }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [expandedStats, setExpandedStats] = useState(false);

  // 安全檢查
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">沒有資料可顯示</Typography>
      </Paper>
    );
  }

  const columns = Object.keys(data[0] || {});
  
  if (columns.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">資料格式錯誤</Typography>
      </Paper>
    );
  }
  
  // 排序資料
  const sortedData = [...data].sort((a, b) => {
    if (!sortColumn) return 0;
    const aVal = a[sortColumn];
    const bVal = b[sortColumn];
    
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    }
    
    const aStr = String(aVal || '').toLowerCase();
    const bStr = String(bVal || '').toLowerCase();
    return sortDirection === 'asc' 
      ? aStr.localeCompare(bStr) 
      : bStr.localeCompare(aStr);
  });

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const getColumnType = (column) => {
    return analysis?.types?.[column] || 'unknown';
  };

  const getColumnColor = (type) => {
    switch (type) {
      case 'numerical': return 'primary';
      case 'categorical': return 'secondary';
      case 'temporal': return 'success';
      default: return 'default';
    }
  };

  const getColumnStats = (column) => {
    return analysis?.stats?.[column] || {};
  };

  return (
    <Paper sx={{ width: '100%', mb: 2 }}>
      {/* 資料統計摘要 */}
      <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TableChartIcon />
            資料預覽 ({data.length} 筆，{columns.length} 欄)
          </Typography>
          <Button
            size="small"
            onClick={() => setExpandedStats(!expandedStats)}
            endIcon={<ExpandMoreIcon sx={{ transform: expandedStats ? 'rotate(180deg)' : 'none' }} />}
          >
            {expandedStats ? '收起' : '展開'} 統計
          </Button>
        </Box>
        
        <Collapse in={expandedStats}>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              {columns.map(column => {
                const type = getColumnType(column);
                const stats = getColumnStats(column);
                return (
                  <Grid item xs={12} sm={6} md={4} key={column}>
                    <Card variant="outlined" sx={{ p: 1 }}>
                      <Typography variant="subtitle2" noWrap>{column}</Typography>
                      <Chip size="small" color={getColumnColor(type)} label={type} />
                      {stats.uniqueValues && (
                        <Typography variant="caption" color="text.secondary">
                          唯一值: {stats.uniqueValues}
                        </Typography>
                      )}
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        </Collapse>
      </Box>

      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell key={column} sx={{ minWidth: 120 }}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Button
                      size="small"
                      onClick={() => handleSort(column)}
                      sx={{ textTransform: 'none', justifyContent: 'flex-start', minWidth: 0 }}
                    >
                      <Typography variant="subtitle2" noWrap>
                        {column}
                      </Typography>
                      <SortIcon fontSize="small" 
                        sx={{ opacity: sortColumn === column ? 1 : 0.3 }} />
                    </Button>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                    <Chip 
                      size="small" 
                      color={getColumnColor(getColumnType(column))} 
                      label={getColumnType(column)} 
                    />
                    {onColumnSelect && (
                      <IconButton
                        size="small"
                        onClick={() => onColumnSelect(column)}
                        color={selectedColumns.includes(column) ? 'primary' : 'default'}
                      >
                        <AddIcon fontSize="small" 
                          sx={{ opacity: selectedColumns.includes(column) ? 1 : 0.3 }} />
                      </IconButton>
                    )}
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <TableRow key={index} hover>
                  {columns.map(column => (
                    <TableCell key={column}>
                      <Typography variant="body2" noWrap>
                        {row[column] || ''}
                      </Typography>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        component="div"
        count={data.length}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        labelRowsPerPage="每頁行數："
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} / 共 ${count} 筆`}
      />
    </Paper>
  );
};

// 圖表自訂對話框
export const ChartCustomizationDialog = ({ 
  open, 
  onClose, 
  chartType, 
  data, 
  analysis, 
  onGenerate,
  currentConfig = {} 
}) => {
  const [tabValue, setTabValue] = useState(0);
  const [config, setConfig] = useState({
    // 資料設定
    xColumn: '',
    yColumn: '',
    groupBy: '',
    colorBy: '',
    sizeBy: '',
    
    // 篩選設定
    filters: [],
    dateRange: { start: '', end: '' },
    valueRange: { min: '', max: '' },
    
    // 樣式設定
    title: '',
    xAxisTitle: '',
    yAxisTitle: '',
    colorScheme: 'default',
    showLegend: true,
    showGridlines: true,
    
    // 聚合設定
    aggregation: 'sum',
    sortBy: '',
    sortOrder: 'asc',
    limit: 100,
    
    ...currentConfig
  });

  // 將所有變數計算移到 Hook 之前
  const hasValidData = data && Array.isArray(data) && data.length > 0;
  const columns = hasValidData ? Object.keys(data[0] || {}) : [];
  const numericalColumns = hasValidData ? columns.filter(col => 
    analysis?.types?.[col] === 'numerical'
  ) : [];
  const categoricalColumns = hasValidData ? columns.filter(col => 
    analysis?.types?.[col] === 'categorical'
  ) : [];
  const temporalColumns = hasValidData ? columns.filter(col => 
    analysis?.types?.[col] === 'temporal'
  ) : [];

  // ⭐ 使用統計學配置邏輯
  useEffect(() => {
    if (chartType && columns.length > 0) {
      console.log('🔬 使用統計學配置邏輯');
      
      // 使用統計學原理的配置
      const statisticalConfig = getStatisticalChartConfig(
        chartType, 
        numericalColumns, 
        categoricalColumns, 
        temporalColumns, 
        columns
      );

      console.log('📊 統計學推薦配置:', statisticalConfig);

      // 將統計學配置應用到狀態
      setConfig(prev => ({ 
        ...prev, 
        ...statisticalConfig,
        // 保留使用者自訂的設定
        title: statisticalConfig.title || prev.title,
        xAxisTitle: prev.xAxisTitle || statisticalConfig.xColumn,
        yAxisTitle: prev.yAxisTitle || statisticalConfig.yColumn || statisticalConfig.valueColumn
      }));
    }
  }, [chartType, columns.length, numericalColumns.length, categoricalColumns.length, temporalColumns.length]);

  // 安全檢查
  if (!hasValidData) {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogContent>
          <Typography>請先上傳資料</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>關閉</Button>
        </DialogActions>
      </Dialog>
    );
  }

  const handleGenerate = () => {
    console.log('🚀 生成圖表，最終配置:', config);
    onGenerate(config);
    onClose();
  };

  // 修正 Select 組件的樣式，解決文字被遮住的問題
  const selectStyles = {
    '& .MuiSelect-select': {
      paddingTop: '16px',
      paddingBottom: '16px',
      minHeight: '24px',
      display: 'flex',
      alignItems: 'center'
    },
    '& .MuiInputLabel-root': {
      zIndex: 1,
      backgroundColor: 'white',
      paddingX: '4px'
    },
    '& .MuiInputLabel-shrink': {
      transform: 'translate(14px, -9px) scale(0.75)',
      backgroundColor: 'white',
      paddingX: '4px'
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'rgba(0, 0, 0, 0.23)'
      },
      '&:hover fieldset': {
        borderColor: 'rgba(0, 0, 0, 0.87)'
      }
    }
  };

  const renderDataTab = () => (
    <Box sx={{ p: 2 }}>
      {/* 統計學建議提示 */}
      {config.description && (
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>統計學建議：</strong>{config.description}
          </Typography>
          {config.statisticalPurpose && (
            <Typography variant="caption" color="text.secondary">
              用途：{config.statisticalPurpose}
            </Typography>
          )}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* X軸選擇 */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth sx={selectStyles}>
            <InputLabel>X軸 (主要維度)</InputLabel>
            <Select
              value={config.xColumn || ''}
              label="X軸 (主要維度)"
              onChange={(e) => setConfig(prev => ({ ...prev, xColumn: e.target.value }))}
            >
              {columns.map(col => (
                <MenuItem key={col} value={col}>
                  {col} ({analysis?.types?.[col] || 'unknown'})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Y軸選擇 */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth sx={selectStyles}>
            <InputLabel>Y軸 (數值)</InputLabel>
            <Select
              value={config.yColumn || config.valueColumn || ''}
              label="Y軸 (數值)"
              onChange={(e) => setConfig(prev => ({ 
                ...prev, 
                yColumn: e.target.value,
                valueColumn: e.target.value  // 同時更新 valueColumn
              }))}
            >
              {columns.map(col => (
                <MenuItem key={col} value={col}>
                  {col} ({analysis?.types?.[col] || 'unknown'})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* 分組依據（適用於堆疊圖、分組圖等） */}
        {['stackedbar', 'groupedbar', 'stackedarea', 'mixedchart'].includes(chartType) && (
          <Grid item xs={12} md={6}>
            <FormControl fullWidth sx={selectStyles}>
              <InputLabel>分組依據</InputLabel>
              <Select
                value={config.groupBy || config.groupByColumn || ''}
                label="分組依據"
                onChange={(e) => setConfig(prev => ({ 
                  ...prev, 
                  groupBy: e.target.value,
                  groupByColumn: e.target.value  // 同時更新 groupByColumn
                }))}
              >
                <MenuItem value="">無分組</MenuItem>
                {categoricalColumns.map(col => (
                  <MenuItem key={col} value={col}>{col}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}

        {/* 氣泡大小（僅氣泡圖） */}
        {chartType === 'bubble' && (
          <Grid item xs={12} md={6}>
            <FormControl fullWidth sx={selectStyles}>
              <InputLabel>氣泡大小</InputLabel>
              <Select
                value={config.sizeBy || config.sizeColumn || ''}
                label="氣泡大小"
                onChange={(e) => setConfig(prev => ({ 
                  ...prev, 
                  sizeBy: e.target.value,
                  sizeColumn: e.target.value
                }))}
              >
                {numericalColumns.map(col => (
                  <MenuItem key={col} value={col}>{col}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}

        {/* 混合圖表的特殊設定 */}
        {chartType === 'mixedchart' && (
          <>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth sx={selectStyles}>
                <InputLabel>柱狀圖數值</InputLabel>
                <Select
                  value={config.barColumn || ''}
                  label="柱狀圖數值"
                  onChange={(e) => setConfig(prev => ({ ...prev, barColumn: e.target.value }))}
                >
                  {numericalColumns.map(col => (
                    <MenuItem key={col} value={col}>{col}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth sx={selectStyles}>
                <InputLabel>線圖數值</InputLabel>
                <Select
                  value={config.lineColumn || ''}
                  label="線圖數值"
                  onChange={(e) => setConfig(prev => ({ ...prev, lineColumn: e.target.value }))}
                >
                  {numericalColumns.map(col => (
                    <MenuItem key={col} value={col}>{col}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </>
        )}

        {/* 圓餅圖和甜甜圈圖的標籤設定 */}
        {['pie', 'doughnut'].includes(chartType) && (
          <Grid item xs={12} md={6}>
            <FormControl fullWidth sx={selectStyles}>
              <InputLabel>標籤欄位</InputLabel>
              <Select
                value={config.labelColumn || config.xColumn || ''}
                label="標籤欄位"
                onChange={(e) => setConfig(prev => ({ 
                  ...prev, 
                  labelColumn: e.target.value,
                  xColumn: e.target.value
                }))}
              >
                {categoricalColumns.map(col => (
                  <MenuItem key={col} value={col}>{col}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}
      </Grid>
    </Box>
  );

  const renderFilterTab = () => (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>篩選條件</Typography>
      <Grid container spacing={3}>
        {/* 資料範圍限制 */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom>資料範圍</Typography>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <FormControl fullWidth sx={selectStyles}>
                <InputLabel>排序依據</InputLabel>
                <Select
                  value={config.sortBy}
                  label="排序依據"
                  onChange={(e) => setConfig(prev => ({ ...prev, sortBy: e.target.value }))}
                >
                  <MenuItem value="">不排序</MenuItem>
                  {columns.map(col => (
                    <MenuItem key={col} value={col}>{col}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth sx={selectStyles}>
                <InputLabel>排序方式</InputLabel>
                <Select
                  value={config.sortOrder}
                  label="排序方式"
                  onChange={(e) => setConfig(prev => ({ ...prev, sortOrder: e.target.value }))}
                >
                  <MenuItem value="asc">升序</MenuItem>
                  <MenuItem value="desc">降序</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="顯示筆數"
                type="number"
                size="small"
                fullWidth
                value={config.limit}
                onChange={(e) => setConfig(prev => ({ ...prev, limit: parseInt(e.target.value) || 100 }))}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );

  const renderStyleTab = () => (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={3}>
        {/* 標題設定 */}
        <Grid item xs={12}>
          <TextField
            label="圖表標題"
            fullWidth
            value={config.title}
            onChange={(e) => setConfig(prev => ({ ...prev, title: e.target.value }))}
          />
        </Grid>
        
        <Grid item xs={6}>
          <TextField
            label="X軸標題"
            fullWidth
            value={config.xAxisTitle}
            onChange={(e) => setConfig(prev => ({ ...prev, xAxisTitle: e.target.value }))}
          />
        </Grid>
        
        <Grid item xs={6}>
          <TextField
            label="Y軸標題"
            fullWidth
            value={config.yAxisTitle}
            onChange={(e) => setConfig(prev => ({ ...prev, yAxisTitle: e.target.value }))}
          />
        </Grid>

        {/* 顏色主題 */}
        <Grid item xs={12}>
          <FormControl fullWidth sx={selectStyles}>
            <InputLabel>顏色主題</InputLabel>
            <Select
              value={config.colorScheme}
              label="顏色主題"
              onChange={(e) => setConfig(prev => ({ ...prev, colorScheme: e.target.value }))}
            >
              <MenuItem value="default">預設</MenuItem>
              <MenuItem value="viridis">漸層藍</MenuItem>
              <MenuItem value="plasma">漸層紫</MenuItem>
              <MenuItem value="warm">暖色調</MenuItem>
              <MenuItem value="cool">冷色調</MenuItem>
              <MenuItem value="business">商務風格</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* 顯示選項 */}
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={config.showLegend}
                onChange={(e) => setConfig(prev => ({ ...prev, showLegend: e.target.checked }))}
              />
            }
            label="顯示圖例"
          />
        </Grid>
        
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={config.showGridlines}
                onChange={(e) => setConfig(prev => ({ ...prev, showGridlines: e.target.checked }))}
              />
            }
            label="顯示網格線"
          />
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <SettingsIcon />
        🎨 自訂 {chartType?.toUpperCase()} 圖表
        {config.statisticalPurpose && (
          <Chip size="small" label={config.statisticalPurpose} color="primary" />
        )}
      </DialogTitle>
      
      <DialogContent sx={{ p: 0 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} centered>
          <Tab label="📊 資料設定" />
          <Tab label="🔍 篩選條件" />
          <Tab label="🎨 樣式設定" />
        </Tabs>
        
        {tabValue === 0 && renderDataTab()}
        {tabValue === 1 && renderFilterTab()}
        {tabValue === 2 && renderStyleTab()}
      </DialogContent>
      
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>取消</Button>
        <Button 
          variant="contained" 
          onClick={handleGenerate}
          disabled={!config.xColumn && !config.valueColumn}
          startIcon={<AddIcon />}
        >
          生成圖表
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// 快速篩選工具欄
export const QuickFilterToolbar = ({ data, analysis, onFilter, onSort, onLimit }) => {
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [limit, setLimit] = useState(100);
  const [filterExpanded, setFilterExpanded] = useState(false);

  if (!data || !Array.isArray(data) || data.length === 0) {
    return null;
  }

  const columns = Object.keys(data[0] || {});

  // Select 組件的統一樣式 - 修正文字被遮住問題
  const selectStyles = {
    '& .MuiSelect-select': {
      paddingTop: '14px',
      paddingBottom: '14px',
      minHeight: '20px',
      display: 'flex',
      alignItems: 'center'
    },
    '& .MuiInputLabel-root': {
      zIndex: 1,
      backgroundColor: 'white',
      paddingX: '4px'
    },
    '& .MuiInputLabel-shrink': {
      transform: 'translate(14px, -9px) scale(0.75)',
      backgroundColor: 'white',
      paddingX: '4px'
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'rgba(0, 0, 0, 0.23)'
      }
    }
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AnalyticsIcon /> 快速操作
        </Typography>
        <Tooltip title="展開進階篩選">
          <IconButton onClick={() => setFilterExpanded(!filterExpanded)}>
            <ExpandMoreIcon 
              sx={{ 
                transform: filterExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s'
              }} 
            />
          </IconButton>
        </Tooltip>
      </Box>
      
      <Grid container spacing={2} alignItems="center">
        {/* 快速篩選 */}
        <Grid item xs={12} md={3}>
          <FormControl fullWidth size="small" sx={selectStyles}>
            <InputLabel 
              shrink={false}
              sx={{ 
                zIndex: 1,
                backgroundColor: 'white',
                paddingX: '4px',
                '&.MuiInputLabel-shrink': {
                  transform: 'translate(14px, -6px) scale(0.75)',
                  backgroundColor: 'white',
                  paddingX: '4px'
                }
              }}
            >
              快速篩選
            </InputLabel>
            <Select 
              defaultValue="" 
              label="快速篩選"
              sx={{
                '& .MuiSelect-select': {
                  paddingTop: '8px',
                  paddingBottom: '8px',
                  minHeight: '20px',
                  display: 'flex',
                  alignItems: 'center'
                }
              }}
            >
              <MenuItem value="">全部資料</MenuItem>
              <MenuItem value="top10">前10筆</MenuItem>
              <MenuItem value="top100">前100筆</MenuItem>
              <MenuItem value="recent">最近資料</MenuItem>
              <MenuItem value="outliers">異常值</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* 排序 */}
        <Grid item xs={12} md={3}>
          <FormControl fullWidth size="small" sx={selectStyles}>
            <InputLabel 
              sx={{ 
                zIndex: 1,
                backgroundColor: 'white',
                paddingX: '4px',
                '&.MuiInputLabel-shrink': {
                  transform: 'translate(14px, -6px) scale(0.75)',
                  backgroundColor: 'white',
                  paddingX: '4px'
                }
              }}
            >
              排序欄位
            </InputLabel>
            <Select
              value={sortBy}
              label="排序欄位"
              onChange={(e) => setSortBy(e.target.value)}
              sx={{
                '& .MuiSelect-select': {
                  paddingTop: '8px',
                  paddingBottom: '8px',
                  minHeight: '20px',
                  display: 'flex',
                  alignItems: 'center'
                }
              }}
            >
              <MenuItem value="">不排序</MenuItem>
              {columns.map(col => (
                <MenuItem key={col} value={col}>{col}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={2}>
          <FormControl fullWidth size="small" sx={selectStyles}>
            <InputLabel 
              sx={{ 
                zIndex: 1,
                backgroundColor: 'white',
                paddingX: '4px',
                '&.MuiInputLabel-shrink': {
                  transform: 'translate(14px, -6px) scale(0.75)',
                  backgroundColor: 'white',
                  paddingX: '4px'
                }
              }}
            >
              順序
            </InputLabel>
            <Select
              value={sortOrder}
              label="順序"
              onChange={(e) => setSortOrder(e.target.value)}
              sx={{
                '& .MuiSelect-select': {
                  paddingTop: '8px',
                  paddingBottom: '8px',
                  minHeight: '20px',
                  display: 'flex',
                  alignItems: 'center'
                }
              }}
            >
              <MenuItem value="asc">升序</MenuItem>
              <MenuItem value="desc">降序</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* 限制筆數 */}
        <Grid item xs={12} md={2}>
          <TextField
            label="顯示筆數"
            type="number"
            size="small"
            fullWidth
            value={limit}
            onChange={(e) => setLimit(parseInt(e.target.value) || 100)}
          />
        </Grid>

        <Grid item xs={12} md={2}>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => {
              onSort?.(sortBy, sortOrder);
              onLimit?.(limit);
            }}
            startIcon={<RefreshIcon />}
          >
            套用
          </Button>
        </Grid>
      </Grid>

      {/* 進階篩選區域 */}
      <Collapse in={filterExpanded}>
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Alert severity="info" sx={{ mb: 2 }}>
              💡 提示：可以組合多個條件進行精確篩選，就像 Power BI 和 Tableau 一樣！
            </Alert>
          </Grid>
          
          {/* 數值欄位快速統計 */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom>
              📈 數值欄位快速統計
            </Typography>
            {columns
              .filter(col => analysis?.types?.[col] === 'numerical')
              .slice(0, 3)
              .map(col => {
                const stats = analysis?.stats?.[col] || {};
                return (
                  <Box key={col} sx={{ mb: 1, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="body2" fontWeight="bold">{col}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      範圍: {stats.min?.toFixed(2)} - {stats.max?.toFixed(2)} | 
                      平均: {stats.mean?.toFixed(2)} | 
                      筆數: {stats.count}
                    </Typography>
                  </Box>
                );
              })}
          </Grid>

          {/* 類別欄位統計 */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom>
              🏷️ 類別欄位統計
            </Typography>
            {columns
              .filter(col => analysis?.types?.[col] === 'categorical')
              .slice(0, 3)
              .map(col => {
                const stats = analysis?.stats?.[col] || {};
                return (
                  <Box key={col} sx={{ mb: 1, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="body2" fontWeight="bold">{col}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      唯一值: {stats.uniqueCount} | 總筆數: {stats.count}
                    </Typography>
                    {stats.categories && (
                      <Box sx={{ mt: 0.5 }}>
                        {stats.categories.slice(0, 3).map((cat, idx) => (
                          <Chip key={idx} label={cat} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                        ))}
                        {stats.categories.length > 3 && (
                          <Chip label={`+${stats.categories.length - 3}個`} size="small" />
                        )}
                      </Box>
                    )}
                  </Box>
                );
              })}
          </Grid>
        </Grid>
      </Collapse>
    </Paper>
  );
};

// 新增：資料品質檢查組件
export const DataQualityChecker = ({ data, analysis }) => {
  const [expanded, setExpanded] = useState(false);

  if (!data || !Array.isArray(data) || data.length === 0) {
    return null;
  }

  const columns = Object.keys(data[0] || {});
  
  // 計算資料品質指標
  const qualityMetrics = {
    completeness: 0,
    duplicates: 0,
    outliers: 0,
    consistency: 0
  };

  // 計算完整度
  const totalCells = data.length * columns.length;
  const emptyCells = data.reduce((count, row) => {
    return count + columns.reduce((cellCount, col) => {
      const value = row[col];
      return cellCount + (value === null || value === undefined || value === '' ? 1 : 0);
    }, 0);
  }, 0);
  qualityMetrics.completeness = Math.round(((totalCells - emptyCells) / totalCells) * 100);

  // 計算重複行數
  const uniqueRows = new Set(data.map(row => JSON.stringify(row)));
  qualityMetrics.duplicates = data.length - uniqueRows.size;

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AssessmentIcon /> 資料品質檢查
        </Typography>
        <IconButton onClick={() => setExpanded(!expanded)}>
          <ExpandMoreIcon 
            sx={{ 
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s'
            }} 
          />
        </IconButton>
      </Box>

      <Box sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={6} md={3}>
            <Box textAlign="center">
              <Typography variant="h4" color={qualityMetrics.completeness > 90 ? 'success.main' : 'warning.main'}>
                {qualityMetrics.completeness}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                資料完整度
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box textAlign="center">
              <Typography variant="h4" color={qualityMetrics.duplicates === 0 ? 'success.main' : 'error.main'}>
                {qualityMetrics.duplicates}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                重複行數
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box textAlign="center">
              <Typography variant="h4" color="info.main">
                {data.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                總行數
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box textAlign="center">
              <Typography variant="h4" color="info.main">
                {columns.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                總欄位數
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Collapse in={expanded}>
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1" gutterBottom>
          📋 詳細品質報告
        </Typography>
        
        {/* 缺失值分析 */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>缺失值分析</Typography>
          {columns.map(col => {
            const missingCount = data.filter(row => 
              row[col] === null || row[col] === undefined || row[col] === ''
            ).length;
            const missingPercent = Math.round((missingCount / data.length) * 100);
            
            return (
              <Box key={col} sx={{ mb: 1 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2">{col}</Typography>
                  <Typography variant="body2" color={missingPercent > 10 ? 'error' : 'text.secondary'}>
                    {missingCount} ({missingPercent}%)
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={100 - missingPercent} 
                  sx={{ height: 4, borderRadius: 2 }}
                  color={missingPercent > 10 ? 'error' : 'success'}
                />
              </Box>
            );
          })}
        </Box>

        {/* 建議 */}
        <Alert severity="info">
          <Typography variant="body2" fontWeight="bold">🔧 改善建議：</Typography>
          <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
            {qualityMetrics.completeness < 90 && (
              <li>考慮處理缺失值：填充、插值或移除不完整的記錄</li>
            )}
            {qualityMetrics.duplicates > 0 && (
              <li>發現 {qualityMetrics.duplicates} 筆重複資料，建議清理</li>
            )}
            <li>建議在視覺化前先進行資料清理以獲得更準確的結果</li>
          </ul>
        </Alert>
      </Collapse>
    </Paper>
  );
};