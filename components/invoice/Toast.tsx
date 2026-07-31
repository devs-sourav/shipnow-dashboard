"use client";

import { useEffect } from "react";
import { FiCheckCircle, FiX } from "react-icons/fi";

interface ToastProps {
  message: string;
  onClose: () => void;
}

// Simple auto-dismiss toast. Kono external library lage nai, plain state-based.
export default function Toast({ message, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-neutral-900 px-4 py-3 text-sm text-white shadow-lg animate-in fade-in slide-in-from-bottom-2">
      <FiCheckCircle className="h-4 w-4 text-emerald-400" />
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 text-neutral-400 hover:text-white">
        <FiX className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}