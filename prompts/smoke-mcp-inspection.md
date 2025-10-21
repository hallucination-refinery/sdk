# Smoke Test MCP Browser Inspection

Execute browser inspection for Dreamdust Ink smoke test using Playwright MCP tools.

## Objective

Navigate to the smoke test URL, wait for page to settle, capture console messages and screenshot using native MCP browser tools.

## Instructions

1. **Navigate** to the smoke test URL:
   - Use `browser_navigate` tool
   - URL: `http://127.0.0.1:3000/quiz/archetype-v1?pc=scene-03&forceVisible=1`

2. **Wait** for 5 seconds:
   - Allow page to fully load and execute JavaScript
   - Ensure all `[PC]` diagnostic logs have fired

3. **Capture console messages**:
   - Use `browser_console_messages` tool
   - This returns structured array of console entries

4. **Take screenshot**:
   - Use `browser_take_screenshot` tool
   - Filename: `smoke-mcp-screenshot.png`
   - Save to current working directory

5. **Return structured result**:
   ```json
   {
     "success": true,
     "timestamp": "2025-10-21T12:00:00.000Z",
     "consoleMessages": [
       {"type": "log", "text": "...", "location": "..."},
       ...
     ],
     "screenshotPath": "smoke-mcp-screenshot.png",
     "diagnosticMarkers": {
       "renderInfo": true,
       "pointsMesh": true,
       "pointsAfterRender": false,
       "sceneTraversal": true,
       "renderList": true,
       "rendererRenderCall": true
     },
     "url": "http://127.0.0.1:3000/quiz/archetype-v1?pc=scene-03&forceVisible=1"
   }
   ```

## Required Diagnostic Markers

The console should contain these 6 markers (check for presence):
- `[PC] render-info` - Render statistics
- `[PC] points-mesh` - Points mesh metadata
- `[PC] points-after-render` - Post-render verification (may be missing)
- `[PC] scene-traversal` - Scene graph inspection
- `[PC] render-list` - Render list snapshot
- `[PC] renderer-render-call` - Renderer invocation log

## Error Handling

If navigation fails or page doesn't load:
- Return `success: false` with error details
- Include any console errors in the response
- Do NOT fail silently - report all issues

## Output Format

Return ONLY valid JSON - no markdown, no explanation, just the JSON object specified above.
