import { useState, useEffect, useRef } from 'react';

export function useFpsTracker() {
  const [fps, setFps] = useState<number>(60);
  const frameCount = useRef<number>(0);
  const lastTime = useRef<number>(performance.now());

  useEffect(() => {
    let animationFrameId: number;

    const calculateFps = () => {
      frameCount.current += 1;
      const now = performance.now();
      const delta = now - lastTime.current;

      // Update FPS value every second
      if (delta >= 1000) {
        const currentFps = Math.round((frameCount.current * 1000) / delta);
        setFps(currentFps);
        
        // Reset tracking boundaries
        frameCount.current = 0;
        lastTime.current = now;
      }

      animationFrameId = requestAnimationFrame(calculateFps);
    };

    animationFrameId = requestAnimationFrame(calculateFps);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return fps;
}
