import { cn } from '../theme.js';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: string;
  rightIcon?: string;
  disabled?: boolean;
  children?: string | HTMLElement;
  className?: string;
  style?: Partial<CSSStyleDeclaration>;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export function Button(props: ButtonProps): HTMLButtonElement {
  const {
    variant = 'primary',
    size = 'md',
    loading = false,
    fullWidth = false,
    leftIcon,
    rightIcon,
    disabled,
    children,
    className,
    style,
    onClick,
    type = 'button',
  } = props;

  const button = document.createElement('button');
  button.type = type;
  button.disabled = disabled || loading;
  if (onClick) button.addEventListener('click', onClick);

  const variantClasses: Record<string, string> = {
    primary: 'bg-[var(--color-accent)] text-white hover:brightness-95 active:brightness-105 focus-visible:ring-[var(--color-accent)]',
    secondary: 'bg-[var(--color-panel)] text-[var(--color-text)] border border-[var(--color-border)] hover:bg-[var(--color-border)] focus-visible:ring-[var(--color-border)]',
    ghost: 'bg-transparent text-[var(--color-text)] hover:bg-[var(--color-border)] focus-visible:ring-[var(--color-border)]',
    danger: 'bg-[var(--color-danger)] text-white hover:brightness-95 active:brightness-105 focus-visible:ring-[var(--color-danger)]',
    outline: 'bg-transparent text-[var(--color-accent)] border border-[var(--color-accent)] hover:bg-[var(--color-accent-soft)] focus-visible:ring-[var(--color-accent)]',
  };

  const sizeClasses = {
    sm: 'px-2 py-2 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
    icon: 'p-2 text-base',
  };

  button.className = cn(
    'inline-flex items-center justify-center font-medium transition-all duration-150',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    variantClasses[variant] || variantClasses.primary,
    sizeClasses[size],
    fullWidth && 'w-full',
    className
  );

  if (style) Object.assign(button.style, style);

  if (loading) {
    button.innerHTML = `
      <svg class="animate-spin -ml-1 mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"></circle>
        <path class="opacity-75" d="M12 2a10 10 0 0 1 10 10" stroke="currentColor"></path>
      </svg>
      <span>Loading...</span>
    `;
  } else {
    const iconHtml = (icon: string, position: 'left' | 'right') => `
      <span class="inline-flex ${position === 'left' ? 'mr-2' : 'ml-2'} shrink-0">
        <i data-lucide="${icon}" class="w-4 h-4"></i>
      </span>
    `;
    let content = '';
    if (leftIcon) content += iconHtml(leftIcon, 'left');
    if (typeof children === 'string') {
      content += `<span>${children}</span>`;
    } else if (children instanceof HTMLElement) {
      button.appendChild(children);
    }
    if (rightIcon) content += iconHtml(rightIcon, 'right');
    if (content) button.innerHTML = content;
  }

  return button;
}

export interface IconButtonProps {
  icon: string;
  onClick: () => void;
  variant?: ButtonProps['variant'];
  size?: ButtonProps['size'];
  'aria-label': string;
  disabled?: boolean;
}

export function IconButton(props: IconButtonProps): HTMLButtonElement {
  const { icon, onClick, variant = 'ghost', size = 'icon', 'aria-label': ariaLabel, disabled } = props;

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.disabled = disabled ?? false;
  btn.setAttribute('aria-label', ariaLabel);
  btn.addEventListener('click', onClick);

  const variantClasses: Record<string, string> = {
    primary: 'bg-[var(--color-accent)] text-white hover:brightness-95 focus-visible:ring-[var(--color-accent)]',
    secondary: 'bg-[var(--color-panel)] text-[var(--color-text)] border border-[var(--color-border)] hover:bg-[var(--color-border)] focus-visible:ring-[var(--color-border)]',
    ghost: 'bg-transparent text-[var(--color-text)] hover:bg-[var(--color-border)] focus-visible:ring-[var(--color-border)]',
    danger: 'bg-[var(--color-danger)] text-white hover:brightness-95 focus-visible:ring-[var(--color-danger)]',
    outline: 'bg-transparent text-[var(--color-accent)] border border-[var(--color-accent)] hover:bg-[var(--color-accent-soft)] focus-visible:ring-[var(--color-accent)]',
  };

  const sizeClasses = {
    sm: 'p-1.5 text-sm',
    md: 'p-2 text-base',
    icon: 'p-2 text-base',
    lg: 'p-3 text-lg',
  };

  btn.className = cn(
    'inline-flex items-center justify-center transition-all duration-150',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    variantClasses[variant] || variantClasses.ghost,
    sizeClasses[size]
  );
  btn.innerHTML = `<i data-lucide="${icon}" class="w-5 h-5"></i>`;
  return btn;
}