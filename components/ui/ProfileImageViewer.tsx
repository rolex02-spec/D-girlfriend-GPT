'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ZoomOut, RotateCcw, Expand } from 'lucide-react';

interface ProfileImageViewerProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  characterName: string;
  fallbackInitial: string;
}

export default function ProfileImageViewer({ 
  isOpen, 
  onClose, 
  imageUrl, 
  characterName, 
  fallbackInitial 
}: ProfileImageViewerProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset transform when image changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen, imageUrl]);

  // Handle keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === '+' || e.key === '=') handleZoomIn();
      if (e.key === '-') handleZoomOut();
      if (e.key === '0') resetView();
      if (e.key === 'r') handleRotate();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale(prev => Math.min(Math.max(prev + delta, 0.5), 5));
  };

  // Drag to pan
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (scale <= 1) return;
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({ x: touch.clientX - position.x, y: touch.clientY - position.y });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    setPosition({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y
    });
    e.preventDefault();
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Zoom controls
  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.25, 5));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.5));
  const resetView = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };
  const handleRotate = () => {
    // Could add rotation state if needed
  };

  // Double-click to zoom in/out
  const handleDoubleClick = () => {
    if (scale > 1) {
      resetView();
    } else {
      setScale(2);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label={`${characterName}'s profile photo`}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/95"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* Image Container */}
        <motion.div
          ref={containerRef}
          className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          onClick={e => e.stopPropagation()}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onDoubleClick={handleDoubleClick}
        >
          {imageUrl ? (
            <img
              ref={imgRef}
              src={imageUrl}
              alt={`${characterName}'s profile photo`}
              className="max-w-[90vw] max-h-[90vh] object-contain cursor-grab"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                transformOrigin: 'center center',
                transition: 'transform 0.1s ease-out',
                userSelect: 'none',
              } as React.CSSProperties}
              draggable={false}
            />
          ) : (
            <div
              className="flex items-center justify-center bg-ink-1 rounded-2xl"
              style={{
                width: 300,
                height: 300,
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                transformOrigin: 'center center',
                transition: 'transform 0.1s ease-out',
              }}
            >
              <span className="font-display text-[120px] text-seal-text">{fallbackInitial}</span>
            </div>
          )}

          {/* Close Button */}
          <motion.button
            onClick={onClose}
            className="absolute -top-14 right-0 h-12 w-12 rounded-full bg-ink-2/80 backdrop-blur-sm border border-hairline flex items-center justify-center text-paper-2 hover:text-paper-1 hover:bg-ink-3 transition-colors btn-press"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Close"
          >
            <X className="h-6 w-6" strokeWidth={2} />
          </motion.button>

          {/* Zoom Controls */}
          {scale > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-ink-2/80 backdrop-blur-sm border border-hairline rounded-full px-4 py-2">
              <motion.button
                onClick={handleZoomOut}
                className="p-2 rounded-full text-paper-2 hover:text-paper-1 hover:bg-ink-3 transition-colors btn-press"
                whileTap={{ scale: 0.9 }}
                aria-label="Zoom out"
              >
                <ZoomOut className="h-5 w-5" strokeWidth={2} />
              </motion.button>
              <span className="px-3 text-caption-1 text-paper-2 font-mono tabular-nums">
                {Math.round(scale * 100)}%
              </span>
              <motion.button
                onClick={handleZoomIn}
                className="p-2 rounded-full text-paper-2 hover:text-paper-1 hover:bg-ink-3 transition-colors btn-press"
                whileTap={{ scale: 0.9 }}
                aria-label="Zoom in"
              >
                <ZoomIn className="h-5 w-5" strokeWidth={2} />
              </motion.button>
              <motion.button
                onClick={resetView}
                className="p-2 rounded-full text-paper-2 hover:text-paper-1 hover:bg-ink-3 transition-colors btn-press"
                whileTap={{ scale: 0.9 }}
                aria-label="Reset view"
              >
                <RotateCcw className="h-5 w-5" strokeWidth={2} />
              </motion.button>
            </div>
          )}

          {/* Instructions */}
          <div className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 text-center text-caption-4 text-paper-3 whitespace-nowrap opacity-70">
            {scale > 1 
              ? 'Drag to pan • Scroll to zoom • Double-click to reset • ESC to close'
              : 'Click to zoom • ESC to close'}
          </div>
        </motion.div>

        {/* Character Name */}
        <motion.div
          className="absolute bottom-[-60px] left-1/2 -translate-x-1/2 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="font-display text-h6 text-paper-1">{characterName}</p>
          <p className="text-caption-3 text-paper-3">Tap image to view full size</p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}