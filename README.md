# Finance Dashboard - Order Analytics

A modern, responsive e-commerce finance dashboard built with Next.js and Tailwind CSS. This application analyzes order data from a CSV file to provide actionable insights, key performance indicators (KPIs), and interactive visualizations.

## Features

- **📊 Key Performance Indicators (KPIs):** Track Net Revenue, Total Orders, Average Order Value (AOV), and Revenue Leakage.
- **📈 Interactive Visualizations:** View revenue trends over time, sales distribution by channel, and order status breakdowns using Recharts.
- **🔍 Advanced Filtering & Search:** Filter orders by Sales Channel, Month, and Status, or search directly by Order ID and Buyer ID.
- **📑 Data Management:** Fully paginated and sortable orders table with detailed modal views for individual transactions.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Charts:** [Recharts](https://recharts.org/)
- **Components:** Custom UI components built with Radix UI primitives and Tailwind.

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm, yarn, or pnpm (recommended)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Zulfaabam/finance-dashboard
   cd finance-dashboard
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Add your data:
   Ensure you have an `orders.csv` file placed in the `public/` directory. The application fetches this file on load to populate the dashboard.

4. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. Open http://localhost:3000 with your browser to see the result.
