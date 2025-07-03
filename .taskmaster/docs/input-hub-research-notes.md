# Input Hub Research Notes

## MediaPipe Vision API Research

### Key Findings
1. **WebAssembly Performance**
   - MediaPipe runs efficiently in WASM with near-native performance
   - Hand tracking can achieve 30-60 FPS on modern devices
   - GPU acceleration available via WebGL backend

2. **Hand Landmarker Model**
   - Provides 21 3D landmarks per hand
   - Supports up to 2 hands simultaneously
   - Confidence scores for each landmark
   - File sizes: ~6MB for model, ~2MB for WASM runtime

3. **Best Practices**
   - Use `HandLandmarker` for real-time tracking
   - Implement frame skipping for low-end devices
   - Cache model files with service worker
   - Use `runningMode: 'VIDEO'` for continuous tracking

4. **Integration Pattern**
   ```typescript
   import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
   
   // Initialize
   const vision = await FilesetResolver.forVisionTasks(
     'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm'
   );
   
   const handLandmarker = await HandLandmarker.createFromOptions(vision, {
     baseOptions: {
       modelAssetPath: '/models/hand_landmarker.task',
       delegate: 'GPU' // or 'CPU'
     },
     runningMode: 'VIDEO',
     numHands: 2,
     minHandDetectionConfidence: 0.5,
     minHandPresenceConfidence: 0.5,
     minTrackingConfidence: 0.5
   });
   ```

## Eleven Labs API Research

### Key Findings
1. **SDK Capabilities**
   - Text-to-speech with multiple voices
   - Voice cloning (with permission)
   - Streaming audio generation
   - WebSocket support for real-time

2. **Best Practices**
   - Use streaming for lower latency
   - Cache common phrases
   - Implement retry logic with exponential backoff
   - Monitor usage quotas

3. **Integration Pattern**
   ```typescript
   import { ElevenLabsClient } from 'elevenlabs';
   
   const client = new ElevenLabsClient({
     apiKey: process.env.ELEVEN_LABS_API_KEY
   });
   
   // Text-to-speech
   const audio = await client.generate({
     voice: 'rachel',
     text: 'Node selected',
     model_id: 'eleven_monolingual_v1'
   });
   ```

## Intent Mapping Research

### Gesture-to-Intent Mappings
1. **Navigation Gestures**
   - Point → SELECT_NODE (ray-cast from index finger)
   - Pinch → ZOOM (distance between thumb/index)
   - Open palm + move → PAN
   - Fist + rotate → ROTATE_VIEW

2. **Manipulation Gestures**
   - Grab (fist) → MOVE_NODE
   - Two-hand spread → CREATE_NODE
   - Swipe → DELETE_NODE
   - Two-finger pinch → CREATE_EDGE

3. **UI Control Gestures**
   - Palm facing camera → OPEN_MENU
   - Fist → CLOSE_MENU
   - Peace sign → TOGGLE_MODE

### Voice Command Grammar
1. **Navigation Commands**
   - "Select [node name]"
   - "Zoom in/out"
   - "Center view"
   - "Focus on [node]"

2. **Creation Commands**
   - "Create node [name]"
   - "Connect [A] to [B]"
   - "Add cluster"

3. **Editing Commands**
   - "Rename to [name]"
   - "Delete selection"
   - "Group selected"

### Multimodal Fusion
1. **Complementary Actions**
   - Voice: "Create node" + Gesture: Point = Create at location
   - Voice: "Connect" + Gesture: Draw line = Create edge
   - Voice: "Zoom to" + Gesture: Point = Zoom to specific node

2. **Conflict Resolution**
   - Voice commands take precedence for discrete actions
   - Gestures take precedence for continuous actions
   - Timestamp-based arbitration for simultaneous inputs

## Performance Optimization Strategies

### Frame Processing
1. **Adaptive Quality**
   - High: Every frame (60 FPS)
   - Medium: Every 2nd frame (30 FPS)
   - Low: Every 4th frame (15 FPS)

2. **Early Exit Conditions**
   - Skip processing if no hands visible
   - Skip if confidence below threshold
   - Skip if user idle > 5 seconds

### Memory Management
1. **Object Pooling**
   - Reuse landmark arrays
   - Pool gesture detection results
   - Recycle intent objects

2. **Garbage Collection**
   - Avoid creating objects in hot paths
   - Use typed arrays for landmarks
   - Clear references promptly

## Accessibility Considerations

### Alternative Input Methods
1. **Keyboard Shortcuts**
   - Map all gestures to keyboard equivalents
   - Provide customizable key bindings
   - Show hints in UI

2. **Voice Alternatives**
   - All gestures have voice equivalents
   - Support command aliases
   - Phonetic matching for names

3. **Visual Feedback**
   - Show gesture recognition status
   - Display confidence levels
   - Provide gesture guides

## Security & Privacy

### Data Handling
1. **Local Processing**
   - All gesture processing on-device
   - No video data leaves browser
   - Only intents transmitted

2. **API Key Management**
   - Environment variables only
   - Never expose in client code
   - Implement rate limiting

3. **User Consent**
   - Request camera permission explicitly
   - Provide privacy policy
   - Allow opt-out options

---

_Last Updated: 2025-07-02 by Input Agent_