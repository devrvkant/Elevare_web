// Custom Toast System
// Event-based toast notification system without external dependencies

class ToastManager {
  constructor() {
    this.listeners = [];
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  notify(toast) {
    this.listeners.forEach((listener) => listener(toast));
  }

  success(message, options = {}) {
    this.notify({
      id: Date.now() + Math.random(),
      type: "success",
      message,
      duration: options.duration || 3000,
      ...options,
    });
  }

  error(message, options = {}) {
    this.notify({
      id: Date.now() + Math.random(),
      type: "error",
      message,
      duration: options.duration || 4000,
      ...options,
    });
  }

  warning(message, options = {}) {
    this.notify({
      id: Date.now() + Math.random(),
      type: "warning",
      message,
      duration: options.duration || 3500,
      ...options,
    });
  }

  info(message, options = {}) {
    this.notify({
      id: Date.now() + Math.random(),
      type: "info",
      message,
      duration: options.duration || 3000,
      ...options,
    });
  }
}

const toastManager = new ToastManager();

export const toast = {
  success: (message, options) => toastManager.success(message, options),
  error: (message, options) => toastManager.error(message, options),
  warning: (message, options) => toastManager.warning(message, options),
  info: (message, options) => toastManager.info(message, options),
};

export default toastManager;
