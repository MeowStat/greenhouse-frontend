'use client';

import type React from 'react';

import { X } from 'lucide-react';
import { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBackdropClick: (event: React.MouseEvent) => void;
  children: React.ReactNode;
  title?: string;
}

export function Modal({
  isOpen,
  onClose,
  onBackdropClick,
  children,
  title,
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 px-5"
      onClick={onBackdropClick}
    >
      <div className="bg-white rounded-3xl p-8 w-full max-w-2xl mx-4 relative shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-6 top-6 hover:bg-gray-100 p-1 rounded-full"
        >
          <X className="h-6 w-6" />
        </button>
        {title && (
          <h2 className="text-center text-3xl font-bold text-green-900 mb-4">
            {title}
          </h2>
        )}
        {children}
      </div>
    </div>
  );
}
