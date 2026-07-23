import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface Toast {
  id: number;
  message: string;
}

interface ToastContextValue {
  showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let nextId = 0;

/**
 * Mounts once at the app root (see App.tsx). Renders a small stack of
 * toasts fixed to the bottom of the viewport — thumb-reachable on mobile,
 * unlike a top-of-screen toast. No external toast library: the app only
 * ever needs one simple "X copied" style message, so a ~40-line
 * context/provider is the right amount of code, not an under-build.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string) => {
    const id = nextId++;
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        aria-live="polite"
        role="status"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper shadow-lg"
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/** Returns `showToast(message)` — call from anywhere under `ToastProvider`. */
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}
