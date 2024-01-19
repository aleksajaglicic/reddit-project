import React, { useState, useEffect, createContext, useContext, ReactNode } from "react";

interface Toast {
    id: string;
    title: string;
    description: string;
    variant: string;
    dismissing: boolean;
}

interface ToastProviderProps {
    children: ReactNode;
}

const ToastContext = createContext<((options: {
    title: string;
    description: string;
    variant: string;
}) => void) | undefined>(undefined);

const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);
    
        const addToast = (toast: Toast) => {
        setToasts((prevToasts) => [...prevToasts, toast]);
        };
    
        const removeToast = (id: string) => {
        setToasts((prevToasts) =>
            prevToasts.map((toast) =>
            toast.id === id ? { ...toast, dismissing: true } : toast
            )
        );
    
        setTimeout(() => {
            setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
        }, 1000);
        };
    
        const startToastTimeout = (toast: Toast) => {
        const timeoutId = setTimeout(() => {
            removeToast(toast.id);
        }, 5000);
    
        return timeoutId;
        };
    
        const toastValue = ({ title, description, variant }: { title: string; description: string; variant: string }) => {
        const id = Date.now().toString();
    
        const newToast = { id, title, description, variant, dismissing: false };
        addToast(newToast);
    
        return {
            id,
            dismiss: () => removeToast(id),
        };
    };

    return (
    <ToastContext.Provider value={toastValue}>
        {children}
        <div className="toast-container rounded-2xl">
            {toasts.map((toast, index) => (
            <div
                key={toast.id}
                className={`toast ${toast.variant} ${toast.dismissing ? 'fade-out' : ''}`}
                style={{ bottom: `${index * 70}px` }}
            >
                <div className="alert alert-warning">
                <div className="toast-title">{toast.title}</div>
                <div className="toast-description">{toast.description}</div>
                <button className="toast-dismiss" onClick={() => removeToast(toast.id)}>
                    Dismiss
                </button>
                </div>
            </div>
            ))}
        </div>
        </ToastContext.Provider>
    );
};

const useToast = () => {
    const toast = useContext(ToastContext);

    if (!toast) {
        throw new Error('useToast must be used within a ToastProvider');
    }

    return toast;
};

export { ToastProvider, useToast };
