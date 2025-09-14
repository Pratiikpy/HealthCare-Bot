import React, { useEffect, useState } from 'react';

type ToastType = 'success' | 'error';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

const toastIcons = {
  success: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  error: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

const toastStyles = {
    success: 'bg-green-100 border-green-300 text-green-800',
    error: 'bg-red-100 border-red-300 text-red-800',
};


export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(true); // Animate in
        const timer = setTimeout(() => {
            setVisible(false);
            setTimeout(onClose, 300); // Allow time for fade-out animation before unmounting
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div 
            className={`fixed top-5 right-5 z-50 flex items-center p-4 rounded-lg shadow-lg border max-w-sm transition-transform duration-300 ${toastStyles[type]} ${visible ? 'translate-x-0' : 'translate-x-[calc(100%+20px)]'}`}
            role="alert"
            aria-live="assertive"
        >
            {toastIcons[type]}
            <p className="ml-3 font-medium">{message}</p>
        </div>
    );
};