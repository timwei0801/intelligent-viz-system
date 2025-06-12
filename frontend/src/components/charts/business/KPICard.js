import React from 'react';
import { TrendingUp, TrendingDown, Minus, Target, DollarSign, Users, ShoppingCart, BarChart3 } from 'lucide-react';

const KPICard = ({ data, options = {} }) => {
  if (!data || !data.kpis || !Array.isArray(data.kpis) || data.kpis.length === 0) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '400px',
        border: '2px dashed #ccc',
        borderRadius: '8px',
        color: '#666',
        backgroundColor: '#f9f9f9'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
          <div style={{ fontSize: '16px', fontWeight: 'bold' }}>KPI 卡片需要指標資料</div>
          <div style={{ fontSize: '12px', marginTop: '8px', color: '#999' }}>
            請提供 KPI 指標、數值和變化趨勢資料
          </div>
        </div>
      </div>
    );
  }

  const getIcon = (iconType) => {
    const iconMap = {
      'revenue': DollarSign,
      'users': Users,
      'sales': ShoppingCart,
      'analytics': BarChart3,
      'target': Target,
      'default': BarChart3
    };
    
    const IconComponent = iconMap[iconType] || iconMap['default'];
    return <IconComponent size={24} />;
  };

  const getTrendIcon = (trend) => {
    if (trend > 0) return <TrendingUp size={16} color="#4CAF50" />;
    if (trend < 0) return <TrendingDown size={16} color="#F44336" />;
    return <Minus size={16} color="#757575" />;
  };

  const getTrendColor = (trend) => {
    if (trend > 0) return '#4CAF50';
    if (trend < 0) return '#F44336';
    return '#757575';
  };

  const formatNumber = (value, format = 'number') => {
    if (value === null || value === undefined) return 'N/A';
    
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('zh-TW', { 
          style: 'currency', 
          currency: 'TWD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(value);
      case 'percentage':
        return `${value.toFixed(1)}%`;
      case 'compact':
        if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
        if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
        return value.toString();
      default:
        return value.toLocaleString();
    }
  };

  const getProgressPercentage = (current, target) => {
    if (!target || target === 0) return 0;
    return Math.min(100, Math.max(0, (current / target) * 100));
  };

  const kpiCards = data.kpis.map((kpi, index) => (
    <div 
      key={index}
      style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e9ecef',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
      }}
    >
      {/* 背景裝飾 */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        right: '-20%',
        width: '120px',
        height: '120px',
        background: `linear-gradient(135deg, ${kpi.color || '#2196F3'}20, ${kpi.color || '#2196F3'}10)`,
        borderRadius: '50%',
        opacity: 0.3
      }} />

      {/* 標題和圖標 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '16px'
      }}>
        <div>
          <h3 style={{
            margin: 0,
            fontSize: '14px',
            fontWeight: '500',
            color: '#6c757d',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            {kpi.title || `KPI ${index + 1}`}
          </h3>
          {kpi.subtitle && (
            <p style={{
              margin: '4px 0 0 0',
              fontSize: '12px',
              color: '#adb5bd',
              fontWeight: '400'
            }}>
              {kpi.subtitle}
            </p>
          )}
        </div>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: `linear-gradient(135deg, ${kpi.color || '#2196F3'}, ${kpi.color || '#1976D2'})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          flexShrink: 0
        }}>
          {getIcon(kpi.icon)}
        </div>
      </div>

      {/* 主要數值 */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#2c3e50',
          lineHeight: 1,
          marginBottom: '4px'
        }}>
          {formatNumber(kpi.value, kpi.format)}
        </div>
        
        {/* 趨勢指標 */}
        {kpi.trend !== undefined && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '14px',
            color: getTrendColor(kpi.trend)
          }}>
            {getTrendIcon(kpi.trend)}
            <span style={{ fontWeight: '500' }}>
              {Math.abs(kpi.trend).toFixed(1)}%
            </span>
            <span style={{ color: '#6c757d', fontSize: '12px' }}>
              {kpi.trendPeriod || '較上期'}
            </span>
          </div>
        )}
      </div>

      {/* 進度條（如果有目標值） */}
      {kpi.target && (
        <div style={{ marginBottom: '12px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '6px'
          }}>
            <span style={{ fontSize: '12px', color: '#6c757d' }}>
              目標進度
            </span>
            <span style={{ fontSize: '12px', fontWeight: '500', color: '#2c3e50' }}>
              {getProgressPercentage(kpi.value, kpi.target).toFixed(0)}%
            </span>
          </div>
          <div style={{
            width: '100%',
            height: '6px',
            backgroundColor: '#e9ecef',
            borderRadius: '3px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${getProgressPercentage(kpi.value, kpi.target)}%`,
              height: '100%',
              background: `linear-gradient(90deg, ${kpi.color || '#2196F3'}, ${kpi.color || '#1976D2'})`,
              borderRadius: '3px',
              transition: 'width 0.8s ease'
            }} />
          </div>
          <div style={{
            fontSize: '11px',
            color: '#adb5bd',
            marginTop: '4px'
          }}>
            目標: {formatNumber(kpi.target, kpi.format)}
          </div>
        </div>
      )}

      {/* 額外指標 */}
      {kpi.secondary && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          paddingTop: '12px',
          borderTop: '1px solid #e9ecef'
        }}>
          {kpi.secondary.map((item, idx) => (
            <div key={idx} style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#2c3e50'
              }}>
                {formatNumber(item.value, item.format)}
              </div>
              <div style={{
                fontSize: '11px',
                color: '#6c757d',
                marginTop: '2px'
              }}>
                {item.label}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  ));

  return (
    <div style={{
      padding: '20px',
      height: '100%',
      overflow: 'auto',
      backgroundColor: '#f8f9fa'
    }}>
      {options.title && (
        <h2 style={{
          margin: '0 0 24px 0',
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#2c3e50',
          textAlign: 'center'
        }}>
          {options.title}
        </h2>
      )}
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(${options.cardMinWidth || '280px'}, 1fr))`,
        gap: '20px',
        alignItems: 'start'
      }}>
        {kpiCards}
      </div>
    </div>
  );
};

export default KPICard;