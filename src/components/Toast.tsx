import React, { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, onClose }) => {

  // Este useEffect se encarga de cerrar el toast automáticamente
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); 

    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  return (

    // Contenedor fijo en la esquina inferior derecha
    <div className="fixed bottom-4 right-4 z-50 animate-slide-in">
      <div className="flex items-center bg-gray-900 dark:bg-gray-800 text-white py-3 px-5 rounded-lg shadow-lg border dark:border-gray-700">
        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
        <span className="font-medium">{message}</span>
        <button
          onClick={onClose}
          className="ml-4 -mr-1 p-1 rounded-full hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;