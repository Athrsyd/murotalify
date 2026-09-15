'use client';

import { useApp } from '../context/AppContext';

export default function Toast() {
  const { state } = useApp();

  if (!state.toast) return null;

  return (
    <div className="toast-container">
      <div className="toast">{state.toast}</div>
    </div>
  );
}
