import React from 'react';
import { ToastMessage } from '../types';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let bgClass = 'bg-[#0f382c] border-emerald-500 text-emerald-200';
        let icon = 'fa-circle-info text-emerald-400';

        if (toast.type === 'success') {
          bgClass = 'bg-[#071f18] border-emerald-500 text-emerald-200';
          icon = 'fa-circle-check text-emerald-400';
        } else if (toast.type === 'error') {
          bgClass = 'bg-red-950 border-red-500 text-red-200';
          icon = 'fa-triangle-exclamation text-red-400';
        }

        return (
          <div
            key={toast.id}
            onClick={() => onDismiss(toast.id)}
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl border ${bgClass} shadow-xl backdrop-blur-md text-xs font-medium cursor-pointer transition transform duration-200 animate-in fade-in slide-in-from-top-2`}
          >
            <div className="flex items-center gap-2.5">
              <i className={`fa-solid ${icon} text-base shrink-0`}></i>
              <span>{toast.text}</span>
            </div>
            <i className="fa-solid fa-xmark text-xs opacity-50 hover:opacity-100 shrink-0"></i>
          </div>
        );
      })}
    </div>
  );
};
