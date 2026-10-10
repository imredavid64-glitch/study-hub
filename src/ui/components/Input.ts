import { cn } from '../theme.js';

export interface InputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: string;
  rightIcon?: string;
  fullWidth?: boolean;
  className?: string;
  id?: string;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  value?: string | number;
  type?: string;
  name?: string;
  min?: string | number;
  max?: string | number;
  step?: string | number;
  onInput?: (e: Event) => void;
  onChange?: (e: Event) => void;
  onBlur?: (e: Event) => void;
  onFocus?: (e: Event) => void;
  onKeyDown?: (e: KeyboardEvent) => void;
}

export function Input(props: InputProps): HTMLDivElement {
  const {
    label,
    error,
    helperText,
    leftIcon,
    rightIcon,
    fullWidth = true,
    className,
    id,
    disabled,
    required,
    placeholder,
    value,
    type = 'text',
    name,
    min,
    max,
    step,
    onInput,
    onChange,
    onBlur,
    onFocus,
    onKeyDown,
  } = props;

  const wrapper = document.createElement('div');
  wrapper.className = cn('w-full', fullWidth ? 'w-full' : '', className);

  const inputId = id || `input-${Math.random().toString(36).slice(2, 8)}`;

  let html = '';
  if (label) {
    html += `<label for="${inputId}" class="block text-sm font-medium text-[var(--color-text)] mb-1.5">${label}${required ? ' <span class="text-[var(--color-danger)]">*</span>' : ''}</label>`;
  }

  html += `
    <div class="relative">
      ${leftIcon ? `<div class="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)] pointer-events-none"><i data-lucide="${leftIcon}" class="w-5 h-5"></i></div>` : ''}
      <input
        id="${inputId}"
        class="w-full rounded-lg border bg-[var(--color-panel)] text-[var(--color-text)] placeholder-[var(--color-muted)]
          transition-colors duration-150
          focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent
          disabled:opacity-50 disabled:cursor-not-allowed
          ${leftIcon ? 'pl-10' : ''} ${rightIcon ? 'pr-10' : ''}
          ${error ? 'border-[var(--color-danger)] focus:ring-[var(--color-danger)]' : 'border-[var(--color-border)]'}
          px-4 py-2.5 text-sm"
        ${disabled ? 'disabled' : ''}
        ${required ? 'required' : ''}
        ${placeholder ? `placeholder="${placeholder}"` : ''}
        ${value !== undefined ? `value="${value}"` : ''}
        type="${type}"
        ${name ? `name="${name}"` : ''}
        ${min !== undefined ? `min="${min}"` : ''}
        ${max !== undefined ? `max="${max}"` : ''}
        ${step !== undefined ? `step="${step}"` : ''}
      />
      ${rightIcon ? `<div class="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)] pointer-events-none"><i data-lucide="${rightIcon}" class="w-5 h-5"></i></div>` : ''}
    </div>
  `;

  if (error) {
    html += `<p class="mt-1.5 text-sm text-[var(--color-danger)] flex items-center gap-1"><i data-lucide="alert-circle" class="w-3.5 h-3.5"></i>${error}</p>`;
  } else if (helperText) {
    html += `<p class="mt-1.5 text-sm text-[var(--color-muted)]">${helperText}</p>`;
  }

  wrapper.innerHTML = html;
  const input = wrapper.querySelector('input') as HTMLInputElement;

  if (onInput) input.addEventListener('input', onInput);
  if (onChange) input.addEventListener('change', onChange);
  if (onBlur) input.addEventListener('blur', onBlur);
  if (onFocus) input.addEventListener('focus', onFocus);
  if (onKeyDown) input.addEventListener('keydown', onKeyDown);

  return wrapper;
}

export interface TextareaProps extends Omit<InputProps, 'leftIcon' | 'rightIcon' | 'type'> {
  rows?: number;
}

