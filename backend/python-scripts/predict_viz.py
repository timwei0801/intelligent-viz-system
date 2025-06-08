
import sys
import json
import numpy as np
from sklearn.ensemble import RandomForestClassifier
import warnings
warnings.filterwarnings('ignore')

def predict_visualization(features):
    """基於特徵預測最佳視覺化類型"""
    
    # 簡化的規則基礎預測（可以後續用機器學習模型替換）
    features = np.array(features)
    
    # 提取關鍵特徵指標
    num_rows = features[0] if len(features) > 0 else 0
    num_cols = features[1] if len(features) > 1 else 0
    num_numeric = features[2] if len(features) > 2 else 0
    num_categorical = features[3] if len(features) > 3 else 0
    
    predictions = []
    confidences = []
    
    # 規則基礎的推薦邏輯
    if num_categorical >= 2 and num_numeric >= 1:
        predictions.extend(['bar', 'grouped_bar'])
        confidences.extend([0.9, 0.8])
    
    if num_numeric >= 2:
        predictions.extend(['scatter', 'line'])
        confidences.extend([0.85, 0.8])
    
    if num_categorical >= 1 and num_numeric >= 1:
        predictions.extend(['pie', 'donut'])
        confidences.extend([0.7, 0.6])
    
    if num_rows > 100:
        predictions.extend(['histogram', 'density'])
        confidences.extend([0.75, 0.7])
    
    # 預設推薦
    if not predictions:
        predictions = ['bar', 'line']
        confidences = [0.6, 0.5]
    
    return {
        'charts': predictions[:5],  # 返回前5個推薦
        'confidence': max(confidences) if confidences else 0.6,
        'reasoning': f"Based on {int(num_numeric)} numeric and {int(num_categorical)} categorical columns"
    }

def main():
    try:
        features_json = sys.argv[1]
        features_data = json.loads(features_json)
        features = features_data['features']
        
        prediction = predict_visualization(features)
        
        result = {
            "recommended_charts": prediction['charts'],
            "confidence": prediction['confidence'],
            "reasoning": prediction['reasoning'],
            "feature_analysis": {
                "num_features": len(features),
                "feature_summary": "Modern feature analysis completed"
            },
            "status": "success"
        }
        
        print(json.dumps(result, ensure_ascii=False))
        
    except Exception as e:
        print(json.dumps({"error": str(e), "status": "error"}, ensure_ascii=False))
        sys.exit(1)

if __name__ == "__main__":
    main()
