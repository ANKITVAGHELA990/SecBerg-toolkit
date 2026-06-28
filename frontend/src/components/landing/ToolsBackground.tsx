export function ToolsBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {/* Animated Minimalist Glowing Blobs */}
      <div className="tools-glow-blob-1 animate-glow-1" />
      <div className="tools-glow-blob-2 animate-glow-2" />
      <div className="tools-glow-blob-3 animate-glow-3" />
      
      {/* Faint Tech Grid Pattern Overlay */}
      <div className="tools-grid-bg" />
      
      {/* Radial fade to smooth out transitions */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-surface" />
    </div>
  );
}
