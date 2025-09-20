// Performance utility functions
export const performanceUtils = {
  // Check if device has good performance capabilities
  isHighPerformanceDevice: (): boolean => {
    // Check for WebGL support
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) return false;

    // Check device memory (if available)
    const deviceMemory = (navigator as any).deviceMemory;
    if (deviceMemory && deviceMemory < 4) return false;

    // Check if mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) return false;

    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return false;

    // Check hardware concurrency (CPU cores)
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) return false;

    return true;
  },

  // Throttle function calls for performance
  throttle: <T extends (...args: any[]) => any>(func: T, limit: number): T => {
    let lastRun = 0;
    return ((...args: Parameters<T>) => {
      if (Date.now() - lastRun >= limit) {
        lastRun = Date.now();
        return func(...args);
      }
    }) as T;
  },

  // Debounce function calls
  debounce: <T extends (...args: any[]) => any>(func: T, delay: number): T => {
    let timeoutId: NodeJS.Timeout;
    return ((...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    }) as T;
  },

  // Check if user prefers reduced motion
  prefersReducedMotion: (): boolean => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  // Get optimal frame rate based on device capabilities
  getOptimalFrameRate: (): number => {
    const isHighPerf = performanceUtils.isHighPerformanceDevice();
    return isHighPerf ? 60 : 30;
  }
};