import { createContext, useContext, useMemo, useState } from 'react';

const ToastContext = createContext();

const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = (message, type = 'info', duration = 5000) => {
        const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const toast = { id, message, type };

        setToasts((current) => [...current, toast]);

        setTimeout(() => {
            setToasts((current) => current.filter((item) => item.id !== id));
        }, duration);
    };

    const removeToast = (id) => {
        setToasts((current) => current.filter((item) => item.id !== id));
    };

    const value = useMemo(() => ({ showToast, removeToast }), []);

    return (
        <ToastContext.Provider value={value}>
            {children}
            <div className="toast-wrapper">
                {toasts.map((toast) => (
                    <div key={toast.id} className={`toast-item toast-${toast.type}`}>
                        <div className="toast-body">
                            <span>{toast.message}</span>
                            <button type="button" className="btn-close btn-close-white" onClick={() => removeToast(toast.id)} aria-label="Close"></button>
                        </div>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export { ToastProvider, useToast };