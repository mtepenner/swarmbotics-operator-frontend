# Operator Frontend: Human-Swarm Interface

## Description
`swarmbotics-operator-frontend` is a comprehensive user interface suite designed for commanding and controlling massive-scale robotic swarms. It bridges the gap between tactical edge devices and command centers by providing an ATAK plugin for dismounted soldiers, a React and TypeScript-based Web Mission Control dashboard, and an ultra-low latency teleoperation fallback module.

## Table of Contents
- [Features](#-features)
- [Technologies Used](#%EF%B8%8F-technologies-used)
- [Installation](#%EF%B8%8F-installation)
- [Usage](#-usage)
- [Contributing](#-contributing)
- [License](#-license)

## 🚀 Features

### ATAK Plugin (Dismounted Soldiers)
* **Tactical Mapping**: Renders standard MIL-STD-2525 icons for the swarm and draws dynamic threat zones based on UGV sensor fusion.
* **Comms Bridge**: Converts swarm telemetry into Cursor-on-Target (CoT) XML messages and uses a lightweight gRPC client to talk to the C2 API Gateway.
* **Quick Tasking**: Radial menus for issuing high-level commands (e.g., "Defend").
* **ISR Feed**: Picture-in-Picture (PiP) video feed for quick Intelligence, Surveillance, and Reconnaissance checks.

### Web Mission Control
* **3D Battlespace Rendering**: Integrates CesiumJS or Mapbox to visualize the operational environment.
* **Operational Dashboards**: Features a `GlobalOverview` map showing all active nodes and a `KillChainManager` interface to approve or deny autonomous kinetic actions.
* **State Management**: Robust Redux/Zustand store managing the state of 100+ robots simultaneously.
* **Real-time Telemetry**: Real-time throughput and latency charts connected via backend gRPC streams.

### Teleoperation Fallback ("Jump In" Module)
* **Ultra-Low Latency Video**: Consumes WebRTC video streams with under 100ms latency, overlaid with a HUD displaying pitch, roll, and battery warnings.
* **Hardware Integration**: Captures Xbox/PlayStation controllers or HOTAS inputs via the Gamepad API.
* **Degraded Network Protection**: Built-in command throttlers to prevent input flooding over poor connections.
* **Payload Control**: Features a safety-locked trigger manager for deploying EW or kinetic payloads and Pan-Tilt-Zoom (PTZ) camera controls for the ISR mast.

## 🛠️ Technologies Used
* **Frontend**: React, TypeScript, Vite
* **Android/ATAK**: Kotlin, Java, Android SDK
* **Networking**: gRPC, gRPC-Web, WebRTC
* **Mapping & GIS**: CesiumJS, Mapbox, Cursor-on-Target (CoT)

## ⚙️ Installation

### Web Mission Control
1. Navigate to the web application directory:
   ```bash
   cd web-mission-control
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

### ATAK Plugin
1. Open the `atak-plugin` directory in Android Studio.
2. Sync the project with Gradle files (`build.gradle.kts`).
3. Build the APK and deploy it to your ATAK-enabled Android device.

## 💻 Usage

* **Approving Actions**: Open the Web TOC, navigate to the `KillChainManager` view, and review pending autonomous actions before providing operator authorization.
* **Manual Override**: If a UGV gets stuck, engage the `teleoperation-fallback` module. Connect a compatible gamepad, view the low-latency WebRTC feed, and manually pilot the asset.
* **Field Coordination**: Dismounted soldiers can open their ATAK device, view UGV markers, and use the radial menu to set defensive perimeters dynamically.

## 🤝 Contributing
Contributions are highly encouraged! Whether you are improving the UI components, optimizing the WebRTC streams, or adding new ATAK overlays, please ensure your code follows the established style guidelines and passes all formatting checks before submitting a pull request.

## 📄 License
This project is licensed under the [MIT License](LICENSE) - see the LICENSE file for details. Copyright (c) 2026 Matthew Penner.
