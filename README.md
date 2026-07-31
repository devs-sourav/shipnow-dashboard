# ShipNow Logistics Dashboard

A responsive logistics dashboard built with **Next.js**, **TypeScript**, **Tailwind CSS**, and **Recharts**, based on the provided Figma design for the Trends Bird Frontend Developer Intern assignment.

## 🚀 Live Demo

**Live URL:** https://shipnow-dashboard.vercel.app

## 📂 GitHub Repository

**Repository:** https://github.com/devs-sourav/shipnow-dashboard

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
git clone https://github.com/devs-sourav/shipnow-dashboard.git
```

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

Open **http://localhost:3000** in your browser.

---

# Screen Status

| Screen                 | Responsive |   Status   |
| ---------------------- | :--------: | :--------: |
| Login                  |      ✅     | ✅ Complete |
| Dashboard              |      ✅     | ✅ Complete |
| Shipments (Table View) |      ✅     | ✅ Complete |
| Shipments (Grid View)  |      ✅     | ✅ Complete |
| View Switcher          |      ✅     | ✅ Complete |
| Create New Shipment    |      ✅     | ✅ Complete |
| Warehouse              |      ✅     | ✅ Complete |
| Invoices & Billing     |      ✅     | ✅ Complete |

---

# Features Implemented

* Fully responsive layout for Desktop, Tablet, and Mobile
* Reusable component architecture
* Sidebar navigation
* Mobile drawer
* Dashboard analytics cards
* Charts using Recharts
* Shipment Table View
* Shipment Grid View
* View switcher between Table and Grid
* Search functionality
* Filtering
* Sorting
* Pagination
* Form validation
* Warehouse dashboard
* Invoices & Billing module
* Mock data organization by feature
* Fully static frontend (No backend/API)

---

# Known Issues

* All data is powered by local mock data.
* No backend or API integration has been implemented.

---

# Assumptions

* All application data is stored locally using mock data.
* No backend or API integration was required.
* The Warehouse map uses a static visual representation as permitted by the assignment.

---

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
* Fully responsive across Desktop, Tablet, and Mobile devices.
* Uses local mock data throughout the application.
* Uses TypeScript throughout the project.
