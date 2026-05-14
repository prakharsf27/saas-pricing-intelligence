# SaaS Pricing Intelligence Platform

## Business Problem
SaaS companies frequently update their pricing, introduce new tiers, and alter free trial offerings. For competitors and businesses using these services, manually tracking these changes across the market is inefficient and error-prone. This leads to delayed responses to market shifts or overpaying for services.

**Solution:** The SaaS Pricing Intelligence Platform automates the collection, cleaning, and analysis of publicly available pricing data from competitor websites. It provides a real-time dashboard with actionable insights, feature comparisons, and historical tracking to help businesses make informed strategic decisions.

## Architecture

*   **Frontend**: React + TypeScript + Vite + Tailwind CSS v4 + Lucide React
*   **Backend**: Node.js + Express.js + TypeScript
*   **Database**: MongoDB (Mongoose ORM)
*   **Scraping**: Axios + Cheerio
*   **Automation**: node-cron (Scheduled jobs)

## Setup Instructions

### Prerequisites
*   Node.js (v18 or higher)
*   MongoDB (Local instance or MongoDB Atlas)

### 1. Clone the repository and navigate
```bash
# This codebase contains both frontend and backend
cd "Coherent assignment"
```

### 2. Backend Setup
```bash
cd backend
npm install
```
*   Create a `.env` file in the `backend` directory (Optional if using local MongoDB and port 5000):
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/saas-pricing-intel
```
*   Seed the database with initial sample data:
```bash
npm run seed
```
*   Start the development server:
```bash
npm run dev
```
*(The backend will run on http://localhost:5000)*

### 3. Frontend Setup
```bash
cd frontend
npm install
```
*   Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5000/api
```
*   Start the development server:
```bash
npm run dev
```
*(The frontend will run on http://localhost:5173)*

## Features
*   **Automated Scraper**: A resilient scraper built with Axios and Cheerio that extracts pricing plans, handles pagination/sections, and normalizes messy DOM structures into structured JSON.
*   **Data Pipeline**: The `scraper.ts` service normalizes currencies, converts billing cycles, detects free trials implicitly, and handles missing fields gracefully via defensive fallbacks.
*   **Scheduled Cron Jobs**: Configured via `node-cron` to automatically update the dataset every midnight (`0 0 * * *`).
*   **AI/Analytics Insights**: Analyzes the dataset to provide summaries (average prices, most expensive plans, free trial prevalence).
*   **Dynamic Dashboard**: A fully responsive dashboard that lets users filter by billing cycles, search for specific companies, and compare key metrics.

## Deployment Process

### Backend (Render / Railway)
1.  Push your code to a GitHub repository.
2.  In Render, create a new "Web Service".
3.  Set the Root Directory to `backend`.
4.  Build Command: `npm install && npm run build`
5.  Start Command: `npm start`
6.  Environment Variables: Set `MONGO_URI` to your MongoDB Atlas connection string. Set `PORT` to `10000`.

### Frontend (Vercel)
1.  In Vercel, import your GitHub repository.
2.  Set the Framework Preset to Vite.
3.  Set the Root Directory to `frontend`.
4.  Build Command: `npm run build`
5.  Output Directory: `dist`
6.  Environment Variables: Set `VITE_API_URL` to the URL of your deployed backend (e.g., `https://your-backend-app.onrender.com/api`).
