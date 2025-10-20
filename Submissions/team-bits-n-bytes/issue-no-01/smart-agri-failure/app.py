import streamlit as st
import pandas as pd
import numpy as np
import joblib
import time
import plotly.express as px
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix

# ===============================
# 🎯 App Configuration
# ===============================
st.set_page_config(page_title="Smart Agri Machine Failure Predictor", layout="wide")
st.title("🚜 Smart Agricultural Machine Failure Dashboard")
st.markdown(
    """
    This dashboard predicts **machine failure** in smart agricultural equipment 
    using real-time sensor data and machine learning.

    **Goal:** Prevent sudden failures during critical operations like harvesting and seeding.
    """
)

# ===============================
# 📦 Load Model and Data
# ===============================
@st.cache_resource
def load_model():
    return joblib.load("models/failure_predictor.pkl")

@st.cache_data
def load_data():
    return pd.read_csv("data/feature_engineered_data.csv")

model = load_model()
data = load_data()

st.sidebar.header("⚙️ Configuration")

# ===============================
# 🧠 Model Evaluation (Precomputed)
# ===============================
st.subheader("📊 Model Performance Summary")

# For metrics display, you can calculate once here
from sklearn.model_selection import train_test_split

X = data.drop(columns=[c for c in ["Machine_failure", "UDI", "Product_ID"] if c in data.columns])
y = data["Machine_failure"]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
precision = precision_score(y_test, y_pred)
recall = recall_score(y_test, y_pred)
f1 = f1_score(y_test, y_pred)

cols = st.columns(4)
cols[0].metric("Accuracy", f"{accuracy:.2f}")
cols[1].metric("Precision", f"{precision:.2f}")
cols[2].metric("Recall", f"{recall:.2f}")
cols[3].metric("F1-Score", f"{f1:.2f}")

# Confusion Matrix Visualization
cm = confusion_matrix(y_test, y_pred)
cm_fig = px.imshow(cm, 
                   x=["Healthy", "Failure"], 
                   y=["Healthy", "Failure"], 
                   color_continuous_scale="Tealgrn", 
                   text_auto=True,
                   title="Confusion Matrix")
st.plotly_chart(cm_fig, use_container_width=True)

# ===============================
# 🔄 Real-Time Streaming Simulation
st.subheader("🚀 Real-Time Streaming Simulation")

num_rows = st.sidebar.slider("Number of rows to simulate", 1, 10, 3)
simulate = st.button("Start Streaming Simulation")

if simulate:
    st.info("Starting live data simulation...")
    for i in range(num_rows):
        sample = data.sample(1)
        features = sample.drop(columns=[c for c in ["Machine_failure", "UDI", "Product_ID"] if c in sample.columns])
        prediction = model.predict(features)[0]

        status = "⚠️ At Risk" if prediction == 1 else "✅ Healthy"
        color = "red" if prediction == 1 else "green"

        st.markdown(f"**Machine ID:** {sample['UDI'].values[0]}")
        st.markdown(f"**Status:** <span style='color:{color}'>{status}</span>", unsafe_allow_html=True)

        temp_fig = px.bar(
            x=["Temp_Diff", "Torque_per_Speed", "Tool_wear_log"],
            y=[sample["Temp_Diff"].values[0], sample["Torque_per_Speed"].values[0], sample["Tool_wear_log"].values[0]],
            color=["Temp_Diff", "Torque_per_Speed", "Tool_wear_log"],
            title="Sensor Snapshot",
            text_auto=True
        )
        st.plotly_chart(temp_fig, use_container_width=True, key=f"chart_{i}")
        time.sleep(1.5)

        # Plot temperature difference and torque per speed
        temp_fig = px.bar(
            x=["Temp_Diff", "Torque_per_Speed", "Tool_wear_log"],
            y=[sample["Temp_Diff"].values[0], sample["Torque_per_Speed"].values[0], sample["Tool_wear_log"].values[0]],
            color=["Temp_Diff", "Torque_per_Speed", "Tool_wear_log"],
            title="Sensor Snapshot",
            text_auto=True
        )
        st.plotly_chart(temp_fig, use_container_width=True)

        time.sleep(1.5)

# ===============================
# 🧩 Feature Engineering Overview
# ===============================
st.subheader("🔬 Feature Engineering Overview")
st.markdown(
    """
    **New Features Created:**
    - `Temp_Diff` → Difference between Process and Air temperature  
    - `Torque_per_Speed` → Machine torque normalized by rotation speed  
    - `Tool_wear_log` → Log-transformed tool wear time  

    These enhance the model’s ability to detect subtle patterns of stress or overheating.
    """
)

# ===============================
# 🧾 Dataset Summary
# ===============================
st.subheader("📄 Dataset Overview")
st.write(data.describe().T)
