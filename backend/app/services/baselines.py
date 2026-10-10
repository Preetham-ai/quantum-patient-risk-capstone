"""
backend/app/services/baselines.py
Classical Machine Learning Baselines:
- Logistic Regression
- Support Vector Machine (RBF)
- Random Forest
- Gradient Boosted Trees (XGBoost with sklearn GradientBoostingClassifier fallback)
- Multi-Layer Perceptron (MLP)
Includes Stratified 5-Fold Cross Validation and metrics calculation.
"""

import numpy as np
from typing import Dict, Any, List
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.neural_network import MLPClassifier
from sklearn.model_selection import StratifiedKFold
from sklearn.metrics import (
    roc_auc_score,
    accuracy_score,
    f1_score,
    recall_score,
    confusion_matrix,
    brier_score_loss,
)

# Graceful import for XGBoost if libomp.dylib is missing on mac
try:
    from xgboost import XGBClassifier
    _HAVE_XGB = True
except Exception:
    _HAVE_XGB = False


def get_classical_models(seed: int = 42) -> Dict[str, Any]:
    models = {
        "logreg": LogisticRegression(random_state=seed, max_iter=1000, class_weight="balanced"),
        "svm_rbf": SVC(kernel="rbf", probability=True, random_state=seed, class_weight="balanced"),
        "random_forest": RandomForestClassifier(n_estimators=100, max_depth=5, random_state=seed, class_weight="balanced"),
    }
    if _HAVE_XGB:
        models["xgboost"] = XGBClassifier(n_estimators=100, max_depth=3, learning_rate=0.05, random_state=seed, eval_metric="logloss")
    else:
        # Fallback to GradientBoostingClassifier from scikit-learn
        models["xgboost"] = GradientBoostingClassifier(n_estimators=100, max_depth=3, learning_rate=0.05, random_state=seed)
        
    models["mlp"] = MLPClassifier(hidden_layer_sizes=(16, 8), max_iter=1000, random_state=seed, early_stopping=True)
    return models


def evaluate_predictions(y_true: np.ndarray, y_pred: np.ndarray, y_prob: np.ndarray) -> Dict[str, float]:
    cm = confusion_matrix(y_true, y_pred)
    if cm.shape == (2, 2):
        tn, fp, fn, tp = cm.ravel()
        specificity = float(tn / (tn + fp)) if (tn + fp) > 0 else 0.0
        sensitivity = float(tp / (tp + fn)) if (tp + fn) > 0 else 0.0
    else:
        specificity = 0.0
        sensitivity = float(recall_score(y_true, y_pred, zero_division=0))
        
    try:
        auroc = float(roc_auc_score(y_true, y_prob))
    except Exception:
        auroc = 0.5

    return {
        "auroc": round(auroc, 4),
        "accuracy": round(float(accuracy_score(y_true, y_pred)), 4),
        "f1": round(float(f1_score(y_true, y_pred, zero_division=0)), 4),
        "sensitivity": round(sensitivity, 4),
        "specificity": round(specificity, 4),
        "brier_score": round(float(brier_score_loss(y_true, y_prob)), 4),
    }


def run_cross_validation(
    X: np.ndarray,
    y: np.ndarray,
    n_splits: int = 5,
    seed: int = 42
) -> Dict[str, Dict[str, Any]]:
    """
    Runs stratified 5-fold CV across all 5 classical models.
    Returns mean and std for each metric.
    """
    skf = StratifiedKFold(n_splits=n_splits, shuffle=True, random_state=seed)
    models = get_classical_models(seed=seed)
    
    cv_results: Dict[str, Dict[str, List[float]]] = {
        name: {"auroc": [], "accuracy": [], "f1": [], "sensitivity": [], "specificity": [], "brier_score": []}
        for name in models.keys()
    }
    
    for train_idx, val_idx in skf.split(X, y):
        X_train_f, X_val_f = X[train_idx], X[val_idx]
        y_train_f, y_val_f = y[train_idx], y[val_idx]
        
        for name, model_cls in models.items():
            model = model_cls.__class__(**model_cls.get_params())
            model.fit(X_train_f, y_train_f)
            
            y_pred = model.predict(X_val_f)
            if hasattr(model, "predict_proba"):
                y_prob = model.predict_proba(X_val_f)[:, 1]
            else:
                y_prob = model.predict(X_val_f).astype(float)
                
            metrics = evaluate_predictions(y_val_f, y_pred, y_prob)
            for m_key, m_val in metrics.items():
                cv_results[name][m_key].append(m_val)
                
    summary = {}
    for name, m_dict in cv_results.items():
        summary[name] = {
            m_key: {
                "mean": round(float(np.mean(vals)), 4),
                "std": round(float(np.std(vals)), 4)
            }
            for m_key, vals in m_dict.items()
        }
        
    return summary


class TrainedBaselinesEnsemble:
    """
    Holds fit models on full training split for live /compare API inference.
    """
    def __init__(self, seed: int = 42):
        self.models = get_classical_models(seed=seed)
        
    def fit(self, X_train: np.ndarray, y_train: np.ndarray):
        for name, model in self.models.items():
            model.fit(X_train, y_train)
            
    def predict_single(self, X_patient: np.ndarray) -> Dict[str, float]:
        """
        Returns risk probability for each baseline model.
        """
        preds = {}
        for name, model in self.models.items():
            if hasattr(model, "predict_proba"):
                prob = float(model.predict_proba(X_patient)[0, 1])
            else:
                prob = float(model.predict(X_patient)[0])
            preds[name] = round(prob, 4)
        return preds
