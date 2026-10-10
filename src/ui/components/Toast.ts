import { cn } from '../theme.js';

type ToastType = 'info' | 'success' | 'error' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  action?: { label: string; onClick: () => void };
}

const toasts: Toast[] = [];
let toastContainer: HTMLDivElement | null = null;
let listeners: Set<(toasts: Toast[]) => void> = new Set();

function notifyListeners(): void {
  listeners.forEach(l => l([...toasts]));
}

function createContainer(): HTMLDivElement {
  if (toastContainer) return toastContainer;
  toastContainer = document.createElement('div');
  toastContainer.className = 'fixed bottom-4 right-4 z-[var(--zIndex-toast)] flex flex-col gap-2 pointer-events-none';
  toastContainer.setAttribute('role', 'region');
  toastContainer.setAttribute('aria-label', 'Notifications');
  document.body.appendChild(toastContainer);
  return toastContainer;
}

function renderToast(toast: Toast): HTMLDivElement {
  const el = document.createElement('div');
  el.dataset.toastId = toast.id;
  const typeClasses = {
    info: 'bg-[var(--color-accent)] text-white',
    success: 'bg-[var(--color-success)] text-white',
    error: 'bg-[var(--color-danger)] text-white',
    warning: 'bg-[var(--color-warning)] text-black',
  };

  el.className = cn(
    'pointer-events-auto flex items-center gap-3 min-w-[280px] max-w-md rounded-xl p-4 shadow-[var(--shadow-lg)]',
    'animate-slide-in-from-right',
    typeClasses[toast.type]
  );

  el.innerHTML = `
    <div class="flex-1 text-sm">${toast.message}</div>
    ${toast.action ? `<button class="px-3 py-1 text-sm font-medium rounded-lg bg-white/20 hover:bg-white/30 transition-colors" data-action>${toast.action.label}</button>` : ''}
    <button class="p-1 rounded-lg hover:bg-white/20 transition-colors" data-dismiss aria-label="Dismiss"><i data-lucide="x" class="w-4 h-4"></i></button>
  `;

  el.querySelector('[data-dismiss]')?.addEventListener('click', () => dismiss(toast.id));
  el.querySelector('[data-action]')?.addEventListener('click', () => { toast.action?.onClick(); dismiss(toast.id); });

  return el;
}

export function toast(message: string, type: ToastType = 'info', options?: { duration?: number; action?: { label: string; onClick: () => void } }): string {
  const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const newToast: Toast = { id, message, type, duration: options?.duration ?? 4000, action: options?.action };
  toasts.push(newToast);
  notifyListeners();

  const container = createContainer();
  container.appendChild(renderToast(newToast));

  if (newToast.duration && newToast.duration > 0) {
    setTimeout(() => dismiss(id), newToast.duration);
  }

  return id;
}

export function toastSuccess(message: string, options?: { duration?: number; action?: { label: string; onClick: () => void } }): string {
  return toast(message, 'success', options);
}

export function toastError(message: string, options?: { duration?: number; action?: { label: string; onClick: () => void } }): string {
  return toast(message, 'error', options);
}

export function toastWarning(message: string, options?: { duration?: number; action?: { label: string; onClick: () => void } }): string {
  return toast(message, 'warning', options);
}

export function toastInfo(message: string, options?: { duration?: number; action?: { label: string; onClick: () => void } }): string {
  return toast(message, 'info', options);
}

export function dismiss(id: string): void {
  const index = toasts.findIndex(t => t.id === id);
  if (index === -1) return;
  toasts.splice(index, 1);
  notifyListeners();

  if (toastContainer) {
    const el = toastContainer.querySelector(`[data-toast-id="${id}"]`);
    if (el) {
      el.classList.add('animate-slide-out-to-right');
      setTimeout(() => el.remove(), 200);
    }
  }
}

export function dismissAll(): void {
  toasts.length = 0;
  notifyListeners();
  if (toastContainer) toastContainer.innerHTML = '';
}

export function subscribeToToasts(listener: (toasts: Toast[]) => void): () => void {
  listeners.add(listener);
  listener([...toasts]);
  return () => listeners.delete(listener);
}

export function useToasts(): { toasts: Toast[]; dismiss: (id: string) => void; dismissAll: () => void } {
  return { toasts: [...toasts], dismiss, dismissAll };
}

declare global {
  interface Window {
    toast: typeof toast;
    toastSuccess: typeof toastSuccess;
    toastError: typeof toastError;
    toastWarning: typeof toastWarning;
    toastInfo: typeof toastInfo;
  }
}

window.toast = toast;
window.toastSuccess = toastSuccess;
window.toastError = toastError;
window.toastWarning = toastWarning;
window.toastInfo = toastInfo;