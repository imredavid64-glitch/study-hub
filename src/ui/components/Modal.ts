import { cn } from '../theme.js';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: HTMLElement | string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
}: ModalProps): HTMLDivElement {
  const modal = document.createElement('div');
  modal.className = cn(
    'fixed inset-0 z-[var(--zIndex-modal)] flex items-center justify-center p-4',
    'opacity-0 pointer-events-none transition-opacity duration-200',
    isOpen ? 'opacity-100 pointer-events-auto' : ''
  );

  modal.innerHTML = `
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" data-modal-overlay></div>
    <div
      class="relative w-full max-h-[90vh] overflow-hidden rounded-2xl bg-[var(--color-card)] shadow-[var(--shadow-xl)]
        transform transition-all duration-200
        ${isOpen ? 'scale-100' : 'scale-95 opacity-0'}"
      role="dialog"
      aria-modal="true"
      ${title ? `aria-labelledby="modal-title"` : ''}
      ${description ? `aria-describedby="modal-description"` : ''}
      data-modal-content
    >
      ${title || showCloseButton ? `
        <div class="flex items-start justify-between p-5 border-b border-[var(--color-border)]">
          <div>
            ${title ? `<h2 id="modal-title" class="text-lg font-semibold text-[var(--color-text)]">${title}</h2>` : ''}
            ${description ? `<p id="modal-description" class="mt-1 text-sm text-[var(--color-muted)]">${description}</p>` : ''}
          </div>
          ${showCloseButton ? `
            <button
              type="button"
              class="p-1 rounded-lg text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-border)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              data-modal-close
              aria-label="Close modal"
            >
              <i data-lucide="x" class="w-5 h-5"></i>
            </button>
          ` : ''}
        </div>
      ` : ''}
      <div class="p-5 overflow-y-auto max-h-[calc(90vh-120px)]" data-modal-body></div>
    </div>
  `;

  const content = modal.querySelector('[data-modal-body]') as HTMLDivElement;
  if (typeof children === 'string') {
    content.innerHTML = children;
  } else {
    content.appendChild(children);
  }

  const overlay = modal.querySelector('[data-modal-overlay]') as HTMLDivElement;
  const closeBtn = modal.querySelector('[data-modal-close]') as HTMLButtonElement;

  if (closeOnOverlayClick) {
    overlay.addEventListener('click', onClose);
  }
  if (closeBtn) {
    closeBtn.addEventListener('click', onClose);
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isOpen) return;
    if (e.key === 'Escape' && closeOnEscape) {
      onClose();
    }
    if (e.key === 'Tab') {
      trapFocus(e, modal);
    }
  };

  if (isOpen) {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
  } else {
    document.removeEventListener('keydown', handleKeyDown);
    document.body.style.overflow = '';
  }

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[90vw]',
  };
  const contentEl = modal.querySelector('[data-modal-content]') as HTMLDivElement;
  contentEl.classList.add(sizeClasses[size]);

  return modal;
}

function trapFocus(e: KeyboardEvent, modal: HTMLElement): void {
  const focusableElements = modal.querySelectorAll<HTMLElement>(
    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (e.shiftKey) {
    if (document.activeElement === firstElement) {
      e.preventDefault();
      lastElement?.focus();
    }
  } else {
    if (document.activeElement === lastElement) {
      e.preventDefault();
      firstElement?.focus();
    }
  }
}

export function AlertDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant: _variant = 'danger',
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary';
}): HTMLDivElement {
  return Modal({
    isOpen,
    onClose,
    title,
    description: message,
    size: 'sm',
    children: (() => {
      const footer = document.createElement('div');
      footer.className = 'flex justify-end gap-3 mt-6';
      footer.innerHTML = `
        <button type="button" class="px-4 py-2 text-sm font-medium rounded-lg bg-[var(--color-panel)] text-[var(--color-text)] border border-[var(--color-border)] hover:bg-[var(--color-border)] transition-colors" data-cancel>${cancelText}</button>
        <button type="button" class="px-4 py-2 text-sm font-medium rounded-lg bg-[var(--color-danger)] text-white hover:brightness-95 transition-colors" data-confirm>${confirmText}</button>
      `;
      footer.querySelector('[data-cancel]')?.addEventListener('click', onClose);
      footer.querySelector('[data-confirm]')?.addEventListener('click', () => { onConfirm(); onClose(); });
      return footer;
    })(),
  });
}