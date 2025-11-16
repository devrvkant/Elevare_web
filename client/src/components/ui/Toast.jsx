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
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
        );
      case "error":
        return <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />;
      case "warning":
        return (
          <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
        );
      case "info":
        return <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-gray-600 flex-shrink-0" />;
    }
  };

  const getStyles = () => {
    const baseStyles =
      "flex items-start gap-3 min-w-[300px] max-w-md p-4 rounded-lg shadow-lg border backdrop-blur-sm transition-all duration-300";

    switch (toast.type) {
      case "success":
        return `${baseStyles} bg-green-50/95 border-green-200`;
      case "error":
        return `${baseStyles} bg-red-50/95 border-red-200`;
      case "warning":
        return `${baseStyles} bg-yellow-50/95 border-yellow-200`;
      case "info":
        return `${baseStyles} bg-blue-50/95 border-blue-200`;
      default:
        return `${baseStyles} bg-white/95 border-gray-200`;
    }
  };

  return (
    <div
      className={`${getStyles()} ${
        isExiting
          ? "opacity-0 translate-x-full scale-95"
          : "opacity-100 translate-x-0 scale-100"
      }`}
      style={{
        animation: isExiting ? "none" : "toastSlideIn 0.3s ease-out forwards",
      }}
    >
      {getIcon()}
      <p className="flex-1 text-sm font-medium text-gray-800 leading-relaxed">
        {toast.message}
      </p>
      <button
        onClick={handleClose}
        className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
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