export function Textarea(props: TextareaProps): HTMLDivElement {
  const {
    label,
    error,
    helperText,
    fullWidth = true,
    className,
    id,
    disabled,
    required,
    placeholder,
    value,
    name,
    rows = 4,
    onInput,
    onChange,
    onBlur,
    onFocus,
    onKeyDown,
  } = props;

  const wrapper = document.createElement('div');
  wrapper.className = cn('w-full', fullWidth ? 'w-full' : '', className);

  const inputId = id || `textarea-${Math.random().toString(36).slice(2, 8)}`;

  let html = '';
  if (label) {
    html += `<label for="${inputId}" class="block text-sm font-medium text-[var(--color-text)] mb-1.5">${label}${required ? ' <span class="text-[var(--color-danger)]">*</span>' : ''}</label>`;
  }

  html += `
    <textarea
      id="${inputId}"
      class="w-full rounded-lg border bg-[var(--color-panel)] text-[var(--color-text)] placeholder-[var(--color-muted)]
        transition-colors duration-150 resize-y min-h-[100px]
        focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent
        disabled:opacity-50 disabled:cursor-not-allowed
        ${error ? 'border-[var(--color-danger)] focus:ring-[var(--color-danger)]' : 'border-[var(--color-border)]'}
        px-4 py-3 text-sm"
      rows="${rows}"
      ${disabled ? 'disabled' : ''}
      ${required ? 'required' : ''}
      ${placeholder ? `placeholder="${placeholder}"` : ''}
      ${value !== undefined ? `>${value}</textarea>` : '></textarea>'}
      ${name ? `name="${name}"` : ''}
    `;

  if (error) {
    html += `<p class="mt-1.5 text-sm text-[var(--color-danger)] flex items-center gap-1"><i data-lucide="alert-circle" class="w-3.5 h-3.5"></i>${error}</p>`;
  } else if (helperText) {
    html += `<p class="mt-1.5 text-sm text-[var(--color-muted)]">${helperText}</p>`;
  }

  wrapper.innerHTML = html;
  const textarea = wrapper.querySelector('textarea') as HTMLTextAreaElement;

  if (onInput) textarea.addEventListener('input', onInput);
  if (onChange) textarea.addEventListener('change', onChange);
  if (onBlur) textarea.addEventListener('blur', onBlur);
  if (onFocus) textarea.addEventListener('focus', onFocus);
  if (onKeyDown) textarea.addEventListener('keydown', onKeyDown);

  return wrapper;
}

export interface SelectProps extends Omit<InputProps, 'leftIcon' | 'rightIcon' | 'type'> {
  options: { value: string; label: string }[];
  placeholder?: string;
}

export function Select(props: SelectProps): HTMLDivElement {
  const {
    label,
    error,
    helperText,
    options,
    fullWidth = true,
    className,
    id,
    disabled,
    required,
    placeholder = 'Select...',
    name,
    onChange,
    onBlur,
    onFocus,
  } = props;

  const wrapper = document.createElement('div');
  wrapper.className = cn('w-full', fullWidth ? 'w-full' : '', className);

  const selectId = id || `select-${Math.random().toString(36).slice(2, 8)}`;

  let html = '';
  if (label) {
    html += `<label for="${selectId}" class="block text-sm font-medium text-[var(--color-text)] mb-1.5">${label}${required ? ' <span class="text-[var(--color-danger)]">*</span>' : ''}</label>`;
  }

  html += `
    <select
      id="${selectId}"
      class="w-full rounded-lg border bg-[var(--color-panel)] text-[var(--color-text)]
        appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"%235f6a69\" stroke-width=\"2\"><polyline points=\"6 9 12 15 18 9\"></polyline></svg>')] bg-no-repeat bg-right-3 bg-center
        transition-colors duration-150
        focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent
        disabled:opacity-50 disabled:cursor-not-allowed
        ${error ? 'border-[var(--color-danger)] focus:ring-[var(--color-danger)]' : 'border-[var(--color-border)]'}
        px-4 py-2.5 pr-10 text-sm"
      ${disabled ? 'disabled' : ''}
      ${required ? 'required' : ''}
      ${name ? `name="${name}"` : ''}
    >
      <option value="" disabled selected>${placeholder}</option>
      ${options.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('')}
    </select>
  `;

  if (error) {
    html += `<p class="mt-1.5 text-sm text-[var(--color-danger)] flex items-center gap-1"><i data-lucide="alert-circle" class="w-3.5 h-3.5"></i>${error}</p>`;
  } else if (helperText) {
    html += `<p class="mt-1.5 text-sm text-[var(--color-muted)]">${helperText}</p>`;
  }

  wrapper.innerHTML = html;
  const select = wrapper.querySelector('select') as HTMLSelectElement;

  if (onChange) select.addEventListener('change', onChange);
  if (onBlur) select.addEventListener('blur', onBlur);
  if (onFocus) select.addEventListener('focus', onFocus);

  return wrapper;
}