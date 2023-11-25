/* eslint-disable no-unused-vars */
import React, { useState, useEffect, createContext, useContext } from "react"

const ToastContext = createContext();
const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = (toast) => {
        setToasts((prevToasts) => [...prevToasts, toast]);
    };

    const removeToast = (id) => {
        setToasts((prevToasts) =>
            prevToasts.map((toast) =>
                toast.id === id ? { ...toast, dismissing: true } : toast
            )
        );

        setTimeout(() => {
            setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
        }, 1000);
    };

    const startToastTimeout = (toast) => {
        const timeoutId = setTimeout(() => {
            removeToast(toast.id);
        }, 5000);

        return timeoutId;
    };

    useEffect(() => {
        toasts.forEach((toast) => {
            const timeoutId = startToastTimeout(toast);

            return () => {
                clearTimeout(timeoutId);
            };
        });
    }, [toasts]);

    const toast = ({ title, description, variant }) => {
        const id = Date.now().toString();

        const newToast = { id, title, description, variant, dismissing: false };
        addToast(newToast);

        return {
            id,
            dismiss: () => removeToast(id),
        };
    };

    return (
        <ToastContext.Provider value={toast}>
            {children}
            <div className="toast-container rounded-2xl">
                {toasts.map((toast, index) => (
                    <div
                        key={toast.id}
                        className={`toast ${toast.variant} ${toast.dismissing ? 'fade-out' : ''}`}
                        style={{ bottom: `${index * 70}px` }}
                    >
                        <div className="alert alert-info">
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
