# 💧 Jal Sahayak

### Intelligent Drought & Groundwater Advisor for Saurashtra, Gujarat

**Jal Sahayak** is a web-based water intelligence and advisory platform designed to help **farmers, local bodies, and water authorities** understand drought risk, groundwater depletion, rainfall patterns, and water-management strategies across the **11 districts of Saurashtra, Gujarat**.

🔗 **Live Demo:** https://paras923.github.io/Jal-Sahayak/

---

## 🌱 About the Project

Saurashtra is a semi-arid region where agriculture depends heavily on groundwater and rainfall can vary significantly from year to year.

Jal Sahayak brings together groundwater analytics, rainfall information, drought-risk assessment, interactive maps, and crop-specific water-management recommendations in a single platform.

The goal is to turn complex water data into **simple, actionable information** for farmers and water-management stakeholders.

---

## ✨ Features

### 📊 Live Water Dashboard

* District-wise water intelligence
* Live weather information
* Rainfall statistics
* Groundwater depth monitoring
* Groundwater depletion indicators
* Drought Risk Index
* Reservoir / check-dam fill estimates
* 7-day rainfall and temperature forecast

### 🗺️ Interactive District Risk Map

* Interactive map covering all 11 Saurashtra districts
* Groundwater stress classification
* Safe, Semi-Critical, Critical and Over-Exploited categories
* Clickable districts for detailed information
* Pattern overlays for improved accessibility

### 📈 Groundwater Trend Analytics

* Historical rainfall analysis
* Groundwater depth trends
* Rainfall vs. groundwater correlation
* Conservation movement analysis
* Pre/post water-conservation comparison
* CSV data export

### 🤖 AI-Powered Water Advisory

Users can select:

* District
* Primary crop
* Land size

The platform generates a personalized water-management advisory including:

* Irrigation recommendations
* Water-saving strategies
* Water-structure recommendations
* Drought-risk guidance
* Crop-specific recommendations

> The current advisory engine is deterministic and rule-based, using rainfall deficit, groundwater depth, groundwater stress classification, and crop water requirements.

### 🌾 Farmer Resources

The platform provides information about:

* Drip irrigation
* Sprinkler irrigation
* Mulching
* Laser land levelling
* Drought-resistant crop varieties
* Farm ponds
* Government water and agriculture schemes
* KVK resources and contacts

### 🌐 Multilingual Support

The interface supports:

* 🇬🇧 English
* 🇮🇳 Gujarati
* 🇮🇳 Hindi

---

## 🧮 Drought Risk Index

Jal Sahayak uses a composite drought-risk score based on multiple factors:

```text
Drought Risk Index =
(Rainfall Deficit × 0.35)
+ (Groundwater Depth Increase × 0.25)
+ (Well Depletion × 0.25)
+ (CGWB Stress Level × 5)
```

### Risk Levels

| Score | Risk        |
| ----: | ----------- |
|  0–25 | 🟢 Low      |
| 25–50 | 🟡 Moderate |
| 50–75 | 🟠 Severe   |
|   75+ | 🔴 Extreme  |

---

## 🛠️ Technology Stack

* **HTML5**
* **CSS3**
* **JavaScript (ES2022)**
* **Chart.js 4.4**
* **SVG**
* **Open-Meteo API**
* **JSON**
* **Google Fonts**
* Rule-based advisory engine

No paid API keys are required for the current implementation.

---

## 📡 Data Sources

The project uses information and references from publicly available sources, including:

* Central Ground Water Board (CGWB)
* India Meteorological Department (IMD)
* Open-Meteo
* India Water Portal
* Gujarat WASMO
* Journal of Hydrology Regional Studies

> **Important:** Some groundwater and rainfall charts use illustrative datasets seeded from published research. They should not be treated as official real-time groundwater measurements.

---

## 📂 Project Structure

```text
Jal-Sahayak/
│
├── index.html
├── css/
│   └── style.css
│
├── js/
│   └── app.js
│
├── data/
│   └── data.json
│
└── README.md
```

*The exact structure may vary depending on the current version of the project.*



## 🎯 Project Objectives

* Monitor drought conditions across Saurashtra
* Improve awareness of groundwater depletion
* Help farmers make better irrigation decisions
* Promote water-efficient agricultural practices
* Visualize groundwater and rainfall trends
* Provide accessible district-level water intelligence
* Encourage groundwater conservation and rainwater harvesting

---

## 🔮 Future Improvements

Some possible future enhancements include:

* 🔴 Integration with live CGWB groundwater datasets
* 🤖 LLM-powered natural-language advisory
* 📍 GPS-based farmer location detection
* 🌦️ More detailed weather forecasting
* 📱 Progressive Web App / mobile application
* 🔔 Drought and irrigation alerts
* 🛰️ Satellite-based groundwater and vegetation monitoring
* 🗃️ Real-time district data APIs
* 👨‍🌾 Personalized farmer profiles
* 📊 Advanced predictive groundwater models

---

## ⚠️ Disclaimer

Jal Sahayak is a **research and advisory platform** intended for informational purposes.

It is **not a replacement for official CGWB, IMD, Gujarat Government, or agricultural department information**.

Some datasets displayed by the platform are illustrative and based on published research. Users should consult relevant agricultural authorities or KVK experts before making major farming or water-management decisions.

---

## 👨‍💻 Author

**Paras923**

GitHub:
https://github.com/paras923

---

## 📜 License

This project is intended for **research, educational, and demonstration purposes**.

---

### 💧 Jal Sahayak

**Turning water data into actionable decisions for Saurashtra.**

## Home Screen
<img width="1917" height="1028" alt="Screenshot 2026-09-03 205019" src="https://github.com/user-attachments/assets/01eac97c-b6f1-47bc-9416-c7e66ee78d3c" />

## Dashboard
<img width="1917" height="1027" alt="Screenshot 2026-09-03 205039" src="https://github.com/user-attachments/assets/789d9eb6-04ff-4658-b8f5-0e15ccbb5449" />

## Risk Map
<img width="1917" height="1031" alt="Screenshot 2026-09-03 205053" src="https://github.com/user-attachments/assets/4e16e2c9-9056-40f6-9365-52c59b4a2ce2" />

## About
<img width="1917" height="1031" alt="Screenshot 2026-09-03 211310" src="https://github.com/user-attachments/assets/d73556ca-5214-44ba-9362-a11b38dbfa8f" />
