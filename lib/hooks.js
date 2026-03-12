import { useState, useEffect, useRef } from 'react';

export function useAnimatedNumber(target, duration = 1600) {
  const [current, setCurrent] = useState(0);
  const frameRef = useRef(null);
  const startRef = useRef(null);
  useEffect(() => {
    startRef.current = null;
    const animate = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const p = Math.min((ts - startRef.current) / duration, 1);
      setCurrent(Math.round((1 - Math.pow(1 - p, 4)) * target));
      if (p < 1) frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target, duration]);
  return current;
}

export function useSparklineProgress(delay = 0, duration = 1200) {
  const [progress, setProgress] = useState(0);
  const frameRef = useRef(null);
  const startRef = useRef(null);
  useEffect(() => {
    const timer = setTimeout(() => {
      startRef.current = null;
      const animate = (ts) => {
        if (!startRef.current) startRef.current = ts;
        const p = Math.min((ts - startRef.current) / duration, 1);
        setProgress(1 - Math.pow(1 - p, 3));
        if (p < 1) frameRef.current = requestAnimationFrame(animate);
      };
      frameRef.current = requestAnimationFrame(animate);
    }, delay);
    return () => { clearTimeout(timer); cancelAnimationFrame(frameRef.current); };
  }, [delay, duration]);
  return progress;
}