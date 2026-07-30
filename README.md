# ShipNow Logistics Dashboard

A responsive logistics dashboard built with **Next.js**, **TypeScript**, **Tailwind CSS**, and **Recharts**, based on the provided Figma design for the Trends Bird Frontend Developer Intern assignment.

## 🚀 Live Demo

**Live URL:** https://shipnow-dashboard.vercel.app

## 📂 GitHub Repository

**Repository: **https://github.com/devs-sourav/shipnow-dashboard

---

## 🛠 Tech Stack

* Next.js (App Router)
* TypeScript
* Tailwind CSS
* Recharts
* Lucide React

---

## 📦 Getting Started

### Clone the repository

```bash
git clone https://github.com/your-username/shipnow-dashboard.git
```

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

Open [**http://localhost:3000**](http://localhost:3000) in your browser.

---

# Screen Status

| Screen                 | Status          |
| ---------------------- | --------------- |
| Login                  | ✅ Complete      |
| Dashboard              | ✅ Complete      |
| Shipments (Table View) | ✅ Complete      |
| Shipments (Grid View)  | ✅ Complete      |
| View Switcher          | ✅ Complete      |
| Create New Shipment    | ✅ Complete      |
| Warehouse              | ✅ Complete      |
| Invoices & Billing     | ❌ Not Attempted |

---

# Features Implemented

* Responsive layout for Desktop, Tablet, and Mobile
* Reusable component architecture
* Sidebar navigation
* Mobile drawer
* Dashboard analytics cards
* Charts using Recharts
* Shipment Table View
* Shipment Grid View
* View switcher between Table and Grid
* Search functionality
* Filter tabs
* Sorting
* Pagination
* Form validation
* Warehouse dashboard
* Mock data organization by feature
* Fully static frontend (No backend/API)

---

# Known Issues

* The **Invoices & Billing** screen has not been implemented due to time constraints.
* All remaining screens are implemented using local mock data.

---

# Assumptions

* All application data is stored locally using mock data.
* No backend or API integration was required.
* The Warehouse map uses a static visual representation as permitted by the assignment.

---

# Project Structure

# Project Structure

```text
.
├── app
│   ├── (auth)
│   ├── (dashboard)
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── not-found.tsx
├── components
├── context
├── data
├── hooks
├── lib
├── providers
├── public
├── src
├── styles
├── types
├── package.json
├── tsconfig.json
└── README.md
```

---

# Deployment

The application is deployed on **Vercel** and is publicly accessible.

---

# Notes

* Built according to the provided Figma design.
* Focused on reusable components and clean project structure.
* Responsive across Desktop, Tablet, and Mobile breakpoints.
* Uses TypeScript throughout the project.
