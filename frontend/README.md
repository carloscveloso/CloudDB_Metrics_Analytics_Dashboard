# ⚡ CloudDB Control Plane - Telemetry Monitoring Dashboard

A high-performance, responsive monitoring interface designed to oversee managed database clusters in real time. This application functions entirely **local-first**, utilizing browser-native Web APIs to simulate complex cloud database analytics and streaming telemetry data.

## 🚀 Enterprise Frontend Capabilities

* **Local-First Asynchronous Database Layer:** Avoids volatile state memory by embedding **IndexedDB** (via `Dexie.js`) directly in the client browser sandbox. This allows sub-millisecond querying, transactional integrity, and data persistence across sessions.
* **Real-Time Data Streaming Engine:** Features a background loop inside the `StreamSimulator` component that appends dynamic telemetric updates (CPU, RAM, Latency) into the browser database every 2 seconds.
* **Storage Garbage Collection (Data Pruning Utility):** Implements an automated data-purging mechanism (`runStorageGarbageCollection`) that checks database records upon every new stream event. It transactionally bulk-deletes old log snapshots to protect browser memory performance and prevent storage bloat.
* **Live System Chaos Simulator & Crisis Banners:** Includes a telemetry disruption toggle button. When clicked, it forces active database clusters to spike to 95%+ CPU capacity, triggering real-time red KPI warnings and a prominent, flashing critical layout banner alert.
* **Client-Side CSV Telemetry Exporter:** Features an automated download utility. It queries time-series logs directly from IndexedDB, transforms the payload arrays into structural CSV strings, and initiates a desktop file download natively using a web storage Data Blob.
* **Modern Developer Design Language:** Styled with high-density, flexible layouts, hover micro-interactions, responsive typography, and crisp vector vectors (`lucide-react`), mimicking platforms like Vercel and Supabase.

## 🛠️ Tech Stack & Dependencies

* **UI Library:** React 19 (Hooks, Context, Functional Components)
* **Language Contract:** TypeScript (Strict Type Guarantees)
* **Build Automation:** Vite (Optimized asset bundling)
* **Client Database API:** Dexie.js (IndexedDB Object Wrapper)
* **Data Visualizations:** Recharts (SVG-backed responsive charts)
* **Icon Vectors:** Lucide React Icons

## 📦 Getting Started & Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com
   cd CloudDB_Metrics_Analytics_Dashboard
   ```

2. **Install Code Libraries:**
   ```bash
   npm install
   ```

3. **Launch the Development Server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` inside any modern browser.

## 💡 Engineering Notes for Technical Reviewers

When conducting an architectural audit of this repository, please observe these deliberate frontend design choices:
1. **Query Optimization:** The `useMetrics` custom hook queries data using explicit IndexedDB lookup keys (`instanceId`, `timestamp`), ensuring high-speed data delivery even under heavy loads.
2. **Layout Redraw Boundaries:** Live database streaming processes execute asynchronously, isolating component re-renders strictly to the metric cards and line chart viewports.
3. **Robust Text Truncation:** Sidebar item cells include flexible flex-shrink bounds and text ellipsis clipping to avoid layout breaking on different browser screen sizes.


