// src/components/BigTextToggle.tsx
import React, { useEffect, useState } from 'react';

const STORAGE_KEY = 'polo_big_text';

export default function BigTextToggle(): JSX.Element {
  const [isBig, setIsBig] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  // Al montar: aplicar preferencia
  useEffect(() => {
    if (isBig) {
      document.documentElement.classList.add('text-lg');
    } else {
      document.documentElement.classList.remove('text-lg');
    }
  }, [isBig]);

  // Sincronizar localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(isBig));
    } catch {}
  }, [isBig]);

  const toggle = () => setIsBig(prev => !prev);

  return (
    <button
      onClick={toggle}
      aria-pressed={isBig}
      className="px-3 py-2 rounded-md text-sm md:text-base
                 bg-green-700 hover:bg-green-800 text-white transition"
      title={isBig ? 'Reducir texto' : 'Agrandar texto'}
    >
      {isBig ? 'Reducir texto' : 'Agrandar texto'}
    </button>
  );
}
