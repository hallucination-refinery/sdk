// FPS Capture Script for Legacy Demo
// Run this in the browser console while viewing the demo

function captureFPS(duration = 5000) {
  console.log('Starting FPS capture for', duration / 1000, 'seconds...');
  
  const samples = [];
  let lastTime = performance.now();
  let frameCount = 0;
  
  function measureFrame() {
    const currentTime = performance.now();
    const deltaTime = currentTime - lastTime;
    
    if (deltaTime >= 1000) {
      // Calculate FPS for the last second
      const fps = Math.round((frameCount * 1000) / deltaTime);
      samples.push(fps);
      console.log(`FPS: ${fps}`);
      
      frameCount = 0;
      lastTime = currentTime;
    }
    
    frameCount++;
    
    if (currentTime < startTime + duration) {
      requestAnimationFrame(measureFrame);
    } else {
      // Calculate statistics
      const avgFPS = Math.round(samples.reduce((a, b) => a + b, 0) / samples.length);
      const minFPS = Math.min(...samples);
      const maxFPS = Math.max(...samples);
      
      console.log('\n=== FPS Capture Results ===');
      console.log(`Average FPS: ${avgFPS}`);
      console.log(`Min FPS: ${minFPS}`);
      console.log(`Max FPS: ${maxFPS}`);
      console.log(`Samples: ${samples.join(', ')}`);
      console.log(`Demo maintains ${avgFPS >= 60 ? '✅' : '❌'} ≥60 FPS target`);
      
      // Return results
      return {
        average: avgFPS,
        min: minFPS,
        max: maxFPS,
        samples: samples,
        maintainsTarget: avgFPS >= 60
      };
    }
  }
  
  const startTime = performance.now();
  requestAnimationFrame(measureFrame);
}

// To use: captureFPS(5000) for a 5-second capture
console.log('FPS capture script loaded. Run captureFPS() to start measuring.');