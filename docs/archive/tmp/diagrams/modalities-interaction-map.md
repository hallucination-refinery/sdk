| Modality | User Utterance or Action | Hook / Component                                                                               | Agent / Store Function     | Currently Wired? | UI Surface           | Test Checklist | Edge-Cases / Notes |
| -------- | ------------------------ | ---------------------------------------------------------------------------------------------- | -------------------------- | ---------------- | -------------------- | -------------- | ------------------ |
| Voice    | "Find <query>"           | packages/voice/src/hooks/useVoiceConversation.ts `useVoiceConversation` (clientTools.findNode) | dispatch `SEARCH_INITIATE` | Yes              | VoiceInterface panel | - start voice  |

- say "find AI"
- toast shows search
- nodes highlight | Requires ElevenLabs agent |
  | Voice | "Expand that node" | packages/voice/src/hooks/useVoiceConversation.ts `useVoiceConversation` (clientTools.expandNode) | dispatch `DECOMPOSE_NODE` | Yes | VoiceInterface panel | - select node
- say "expand"
- node decomposes
- toast confirms | |
  | Voice | "Focus on <node>" | packages/voice/src/hooks/useVoiceConversation.ts `useVoiceConversation` (clientTools.focusNode) | toast only (no dispatch) | Partial | VoiceInterface panel | - speak focus command
- toast appears
- camera unchanged | TODO implement focus action |
  | UI Button | Click microphone button | packages/voice/src/components/VoiceInterface.tsx `VoiceInterface` | startConversation / stopConversation | Yes | VoiceInterface panel | - click button
- connection toggles
- status dot updates | |
  | Gesture | Pinch hold | packages/input/src/useMediaPipeHands.ts `useMediaPipeHands` | dispatch `SET_GESTURE_CURSOR_VISIBILITY` & `SET_INTERACTION_MODE` | Yes | Gesture cursor | - pinch fingers
- cursor appears
- mode shows gesture
  | debounce 100ms |
  | Gesture | Pinch release | packages/input/src/useMediaPipeHands.ts `useMediaPipeHands` | dispatch `SET_GESTURE_CURSOR_VISIBILITY` & `SET_INTERACTION_MODE` | Yes | Gesture cursor | - release pinch
- cursor fades
- mode reverts | fade timer 300ms |
  | Gesture | Hand move hover | packages/input/src/useGestureNodeRaycasting.ts `useGestureNodeRaycasting` | dispatch `SET_GESTURE_HOVERED_NODE` | Yes | Gesture cursor | - pinch to show cursor
- move over node
- node highlights | throttle 25 FPS |
  | Gesture | Pinch select node | packages/interaction/src/useGestureInput.ts `useGestureInput` | dispatch `GESTURE_SELECT_NODE` | Yes | Gesture cursor | - hover node
- pinch active
- node selected | depends on hover result |
  | Gesture | Two-hand pinch-stretch | packages/input/src/useTwoHandZoom.ts `useTwoHandZoom` | OrbitControls dollyIn/dollyOut | Yes | Canvas view | - pinch with both hands
- spread hands
- camera zooms | span event from MediaPipe |
  | Mouse | Click node | apps/animus-demo/app/canvas/page.tsx `handleAnimusSceneNodeClick` | dispatch `MOUSE_SELECT_NODE` or `LINK_END` | Yes | Canvas node | - click node
- check selection
- link if in link mode | toggle deselect is commented |
  | Mouse | Scroll wheel | packages/gesture-hands/src/eventMux.ts → packages/view-three/src/InputBridge.tsx | OrbitControls dollyIn/dollyOut | Yes | Canvas view | - scroll mouse
- scene zooms
  | prevents browser scroll |
  | Mouse | Hold "P" + drag | packages/gesture-hands/src/eventMux.ts → packages/view-three/src/InputBridge.tsx | OrbitControls rotateLeft/rotateUp | Yes | Canvas view | - hold P key
- drag mouse
- scene rotates | |
  | Mouse | Drag & drop JSON | apps/animus-demo/app/canvas/page.tsx `onDropAccepted` | dispatch `SET_MASTER_GRAPH_DATA` | Yes | Canvas overlay | - drag JSON file
- drop onto canvas
- nodes load | |
  | Keyboard | Press "d" with node selected | apps/animus-demo/app/canvas/page.tsx key handler | dispatch `DECOMPOSE_NODE` | Yes | — | - select node
- press "d"
- node expands | only works if selected |
  | Keyboard | Press "c" with node selected | apps/animus-demo/app/canvas/page.tsx key handler | dispatch `COLLAPSE_NODE` | Yes | — | - select node
- press "c"
- node collapses | |
  | Keyboard | Press "f" with node selected | apps/animus-demo/app/canvas/page.tsx key handler | dispatch `FOCUS_NODE` | Yes | — | - select node
- press "f"
- camera centers | |
