# 05_evaluation.py

import pandas as pd
import joblib
import os
from sklearn.metrics import accuracy_score, f1_score, precision_score, recall_score, confusion_matrix, classification_report

# =========================
# 1️⃣ Load feature-engineered data
# =========================
data_path = "data/feature_engineered_data.csv"
df = pd.read_csv(data_path)
print(f"🔹 Loaded data shape: {df.shape}")

# Separate target and ID
target_col = "Machine_failure"
id_col = "UDI"

X = df.drop(columns=[target_col, id_col], errors='ignore')
y = df[target_col]

# =========================
# 2️⃣ Load trained model and feature columns
# =========================
model_path = "models/failure_predictor.pkl"
columns_path = "models/model_columns.pkl"

if not os.path.exists(model_path) or not os.path.exists(columns_path):
    raise FileNotFoundError("Model or feature columns file not found. Train the model first!")

model = joblib.load(model_path)
model_columns = joblib.load(columns_path)
print(f"✅ Loaded model and feature columns")

# Align test features with training columns
X = X.reindex(columns=model_columns, fill_value=0)

# Ensure all features are numeric
X = X.apply(pd.to_numeric, errors='coerce').fillna(0)

# =========================
# 3️⃣ Make vectorized predictions
# =========================
predictions = model.predict(X)
df["Predicted_Failure"] = predictions
df["Status"] = df["Predicted_Failure"].apply(lambda x: "Maintenance Required" if x == 1 else "Healthy")

print("✅ Predictions done for all rows.")

# =========================
# 4️⃣ Compute evaluation metrics
# =========================
accuracy = accuracy_score(y, predictions)
f1 = f1_score(y, predictions)
precision = precision_score(y, predictions)
recall = recall_score(y, predictions)
conf_matrix = confusion_matrix(y, predictions)
report = classification_report(y, predictions)

print("\n=== Model Evaluation Metrics ===")
print(f"Accuracy : {accuracy:.4f}")
print(f"F1 Score : {f1:.4f}")
print(f"Precision: {precision:.4f}")
print(f"Recall   : {recall:.4f}")
print("\nConfusion Matrix:")
print(conf_matrix)
print("\nClassification Report:")
print(report)

# =========================
# 5️⃣ Save predictions and metrics
# =========================
os.makedirs("outputs", exist_ok=True)

df.to_csv("outputs/predictions_log.csv", index=False)

metrics_df = pd.DataFrame({
    "Metric": ["Accuracy", "F1 Score", "Precision", "Recall"],
    "Value": [accuracy, f1, precision, recall]
})
metrics_df.to_csv("outputs/evaluation_metrics.csv", index=False)

print("\n✅ Predictions and evaluation metrics saved in 'outputs/' folder.")
