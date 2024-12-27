import React from 'react';

export const App = () => {
  const onMaximiseClick = () => {
    window.electronWindow.setFullscreen();
  };

  const onMinimiseClick = () => {
    window.electronWindow.unsetFullscreen();
  };

  return (
    <div>
      <h1>react bitches</h1>
      <button onClick={onMaximiseClick}>Maximise</button>
      <button onClick={onMinimiseClick}>minimise</button>
    </div>
  );
};
