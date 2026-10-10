import { cn } from '../theme.js';

export interface BadgeProps {
  children: string | number;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  removable?: boolean;
  onRemove?: () => void;
  className?: string;
}

export function Badge(props: BadgeProps): HTMLSpanElement {
  const { children, variant = 'default', size = 'md', dot = false, removable = false, onRemove, className } = props;

  const badge = document.createElement('span');

  const baseClasses = 'inline-flex items-center gap-1.5 font-medium rounded-full transition-colors duration-150';
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base',
  };
  const variantClasses = {
    default: 'bg-[var(--color-accent-soft)] text-[var(--color-accent)]',
    success: 'bg-[var(--color-success)]/15 text-[var(--color-success)]',
    warning: 'bg-[var(--color-warning)]/15 text-[var(--color-warning)]',
    danger: 'bg-[var(--color-danger)]/15 text-[var(--color-danger)]',
    info: 'bg-[var(--color-accent-soft)] text-[var(--color-accent)]',
    outline: 'bg-transparent text-[var(--color-text)] border border-[var(--color-border)]',
  };

  badge.className = cn(baseClasses, sizeClasses[size], variantClasses[variant], className);

  if (dot) {
    badge.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-current"></span><span>${children}</span>`;
  } else {
    badge.textContent = String(children);
  }

  if (removable && onRemove) {
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'ml-1 p-0.5 rounded-full hover:bg-black/10 hover:bg-white/10 transition-colors';
    removeBtn.setAttribute('aria-label', 'Remove');
    removeBtn.innerHTML = '<i data-lucide="x" class="w-3 h-3"></i>';
    removeBtn.addEventListener('click', e => { e.stopPropagation(); onRemove(); });
    badge.appendChild(removeBtn);
  }

  return badge;
}

export function StatusBadge(props: { status: 'active' | 'pending' | 'completed' | 'archived' | 'error'; label?: string }): HTMLSpanElement {
  const configs = {
    active: { variant: 'success' as const, dot: true, text: props.label || 'Active' },
    pending: { variant: 'warning' as const, dot: true, text: props.label || 'Pending' },
    completed: { variant: 'default' as const, dot: true, text: props.label || 'Completed' },
    archived: { variant: 'outline' as const, dot: false, text: props.label || 'Archived' },
    error: { variant: 'danger' as const, dot: true, text: props.label || 'Error' },
  };
  const config = configs[props.status];
  return Badge({ ...config, children: config.text });
}

export function ProgressBadge(props: { value: number; max?: number; variant?: 'default' | 'success' | 'warning' | 'danger'; size?: 'sm' | 'md' }): HTMLSpanElement {
  const { value, max = 100, variant = 'default', size = 'md' } = props;
  const percentage = Math.round((value / max) * 100);
  let badgeVariant = variant;
  if (percentage < 30) badgeVariant = 'danger';
  else if (percentage < 70) badgeVariant = 'warning';
  else badgeVariant = 'success';
  return Badge({ children: `${percentage}%`, variant: badgeVariant, size });
}