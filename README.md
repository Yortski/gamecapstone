# React + Vite (QCULand DormScene)

This template provides a minimal setup to get React working in Vite with HMR, 3D scenes using `@react-three/fiber`, and modular game UI components.

The project now includes:

- 3D character models (`DormStudent`, `BossMinibot`) with animations.
- Camera system that switches instantly between targets (`Juan` and `Lockdown`) and looks directly at the models.
- Intro and outro cutscenes with dialogue and automatic animation playback.
- Interactive quiz system with UI overlay (`DormUI`) and feedback modals.
- Chapter complete screen triggered after the final scenario/outro.

## Features Added

### 1. 3D Model Setup
- `DormStudent` and `BossMinibot` components use `forwardRef` to control animations externally.
- `DormEnvironment` renders the scene objects like the dorm and props.
- Animations can be played programmatically during cutscenes and quiz feedback.

### 2. Camera System
- `DormCamera` now supports **instant camera cuts** to predefined positions.
- Camera looks directly at the character models instead of a fixed world center.
- Camera switching is controlled via `active` prop (`"juan"` or `"lockdown"`) and cutscene state.

### 3. Cutscenes
- `DormIntroCutscene` and `DormOutroCutscene`:
  - Automatically play sequential animations.
  - Update dialogue in the UI.
  - Switch camera target during key moments.
  - Support `onFinish` callbacks to trigger quiz or chapter completion.

### 4. Quiz & Feedback
- `DormScene` manages the quiz logic:
  - Displays questions and choices via `DormUI`.
  - Handles correct/wrong answers with animations and modals.
  - Boss fly-away animation for defeating bosses.
- `SceneManager` manages the main Canvas and overlays:
  - `DialogueBox` for showing current character dialogue.
  - `ModalBox` for success/fail messages.
  - **Chapter Complete screen** that overlays the game when the final scenario is complete.

### 5. Chapter Complete Screen
- Displayed after the outro cutscene.
- Example structure:

DormScene/
├── DormScene.jsx          # Main scene component
├── DormCamera.jsx         # Camera with model-targeting & cutscene support
├── DormEnvironment.jsx    # 3D static environment for the scene
├── DormStudent.jsx        # Player character
├── BossMinibot.jsx        # Optional boss or NPC
├── DormIntroCutscene.jsx  # Intro sequence for scene
├── DormOutroCutscene.jsx  # Outro sequence for scene
├── DormUI.jsx             # Quiz UI or interactive elements
├── scenarios.js           # Array of quiz/dialogue scenarios
