import { cn } from '../theme.js';

export interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'circle' | 'square';
  status?: 'online' | 'away' | 'offline' | 'busy';
  className?: string;
}

export function Avatar(props: AvatarProps): HTMLDivElement {
  const { src, alt, name, size = 'md', shape = 'circle', status, className } = props;

  const avatar = document.createElement('div');
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
  };
  const shapeClasses = {
    circle: 'rounded-full',
    square: 'rounded-lg',
  };

  avatar.className = cn(
    'inline-flex items-center justify-center overflow-hidden bg-[var(--color-border)] text-[var(--color-muted)] font-medium',
    'transition-colors duration-150',
    sizeClasses[size],
    shapeClasses[shape],
    className
  );

  if (src) {
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt || name || 'Avatar';
    img.className = 'w-full h-full object-cover';
    img.loading = 'lazy';
    avatar.appendChild(img);
  } else if (name) {
    const initials = name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
    avatar.textContent = initials;
  } else {
    avatar.innerHTML = '<i data-lucide="user" class="w-full h-full"></i>';
  }

  if (status) {
    const statusColors = {
      online: 'var(--color-success)',
      away: 'var(--color-warning)',
      busy: 'var(--color-danger)',
      offline: 'var(--color-muted)',
    };
    const statusDot = document.createElement('span');
    const statusSizeClasses = {
      xs: 'w-2 h-2 bottom-0 right-0',
      sm: 'w-2 h-2 bottom-0 right-0',
      md: 'w-2.5 h-2.5 bottom-0 right-0',
      lg: 'w-3 h-3 bottom-0 right-0',
      xl: 'w-4 h-4 bottom-0 right-0',
    };
    statusDot.className = cn(
      'absolute border-2 border-[var(--color-card)] rounded-full',
      statusSizeClasses[size]
    );
    statusDot.style.backgroundColor = statusColors[status];
    avatar.style.position = 'relative';
    avatar.appendChild(statusDot);
  }

  return avatar;
}

export function AvatarGroup(props: { avatars: AvatarProps[]; max?: number; size?: AvatarProps['size']; className?: string }): HTMLDivElement {
  const { avatars, max = 5, size = 'md', className } = props;

  const group = document.createElement('div');
  group.className = cn('flex -space-x-2', className);

  const visibleAvatars = avatars.slice(0, max);
  const remaining = avatars.length - max;

  visibleAvatars.forEach((avatarProps, index) => {
    const avatar = Avatar({ ...avatarProps, size });
    avatar.style.zIndex = String(max - index);
    group.appendChild(avatar);
  });

  if (remaining > 0) {
    const more = document.createElement('div');
    const moreSizeClasses = {
      xs: 'w-6 h-6 text-xs',
      sm: 'w-8 h-8 text-sm',
      md: 'w-10 h-10 text-base',
      lg: 'w-12 h-12 text-lg',
      xl: 'w-16 h-16 text-xl',
    };
    more.className = cn(
      'flex items-center justify-center bg-[var(--color-border)] text-[var(--color-muted)] font-medium border-2 border-[var(--color-card)] rounded-full',
      moreSizeClasses[size]
    );
    more.textContent = `+${remaining}`;
    more.style.zIndex = '0';
    group.appendChild(more);
  }

  return group;
}