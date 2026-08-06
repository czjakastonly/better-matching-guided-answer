import React from 'react';

const fullscreenContext = React.createContext({
  parentIsFullscreen: false,
  parentCanvasRef: React.createRef(),
  openParentFullscreen: () => {},
  closeParentFullscreen: () => {},
});

export default fullscreenContext;
