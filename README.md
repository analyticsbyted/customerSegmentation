# 🎯 Customer Intelligence Suite

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](http://ted-customer-intelligence-dashboard.s3-website-us-east-1.amazonaws.com/)
[![GitHub license](https://img.shields.io/github/license/tedmbp/customerSegmentation)](LICENSE)

An end-to-end unsupervised machine learning project that transforms raw shopping mall data into actionable business intelligence. The project features a dual-model clustering engine (Multivariate & Bivariate) and a premium interactive dashboard for visual exploration.

## 🚀 Live Dashboard
Explore the results here: **[Customer Intelligence Suite](http://ted-customer-intelligence-dashboard.s3-website-us-east-1.amazonaws.com/)**

---

## 🛠 Features

- **Dual-Model Logic**: Compare standard Multivariate clustering (Age, Gender, Income, Score) against high-definition Bivariate clustering (Income vs. Spending).
- **Interactive Visualizations**: Built with **Chart.js**, featuring dynamic toggles, optimization plots (Elbow Method), and distribution bubbles.
- **Automated Analysis Pipeline**: `final_analysis.py` script for preprocessing, scaling, and clustering with zero manual intervention.
- **Executive Insights**: Automated segment characterization based on behavioral and demographic centroids.
- **Cloud Hosted**: Continuous deployment to **AWS S3** for public consumption.

## 🏗 Project Structure

- `final_analysis.py`: Core Python engine for the ML model.
- `customer-analytics/`: Vite-based frontend dashboard.
- `Mall_Customers.csv`: Raw target dataset.
- `Clustering_Final.csv`: Enriched dataset with cluster assignments.
- `segmentation.ipynb`: Research and exploratory notebook.

## 💻 Tech Stack

- **ML Core**: Python (Pandas, Scikit-Learn, Seaborn, Matplotlib)
- **Frontend**: Vite.js, Chart.js, Vanilla CSS (Glassmorphism)
- **Deployment**: AWS S3 Static Website Hosting

## 🛠 Setup & Development

### 1. Model Analysis
```bash
pip install pandas scikit-learn seaborn matplotlib
python3 final_analysis.py
```

### 2. Live Dashboard (Local)
```bash
cd customer-analytics
npm install
npm run dev
```

## 📈 Methodology
Finding the optimal 'K' using the **Elbow Method**. The project settles on $K=5$ segments, providing the most stable and interpretable business profiles for mall marketing teams.

---
© 2025 Ted Dickey Analytics
