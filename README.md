# Where Is My BRTS (Surat Sitilink Edition) 🚌

A crowdsourced transit fusion tracking web application for Surat BRTS (Bus Rapid Transit System), inspired by *Where Is My Train*.

## 🌟 Key Features
- **Zero-Login & 100% Privacy by Design**: No personal accounts, passwords, or emails. Ephemeral session IDs only.
- **Geofenced Auto-Stop**: Geolocation tracking automatically tears down when exiting BRTS station premises.
- **Multi-Signal Route Inference (0–100%)**: Evaluates journey sequence, boarding dynamics, corridor proximity, heading alignment, and crowd clustering.
- **Surat Sitilink Network**: 33 verified stations with real Google Maps coordinates and official routes (15C/15CC, 15AC/15AA, 11, 12, 106 EV, 204).
- **"Where Is My Train" Progression Track**: Live speedometer gauge, station progression nodes, dynamic ETA calculation, and Leaflet interactive corridor maps.
- **Simulation Sandbox**: Interactive testbench with multi-passenger clustering and corridor divergence scenarios.

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🛠️ Tech Stack
- React 19 + Vite
- Tailwind CSS v4
- Leaflet Interactive Maps
- Lucide Icons
- Core Transit Fusion Algorithmic Engine (Pure JS)
