"""
backend/app/services/preprocess.py
Clinical dataset loading, imputation, mutual-information feature ranking,
and quantum angle normalization ([0, pi]).
"""

import os
import joblib
import numpy as np
import pandas as pd
from typing import Tuple, List, Dict, Any, Optional
from sklearn.model_selection import train_test_split, StratifiedKFold
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from sklearn.feature_selection import mutual_info_classif
from sklearn.impute import SimpleImputer


class ClinicalDataPreprocessor:
    """
    Handles preprocessing for clinical conditions (Heart Disease, Diabetes):
    - Missing value imputation (including Pima hidden zeros)
    - Mutual information ranking to top n qubits (n = 4, 6, 8)
    - Quantum angle rescaling into [0, pi]
    """

    def __init__(self, condition: str = "heart", n_qubits: int = 4, seed: int = 42):
        self.condition = condition.lower()
        self.n_qubits = n_qubits
        self.seed = seed
        
        self.feature_names: List[str] = []
        self.selected_features: List[str] = []
        self.mi_scores: Dict[str, float] = {}
        self.scaler: Optional[StandardScaler] = None
        self.angle_scaler: Optional[MinMaxScaler] = None
        self.imputer: Optional[SimpleImputer] = None
        
    def _get_data_path(self) -> str:
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        if self.condition == "heart":
            return os.path.join(base_dir, "ml", "data", "heart.csv")
        elif self.condition in ["pima", "diabetes"]:
            return os.path.join(base_dir, "ml", "data", "pima.csv")
        else:
            raise ValueError(f"Unsupported condition: {self.condition}")

    def load_raw_data(self) -> Tuple[pd.DataFrame, pd.Series]:
        path = self._get_data_path()
        df = pd.read_csv(path)
        
        if self.condition == "heart":
            target_col = "target"
            X = df.drop(columns=[target_col])
            y = df[target_col].astype(int)
        else:
            target_col = "Outcome"
            # In Pima, zeros in these columns represent physiological missing data
            zero_as_missing = ["Glucose", "BloodPressure", "SkinThickness", "Insulin", "BMI"]
            for col in zero_as_missing:
                if col in df.columns:
                    df[col] = df[col].replace(0, np.nan)
                    
            X = df.drop(columns=[target_col])
            y = df[target_col].astype(int)
            
        return X, y

    def fit_transform(
        self,
        test_size: float = 0.2
    ) -> Tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
        """
        Executes full preprocessing pipeline and returns:
        X_train_angles, X_test_angles, y_train, y_test
        """
        X, y = self.load_raw_data()
        self.feature_names = list(X.columns)
        
        # 1. Imputation
        self.imputer = SimpleImputer(strategy="median")
        X_imputed = pd.DataFrame(
            self.imputer.fit_transform(X),
            columns=self.feature_names
        )
        
        # 2. Stratified Train / Test split BEFORE feature selection (prevent leakage)
        X_train_raw, X_test_raw, y_train, y_test = train_test_split(
            X_imputed,
            y.values,
            test_size=test_size,
            random_state=self.seed,
            stratify=y
        )
        
        # 3. Mutual Information Ranking on training set only
        mi = mutual_info_classif(
            X_train_raw,
            y_train,
            random_state=self.seed,
            discrete_features="auto"
        )
        self.mi_scores = dict(sorted(
            {feat: float(score) for feat, score in zip(self.feature_names, mi)}.items(),
            key=lambda item: item[1],
            reverse=True
        ))
        
        # Pick top n_qubits features
        self.selected_features = list(self.mi_scores.keys())[:self.n_qubits]
        
        X_train_sub = X_train_raw[self.selected_features]
        X_test_sub = X_test_raw[self.selected_features]
        
        # 4. Standard Scaling followed by [0, pi] Angle Normalization
        self.scaler = StandardScaler()
        X_train_scaled = self.scaler.fit_transform(X_train_sub)
        X_test_scaled = self.scaler.transform(X_test_sub)
        
        self.angle_scaler = MinMaxScaler(feature_range=(0.0, np.pi))
        X_train_angles = self.angle_scaler.fit_transform(X_train_scaled)
        X_test_angles = self.angle_scaler.transform(X_test_scaled)
        
        return X_train_angles, X_test_angles, y_train, y_test

    def transform_patient(self, vitals: Dict[str, float]) -> Tuple[np.ndarray, List[float]]:
        """
        Transforms single patient dictionary into top-feature normalized quantum angles [0, pi].
        Returns (angles_array (1, n_qubits), angles_list).
        """
        if self.scaler is None or self.angle_scaler is None:
            raise RuntimeError("Preprocessor has not been fitted yet!")
            
        # Build DataFrame with all raw features
        row = {}
        for f in self.feature_names:
            row[f] = float(vitals.get(f, 0.0))
            
        df_single = pd.DataFrame([row])
        df_imputed = pd.DataFrame(
            self.imputer.transform(df_single),
            columns=self.feature_names
        )
        
        # Filter to selected features
        df_sub = df_imputed[self.selected_features]
        scaled = self.scaler.transform(df_sub)
        angles = self.angle_scaler.transform(scaled)
        
        return angles, angles[0].tolist()

    def save_artifacts(self, directory: str):
        os.makedirs(directory, exist_ok=True)
        joblib.dump(self.imputer, os.path.join(directory, f"{self.condition}_imputer.joblib"))
        joblib.dump(self.scaler, os.path.join(directory, f"{self.condition}_scaler.joblib"))
        joblib.dump(self.angle_scaler, os.path.join(directory, f"{self.condition}_angle_scaler.joblib"))
        meta = {
            "condition": self.condition,
            "n_qubits": self.n_qubits,
            "feature_names": self.feature_names,
            "selected_features": self.selected_features,
            "mi_scores": self.mi_scores,
        }
        joblib.dump(meta, os.path.join(directory, f"{self.condition}_meta.joblib"))

    def load_artifacts(self, directory: str):
        self.imputer = joblib.load(os.path.join(directory, f"{self.condition}_imputer.joblib"))
        self.scaler = joblib.load(os.path.join(directory, f"{self.condition}_scaler.joblib"))
        self.angle_scaler = joblib.load(os.path.join(directory, f"{self.condition}_angle_scaler.joblib"))
        meta = joblib.load(os.path.join(directory, f"{self.condition}_meta.joblib"))
        self.feature_names = meta["feature_names"]
        self.selected_features = meta["selected_features"]
        self.mi_scores = meta["mi_scores"]
        self.n_qubits = meta["n_qubits"]


