# Input Hub Implementation Plan

## Overview
Task 6: Implement Input Hub for Multimodal Control
- Complexity: 9
- Dependencies: Canvas Task 5 (for intent-to-command mapping)
- Status: Planning (blocked on Canvas completion)

## Architecture Design

### Package Structure
The implementation will create three packages following single-responsibility principle:

1. **@refinery/sensors-gesture**
   - MediaPipe Vision API integration
   - Hand gesture detection and classification
   - Real-time landmark tracking
   - Gesture smoothing and confidence scoring

2. **@refinery/sensors-voice**
   - Eleven Labs API integration
   - Voice command processing
   - Text-to-speech feedback
   - Natural language intent extraction

3. **@refinery/input-hub**
   - Unified event bus (EventEmitter pattern)
   - Intent mapping and routing
   - Multimodal coordination
   - Conflict resolution

### Core Interfaces

```typescript
// Intent System
interface Intent {
  id: string;
  source: 'gesture' | 'voice' | 'multimodal';
  type: IntentType;
  confidence: number;
  timestamp: number;
  payload: Record<string, unknown>;
  metadata?: {
    gestureData?: GestureData;
    voiceData?: VoiceData;
  };
}

enum IntentType {
  // Navigation
  SELECT_NODE = 'SELECT_NODE',
  ZOOM_IN = 'ZOOM_IN',
  ZOOM_OUT = 'ZOOM_OUT',
  PAN = 'PAN',
  ROTATE = 'ROTATE',
  
  // Graph Operations
  CREATE_NODE = 'CREATE_NODE',
  DELETE_NODE = 'DELETE_NODE',
  CREATE_EDGE = 'CREATE_EDGE',
  DELETE_EDGE = 'DELETE_EDGE',
  
  // Editing
  EDIT_NODE = 'EDIT_NODE',
  MOVE_NODE = 'MOVE_NODE',
  GROUP_NODES = 'GROUP_NODES',
  
  // UI Control
  OPEN_MENU = 'OPEN_MENU',
  CLOSE_MENU = 'CLOSE_MENU',
  TOGGLE_MODE = 'TOGGLE_MODE'
}

// Gesture Recognition
interface GestureData {
  type: GestureType;
  landmarks: HandLandmark[];
  confidence: number;
  velocity?: Vector3;
  duration?: number;
}

enum GestureType {
  POINT = 'POINT',
  GRAB = 'GRAB',
  PINCH = 'PINCH',
  SWIPE_LEFT = 'SWIPE_LEFT',
  SWIPE_RIGHT = 'SWIPE_RIGHT',
  SWIPE_UP = 'SWIPE_UP',
  SWIPE_DOWN = 'SWIPE_DOWN',
  ROTATE_CW = 'ROTATE_CW',
  ROTATE_CCW = 'ROTATE_CCW',
  PALM_OPEN = 'PALM_OPEN',
  FIST = 'FIST'
}

// Voice Processing
interface VoiceData {
  transcript: string;
  confidence: number;
  language: string;
  emotion?: string;
}
```

## Implementation Steps

### Phase 1: Foundation (Subtasks 1, 5)
1. Setup package structures with TypeScript configs
2. Implement core Intent Bus with EventEmitter
3. Define all interfaces and enums
4. Create basic unit test scaffolding

### Phase 2: Gesture Recognition (Subtasks 2, 3, 6)
1. Integrate MediaPipe Vision SDK
2. Setup WebAssembly asset loading
3. Implement hand landmark detection
4. Create gesture classifier
5. Build gesture-to-intent mapper
6. Add gesture calibration system

### Phase 3: Voice Processing (Subtasks 4, 7)
1. Integrate Eleven Labs SDK
2. Implement voice command parser
3. Create natural language intent extraction
4. Build voice-to-intent mapper
5. Add TTS feedback system

### Phase 4: Multimodal Coordination (Subtask 8)
1. Implement temporal alignment for multi-input
2. Create fusion algorithms for gesture+voice
3. Build conflict resolution system
4. Add performance monitoring
5. Implement intent prioritization

## Technical Considerations

### Performance Requirements
- Gesture tracking: 60 FPS minimum
- Gesture latency: <50ms from detection to intent
- Voice latency: <200ms from speech end to intent
- Memory usage: <100MB for all input processing

### Accessibility
- Full keyboard navigation fallback
- Screen reader announcements for all intents
- Visual feedback for voice commands
- Gesture alternatives for all operations

### Security
- API key management via environment variables
- Input sanitization for voice commands
- Rate limiting for API calls
- Privacy-preserving gesture processing (no cloud upload)

## Dependencies

### External Libraries
- @mediapipe/tasks-vision: ^0.10.0
- elevenlabs: ^0.1.0 (or latest)
- eventemitter3: ^5.0.0

### Internal Dependencies
- @refinery/schema: For type definitions
- @refinery/store: For command queue integration (blocked)
- @refinery/canvas-r3f: For intent-to-command mapping (blocked)

## Testing Strategy

### Unit Tests
- Gesture recognition accuracy (>90% for basic gestures)
- Voice command parsing correctness
- Intent bus event handling
- Multimodal fusion logic

### Integration Tests
- End-to-end gesture to intent flow
- Voice to intent flow with TTS feedback
- Multimodal scenarios (gesture + voice)
- Performance benchmarks

### User Acceptance Tests
- Real-world gesture recognition in various lighting
- Voice command recognition with accents
- Latency perception testing
- Accessibility compliance verification

## Risk Mitigation

1. **MediaPipe WebAssembly Loading Issues**
   - Fallback to simplified gesture set
   - Graceful degradation messaging

2. **Eleven Labs API Limits**
   - Implement caching for common TTS responses
   - Batch API calls where possible
   - Fallback to browser TTS

3. **Performance Degradation**
   - Implement adaptive quality settings
   - Frame skipping for low-end devices
   - Progressive enhancement approach

4. **Browser Compatibility**
   - Feature detection for all APIs
   - Polyfills where available
   - Clear compatibility matrix in docs

## Next Steps
1. Wait for Canvas Task 5 completion to understand command API
2. Research MediaPipe Vision API best practices
3. Review Eleven Labs SDK documentation
4. Prepare development environment with camera access
5. Create proof-of-concept for gesture detection

---

_Created: 2025-07-02 by Input Agent_
_Status: Planning (Blocked on Canvas Task 5)_