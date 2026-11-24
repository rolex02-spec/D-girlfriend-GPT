/**
 * Three.js Optimization Utilities
 * Provides fallbacks and optimizations for 3D rendering
 */

declare global {
  interface Window {
    __THREE_PIXEL_RATIO__?: number;
    __HAS_WEBGL__?: boolean;
  }
}

export class ThreeJSOptimizer {
  static isWebGLAvailable(): boolean {
    if (typeof window === 'undefined') return false;
    
    try {
      const canvas = document.createElement('canvas');
      return !!(
        window.WebGLRenderingContext && 
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );
    } catch (e) {
      return false;
    }
  }

  static getDevicePixelRatio(): number {
    if (typeof window === 'undefined') return 1;
    return window.devicePixelRatio || 1;
  }

  static setupDefaultSettings() {
    if (typeof window === 'undefined') return;
    
    // Store device pixel ratio globally
    (window as any).__THREE_PIXEL_RATIO__ = ThreeJSOptimizer.getDevicePixelRatio();
    (window as any).__HAS_WEBGL__ = ThreeJSOptimizer.isWebGLAvailable();
    
    console.log('Three.js optimizer initialized', {
      pixelRatio: ThreeJSOptimizer.getDevicePixelRatio(),
      hasWebGL: ThreeJSOptimizer.isWebGLAvailable()
    });
  }

  static getCanvasConfig() {
    return {
      antialias: true,
      alpha: false,
      depth: true,
      stencil: false,
      powerPreference: 'high-performance' as const,
    };
  }
}

// Preload Three.js assets
export const preloadThreeJS = async () => {
  try {
    const [three, drei] = await Promise.all([
      import('three'),
      import('@react-three/drei')
    ]);
    
    return {
      THREE: three,
      drei: drei,
    };
  } catch (error) {
    console.error('Failed to preload Three.js:', error);
    return null;
  }
};