# companion-module-sony-srga12

A Companion module for controlling Sony SRG-A12 PTZ cameras via VISCA over IP protocol.

See [HELP.md](./companion/HELP.md) and [LICENSE](./LICENSE)

## Features

This module provides comprehensive control of Sony SRG-A12 cameras through the VISCA over IP protocol:

### Camera Controls
- **Power Management**: Power on/off
- **Pan/Tilt Control**: Full directional movement with adjustable speed
- **Zoom Control**: Zoom in/out with variable speed
- **Focus Control**: Manual/Auto focus, one-push auto focus
- **Preset Positions**: Save and recall up to 100 preset positions

### Image Settings
- **White Balance**: Auto, Indoor, Outdoor, One-Push modes
- **Exposure**: Auto and Manual exposure modes
- **Recording**: Start/stop recording functions

### Feedback & Variables
- Connection status monitoring
- Camera state variables for integration
- Visual feedback for button states

## Configuration

1. Set the camera's IP address in the module configuration
2. Default VISCA port is 52381 (standard for Sony cameras)
3. Configure default pan/tilt and zoom speeds

## Camera Setup

Ensure your Sony SRG-A12 camera has:
- VISCA over IP enabled
- Correct IP address configuration
- Network connectivity to the Companion system

## Getting started

Executing a `yarn` command should perform all necessary steps to develop the module, if it does not then follow the steps below.

The module can be built once with `yarn build`. This should be enough to get the module to be loadable by companion.

While developing the module, by using `yarn dev` the compiler will be run in watch mode to recompile the files on change.

## Supported Actions

- Power On/Off
- Pan Left/Right with speed control
- Tilt Up/Down with speed control
- Pan/Tilt Stop
- Pan/Tilt Home position
- Zoom Tele/Wide with speed control
- Zoom Stop
- Focus Near/Far/Stop/Auto/Manual
- One Push Auto Focus
- Preset Recall/Save (1-100)
- White Balance modes (Auto/Indoor/Outdoor/One-Push)
- Exposure modes (Auto/Manual)
- Recording Start/Stop

## Technical Details

- Protocol: VISCA over IP (UDP)
- Default Port: 52381
- Pan/Tilt Speed Range: 1-24
- Zoom Speed Range: 1-7
- Focus Speed Range: 1-7
- Preset Range: 1-100
