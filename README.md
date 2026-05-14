# SaaS Pricing Intelligence Platform 📊

A full-stack automated platform designed to help businesses monitor competitor pricing strategies, feature offerings, and market trends in real-time.

---

## 🎯 The Business Problem
In the fast-paced B2B SaaS market, companies frequently change their pricing tiers, free trial policies, and feature bundles. 
**The Manual Struggle:** Manually tracking these changes across 10+ competitors is inefficient, error-prone, and slow. Businesses often miss market shifts or lose competitive edge because they aren't aware of a competitor's new "Pro" tier or aggressive discount.

**The Solution:** This platform automates the entire "Competitive Intelligence" lifecycle:
1.  **Automated Collection**: Scrapers fetch live data from public pricing pages.
2.  **Standardization**: Messy web data is cleaned, currencies are normalized, and features are structured.
3.  **Actionable Insights**: A dashboard provides AI-powered summaries, average market pricing, and feature comparisons.

---

## 🏗 Technical Architecture
*   **Frontend**: React.js with Tailwind CSS v4 (Modern, Responsive Dashboard).
*   **Backend**: Node.js & Express (RESTful API & Data Pipeline).
*   **Database**: MongoDB Atlas (Scalable NoSQL storage).
*   **Automation**: `node-cron` for scheduled daily scraping jobs.
*   **Scraping**: `Axios` + `Cheerio` (Lightweight and resilient scraping engine).

---

## 🚀 Local Setup Instructions

### 1. Prerequisites
*   Node.js (v18+)
*   MongoDB (Local instance or Atlas URI)

### 2. Backend Installation
```bash
cd backend
npm install
npm run seed   # Populates your DB with initial data
npm run dev    # Starts server on http://localhost:5001
```

### 3. Frontend Installation
```bash
cd frontend
npm install
npm run dev    # Starts dashboard on http://localhost:5173
```

---

## 🔑 Environment Variables

### Backend (`backend/.env`)
| Variable | Description | Example |
| :--- | :--- | :--- |
| `MONGO_URI` | Your MongoDB connection string. | `mongodb+srv://...` |
| `PORT` | The port for the API server. | `5001` |

### Frontend (`frontend/.env`)
| Variable | Description | Example |
| :--- | :--- | :--- |
| `VITE_API_URL` | The URL of the running backend API. | `http://localhost:5001/api` |

---

## 🛠 Features for the Assignment
*   **Resilient Scraper**: Handles missing data gracefully and uses defensive fallbacks if a website structure changes.
*   **Manual Trigger**: Includes a special `/api/scrape-now` endpoint to force an update instantly.
*   **Data Normalization**: Cleans raw strings like "$12.99/mo" into structured numeric data for analytics.
*   **AI Analytics**: Computes market-wide averages and identifies the cheapest/most expensive competitor tiers.

---

## 🌐 Deployment
*   **Frontend**: Deployed on **Vercel**.
*   **Backend**: Deployed on **Render**.
*   **Database**: Hosted on **MongoDB Atlas**.
