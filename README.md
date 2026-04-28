# Swarmbotics Operator Frontend

`swarmbotics-operator-frontend` provides the human interface for swarm command and control. The repository is split into an ATAK plugin for field operators, a React and TypeScript mission-control console for command posts, and a shared teleoperation module used when operators need to jump directly into a vehicle.

## Components

- `atak-plugin/`: Android and ATAK-facing Kotlin scaffold for swarm overlays, CoT translation, quick tasking, and PiP ISR display.
- `web-mission-control/`: Vite and React dashboard with a global overview, kill-chain approval queue, telemetry graphs, and a teleoperation preview panel.
- `teleoperation-fallback/`: Shared TypeScript module covering video/HUD state, gamepad input capture, command throttling, and payload/PTZ controls.

## Web Mission Control

```bash
cd web-mission-control
npm install
npm run dev
```

Build the mission-control app:

```bash
npm run build
```

## Shared Teleoperation Module

```bash
cd teleoperation-fallback
npm install
npm run build
```

The web app imports the teleoperation fallback source through a local alias so the HUD and control logic stay consistent across operator surfaces.

## ATAK Plugin

Open `atak-plugin/` in Android Studio, let Gradle sync, then build the `app` module. The scaffold includes the map component, tasking UI, CoT translation, and PiP layout assets needed to continue plugin development.

## Validation

The validation path used for this scaffold is:

```bash
cd teleoperation-fallback && npm run build
cd ../web-mission-control && npm run build
```

Android validation was not automated in this environment because the repo does not include a Gradle wrapper or Android SDK provisioning.

## License

This project is licensed under the MIT License. See `LICENSE` for details.

