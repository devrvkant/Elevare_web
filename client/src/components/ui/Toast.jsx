import { useState, useEffect } from "react";
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";
import toastManager from "@/lib/toast";

const ToastItem = ({ toast, onRemove }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onRemove(toast.id), 300);
    }, toast.duration);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onRemove(toast.id), 300);
  };

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return (
          <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-500 flex-shrink-0" />
        );
      case "error":
        return <XCircle className="w-5 h-5 text-destructive flex-shrink-0" />;
      case "warning":
        return (
          <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0" />
        );
      case "info":
        return <Info className="w-5 h-5 text-primary flex-shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-muted-foreground flex-shrink-0" />;
    }
  };

  const getStyles = () => {
    // Base styles: Glassmorphism in dark mode, clean card in light mode
    const baseStyles =
      "flex items-start gap-3 min-w-[300px] max-w-md p-4 rounded-xl shadow-lg border transition-all duration-300";

    switch (toast.type) {
      case "success":
        return `${baseStyles} bg-white border-green-200 text-green-700 dark:bg-green-500/10 dark:border-green-500/20 dark:text-green-400`;
      case "error":
        return `${baseStyles} bg-white border-red-200 text-destructive dark:bg-destructive/10 dark:border-destructive/20 dark:text-red-400`;
      case "warning":
        return `${baseStyles} bg-white border-yellow-200 text-yellow-700 dark:bg-yellow-500/10 dark:border-yellow-500/20 dark:text-yellow-400`;
      case "info":
        return `${baseStyles} bg-white border-purple-200 text-primary dark:bg-primary/10 dark:border-primary/20 dark:text-purple-400`;
      default:
        return `${baseStyles} bg-white border-border text-foreground dark:bg-card`;
    }
  };

  return (
    <div
      className={`${getStyles()} ${isExiting
        ? "opacity-0 translate-x-full scale-95"
        : "opacity-100 translate-x-0 scale-100"
        }`}
      style={{
        animation: isExiting ? "none" : "toastSlideIn 0.3s ease-out forwards",
      }}
    >
      {getIcon()}
      <p className="flex-1 text-sm font-medium leading-relaxed opacity-90">
        {toast.message}
      </p>
      <button
        onClick={handleClose}
        className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
        aria-label="Close"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const unsubscribe = toastManager.subscribe((toast) => {
      setToasts((prev) => [...prev, toast]);
    });

    return unsubscribe;
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <>
      <style>{`
        @keyframes toastSlideIn {
          from {
            opacity: 0;
            transform: translateX(100%) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
      `}</style>
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
        <div className="flex flex-col gap-3 pointer-events-auto">
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
          ))}
        </div>
      </div>
    </>
  );
}