def get_clinical_schema(condition: str = "heart") -> Dict[str, Any]:
    """
    Returns clinical ranges, units, and descriptions for intake forms.
    """
    if condition == "heart":
        return {
            "condition": "heart",
            "name": "Coronary Heart Disease (Cleveland)",
            "features": [
                {"name": "age", "label": "Age", "type": "int", "min": 25, "max": 80, "default": 54, "unit": "years"},
                {"name": "sex", "label": "Sex", "type": "select", "options": [{"label": "Female", "value": 0}, {"label": "Male", "value": 1}], "default": 1},
                {"name": "cp", "label": "Chest Pain Type", "type": "select", "options": [
                    {"label": "Typical Angina (0)", "value": 0},
                    {"label": "Atypical Angina (1)", "value": 1},
                    {"label": "Non-anginal Pain (2)", "value": 2},
                    {"label": "Asymptomatic (3)", "value": 3}
                ], "default": 2},
                {"name": "trestbps", "label": "Resting Blood Pressure", "type": "int", "min": 90, "max": 200, "default": 130, "unit": "mmHg"},
                {"name": "chol", "label": "Serum Cholesterol", "type": "int", "min": 120, "max": 400, "default": 235, "unit": "mg/dL"},
                {"name": "fbs", "label": "Fasting Blood Sugar > 120 mg/dL", "type": "select", "options": [{"label": "No (0)", "value": 0}, {"label": "Yes (1)", "value": 1}], "default": 0},
                {"name": "restecg", "label": "Resting ECG", "type": "select", "options": [
                    {"label": "Normal (0)", "value": 0},
                    {"label": "ST-T Wave Abnormality (1)", "value": 1},
                    {"label": "Left Ventricular Hypertrophy (2)", "value": 2}
                ], "default": 0},
                {"name": "thalach", "label": "Max Heart Rate Achieved", "type": "int", "min": 80, "max": 210, "default": 150, "unit": "bpm"},
                {"name": "exang", "label": "Exercise Induced Angina", "type": "select", "options": [{"label": "No (0)", "value": 0}, {"label": "Yes (1)", "value": 1}], "default": 0},
                {"name": "oldpeak", "label": "ST Depression (Exercise)", "type": "float", "min": 0.0, "max": 6.2, "default": 1.0, "step": 0.1, "unit": "mm"},
                {"name": "slope", "label": "Peak Exercise ST Slope", "type": "select", "options": [
                    {"label": "Upsloping (0)", "value": 0},
                    {"label": "Flat (1)", "value": 1},
                    {"label": "Downsloping (2)", "value": 2}
                ], "default": 1},
                {"name": "ca", "label": "Major Vessels Colored (Fluoroscopy)", "type": "int", "min": 0, "max": 4, "default": 0},
                {"name": "thal", "label": "Thalassemia", "type": "select", "options": [
                    {"label": "Normal (1)", "value": 1},
                    {"label": "Fixed Defect (2)", "value": 2},
                    {"label": "Reversable Defect (3)", "value": 3}
                ], "default": 2}
            ],
            "sample_patients": {
                "low_risk": {
                    "age": 41, "sex": 0, "cp": 1, "trestbps": 110, "chol": 172,
                    "fbs": 0, "restecg": 0, "thalach": 175, "exang": 0,
                    "oldpeak": 0.0, "slope": 2, "ca": 0, "thal": 2
                },
                "medium_risk": {
                    "age": 55, "sex": 1, "cp": 2, "trestbps": 132, "chol": 242,
                    "fbs": 0, "restecg": 1, "thalach": 145, "exang": 0,
                    "oldpeak": 1.2, "slope": 1, "ca": 1, "thal": 2
                },
                "high_risk": {
                    "age": 67, "sex": 1, "cp": 0, "trestbps": 160, "chol": 286,
                    "fbs": 1, "restecg": 1, "thalach": 108, "exang": 1,
                    "oldpeak": 2.6, "slope": 1, "ca": 2, "thal": 3
                }
            }
        }
    else:
        return {
            "condition": "diabetes",
            "name": "Pima Indians Diabetes Screening",
            "features": [
                {"name": "Pregnancies", "label": "Pregnancies", "type": "int", "min": 0, "max": 17, "default": 3},
                {"name": "Glucose", "label": "Plasma Glucose", "type": "int", "min": 50, "max": 250, "default": 120, "unit": "mg/dL"},
                {"name": "BloodPressure", "label": "Diastolic Blood Pressure", "type": "int", "min": 40, "max": 130, "default": 70, "unit": "mmHg"},
                {"name": "SkinThickness", "label": "Triceps Skin Fold", "type": "int", "min": 10, "max": 80, "default": 20, "unit": "mm"},
                {"name": "Insulin", "label": "2-Hour Serum Insulin", "type": "int", "min": 15, "max": 800, "default": 80, "unit": "mu U/ml"},
                {"name": "BMI", "label": "Body Mass Index", "type": "float", "min": 15.0, "max": 65.0, "default": 32.0, "step": 0.1, "unit": "kg/m²"},
                {"name": "DiabetesPedigreeFunction", "label": "Diabetes Pedigree", "type": "float", "min": 0.05, "max": 2.5, "default": 0.45, "step": 0.01},
                {"name": "Age", "label": "Age", "type": "int", "min": 21, "max": 85, "default": 33, "unit": "years"}
            ],
            "sample_patients": {
                "low_risk": {
                    "Pregnancies": 1, "Glucose": 85, "BloodPressure": 66, "SkinThickness": 29,
                    "Insulin": 60, "BMI": 26.6, "DiabetesPedigreeFunction": 0.351, "Age": 31
                },
                "medium_risk": {
                    "Pregnancies": 4, "Glucose": 125, "BloodPressure": 78, "SkinThickness": 32,
                    "Insulin": 110, "BMI": 33.5, "DiabetesPedigreeFunction": 0.47, "Age": 42
                },
                "high_risk": {
                    "Pregnancies": 8, "Glucose": 175, "BloodPressure": 90, "SkinThickness": 40,
                    "Insulin": 230, "BMI": 41.2, "DiabetesPedigreeFunction": 0.88, "Age": 54
                }
            }
        }
