import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from "react-icons/fi";

const ToastContext = createContext(null);

const TONES = {
  success: {
    Icon: FiCheckCircle,
    bar: "bg-green-500",
    icon: "text-green-600 bg-green-50",
  },
  error: {
    Icon: FiAlertCircle,
    bar: "bg-red-500",
    icon: "text-red-600 bg-red-50",
  },
  info: {
    Icon: FiInfo,
    bar: "bg-pink-600",
    icon: "text-pink-600 bg-pink-50",
  },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((previous) => previous.filter((toast) => toast.id !== id));
  }, []);

  const push = useCallback(
    (message, tone = "info", duration = 4000) => {
      const id = Date.now() + Math.random();
      setToasts((previous) => [...previous, { id, message, tone }]);
      window.setTimeout(() => dismiss(id), duration);
      return id;
    },
    [dismiss],
  );

  const value = useMemo(
    () => ({
      toast: push,
      success: (message) => push(message, "success"),
      error: (message) => push(message, "error"),
      info: (message) => push(message, "info"),
      dismiss,
    }),
    [push, dismiss],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div className="fixed bottom-5 left-5 z-[60] flex flex-col gap-3 w-[min(22rem,calc(100vw-2.5rem))]">
        {toasts.map(({ id, message, tone }) => {
          const { Icon, bar, icon } = TONES[tone] || TONES.info;

          return (
            <div
              key={id}
              role="status"
              className="relative flex items-start gap-3 p-4 pr-5 rounded-2xl bg-white shadow-glow-lg border border-black/[0.05] animate-fade-up overflow-hidden"
            >
              <span className={`absolute inset-y-0 right-0 w-1.5 ${bar}`} />
              <span
                className={`w-9 h-9 shrink-0 rounded-xl flex items-center justify-center ${icon}`}
              >
                <Icon size={18} />
              </span>
              <p className="flex-1 text-sm font-bold text-gray-800 leading-relaxed pt-1.5">
                {message}
              </p>
              <button
                type="button"
                onClick={() => dismiss(id)}
                className="text-gray-400 hover:text-gray-700 transition-colors pt-1.5"
                aria-label="إغلاق التنبيه"
              >
                <FiX size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }

  return context;
}
