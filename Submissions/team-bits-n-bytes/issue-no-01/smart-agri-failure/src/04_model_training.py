# 04_model_training.py

import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import joblib
import os

# =========================
# 1️⃣ Load feature-engineered data
# =========================
data_path = "data/feature_engineered_data.csv"
df = pd.read_csv(data_path)
print(f"✅ Loaded data shape: {df.shape}")

# Strip column names to avoid KeyErrors
df.columns = df.columns.str.strip()
print(f"📋 Columns: {df.columns.tolist()}")

# =========================
# 2️⃣ Prepare features (X) and target (y)
# =========================
target_col = "Machine_failure"
drop_cols = ["UDI"]  # Only drop ID, keep all one-hot columns

# Check that target column exists
if target_col not in df.columns:
    raise KeyError(f"Target column missing: {target_col}")

X = df.drop(columns=[target_col] + drop_cols)
y = df[target_col]

print(f"✅ Feature selection complete. Number of features: {X.shape[1]}")

# =========================
# 3️⃣ Ensure all features are numeric
# =========================
X = X.apply(pd.to_numeric, errors='coerce')  # convert all to numeric
X = X.fillna(0)  # replace any NaN with 0
print(f"✅ All features are numeric. Feature count: {X.shape[1]}")
# =========================
# 4️⃣ Split into train and test sets
# =========================
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)
print(f"📊 Train shape: {X_train.shape}, Test shape: {X_test.shape}")

# =========================
# 5️⃣ Train Random Forest model
# =========================
model = RandomForestClassifier(
    n_estimators=200, random_state=42, class_weight="balanced"
)
model.fit(X_train, y_train)
print("✅ Model training complete!")

# =========================
# 6️⃣ Evaluate model performance
# =========================
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)

print(f"\n🎯 Model Accuracy: {accuracy:.4f}")
print("\n📋 Classification Report:")
print(classification_report(y_test, y_pred))

# =========================
# 7️⃣ Save trained model and feature columns
# =========================
os.makedirs("models", exist_ok=True)

model_path = "models/failure_predictor.pkl"
joblib.dump(model, model_path)
print(f"\n💾 Model saved to: {model_path}")

# Save feature columns for evaluation/streaming
columns_path = "models/model_columns.pkl"
joblib.dump(X.columns.tolist(), columns_path)
print(f"💾 Feature columns saved to: {columns_path}")
