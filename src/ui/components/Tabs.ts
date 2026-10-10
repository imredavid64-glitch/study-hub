import { cn } from '../theme.js';

export interface Tab {
  id: string;
  label: string;
  icon?: string;
  badge?: string | number;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline' | 'segmented';
  fullWidth?: boolean;
  className?: string;
}

export function Tabs(props: TabsProps): HTMLDivElement {
  const { tabs, activeTab, onChange, variant = 'default', fullWidth = false, className } = props;

  const container = document.createElement('div');
  container.className = cn('w-full', className);

  const tabList = document.createElement('div');
  const variantContainerClasses = {
    default: 'flex gap-1',
    pills: 'flex gap-1 bg-[var(--color-border)] rounded-xl p-1',
    underline: 'flex gap-1 border-b border-[var(--color-border)] pb-1',
    segmented: 'flex gap-1 bg-[var(--color-border)] rounded-xl p-1',
  };
  tabList.className = cn(variantContainerClasses[variant], fullWidth && 'flex-wrap');
  tabList.setAttribute('role', 'tablist');

  tabs.forEach(tab => {
    const isActive = tab.id === activeTab;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.role = 'tab';
    btn.id = `tab-${tab.id}`;
    btn.setAttribute('aria-selected', isActive.toString());
    btn.setAttribute('aria-controls', `panel-${tab.id}`);
    btn.disabled = tab.disabled ?? false;

    const baseClasses = 'flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantClasses = {
      default: {
        active: 'bg-[var(--color-accent)] text-white',
        inactive: 'text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-border)]',
      },
      pills: {
        active: 'bg-[var(--color-accent)] text-white',
        inactive: 'text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-border)]',
      },
      underline: {
        active: 'text-[var(--color-accent)] border-b-2 border-[var(--color-accent)] -mb-px',
        inactive: 'text-[var(--color-muted)] hover:text-[var(--color-text)]',
      },
      segmented: {
        active: 'bg-[var(--color-accent)] text-white',
        inactive: 'text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-border)]',
      },
    };

    btn.className = cn(baseClasses, isActive ? variantClasses[variant].active : variantClasses[variant].inactive);

    if (tab.icon) {
      btn.innerHTML += `<i data-lucide="${tab.icon}" class="w-4 h-4 shrink-0"></i>`;
    }
    btn.innerHTML += `<span>${tab.label}</span>`;
    if (tab.badge) {
      btn.innerHTML += `<span class="ml-1.5 px-1.5 py-0.5 text-xs font-medium rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent)]">${tab.badge}</span>`;
    }

    btn.addEventListener('click', () => {
      if (!tab.disabled) onChange(tab.id);
    });

    tabList.appendChild(btn);
  });

  container.appendChild(tabList);
  return container;
}

export function TabPanel(props: { id: string; children: HTMLElement | string; active: boolean }): HTMLDivElement {
  const { id, children, active } = props;
  const panel = document.createElement('div');
  panel.id = `panel-${id}`;
  panel.role = 'tabpanel';
  panel.setAttribute('aria-labelledby', `tab-${id}`);
  panel.hidden = !active;
  panel.className = 'mt-4 animate-fade-in';
  if (typeof children === 'string') panel.innerHTML = children;
  else panel.appendChild(children);
  return panel;
}