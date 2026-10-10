import { cn } from '../theme.js';

export interface CardProps {
  variant?: 'default' | 'elevated' | 'outlined' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  className?: string;
  children?: HTMLElement | string;
  onClick?: () => void;
}

export function Card(props: CardProps): HTMLDivElement {
  const { variant = 'default', padding = 'md', hover = false, className, children, onClick } = props;

  const card = document.createElement('div');
  card.className = cn(
    'rounded-xl transition-all duration-150',
    {
      'bg-[var(--color-card)]': variant === 'default' || variant === 'interactive',
      'bg-[var(--color-card)] shadow-[var(--shadow-lg)]': variant === 'elevated',
      'bg-[var(--color-card)] border border-[var(--color-border)]': variant === 'outlined',
      'cursor-pointer hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5': hover || variant === 'interactive',
      'p-0': padding === 'none',
      'p-3': padding === 'sm',
      'p-5': padding === 'md',
      'p-6': padding === 'lg',
    },
    className
  );

  if (onClick) {
    card.addEventListener('click', onClick);
    card.style.cursor = 'pointer';
  }

  if (typeof children === 'string') {
    card.innerHTML = children;
  } else if (children instanceof HTMLElement) {
    card.appendChild(children);
  }

  return card;
}

export function CardHeader(props: { children: HTMLElement | string; className?: string; action?: HTMLElement }): HTMLDivElement {
  const { children, className, action } = props;
  const header = document.createElement('div');
  header.className = cn('flex items-center justify-between mb-4', className);
  if (typeof children === 'string') header.innerHTML = children;
  else header.appendChild(children);
  if (action) header.appendChild(action);
  return header;
}

export function CardTitle(props: { children: string; className?: string }): HTMLHeadingElement {
  const title = document.createElement('h3');
  title.className = cn('text-lg font-semibold text-[var(--color-text)]', props.className);
  title.textContent = props.children;
  return title;
}

export function CardDescription(props: { children: string; className?: string }): HTMLParagraphElement {
  const desc = document.createElement('p');
  desc.className = cn('text-sm text-[var(--color-muted)] mt-1', props.className);
  desc.textContent = props.children;
  return desc;
}

export function CardContent(props: { children: HTMLElement | string; className?: string }): HTMLDivElement {
  const content = document.createElement('div');
  content.className = cn(props.className);
  if (typeof props.children === 'string') content.innerHTML = props.children;
  else content.appendChild(props.children);
  return content;
}

export function CardFooter(props: { children: HTMLElement | string; className?: string }): HTMLDivElement {
  const footer = document.createElement('div');
  footer.className = cn('flex items-center gap-3 mt-4 pt-4 border-t border-[var(--color-border)]', props.className);
  if (typeof props.children === 'string') footer.innerHTML = props.children;
  else footer.appendChild(props.children);
  return footer;
}