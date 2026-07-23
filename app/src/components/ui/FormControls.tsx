import type {
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from "react";

interface FieldWrapperProps {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  count?: { current: number; max: number };
  children: ReactNode;
}

function FieldWrapper({
  label,
  htmlFor,
  error,
  hint,
  count,
  children,
}: FieldWrapperProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between">
        <label
          htmlFor={htmlFor}
          className="font-display text-sm font-semibold tracking-wide text-ink"
        >
          {label}
        </label>
        {count && (
          <span
            className={`font-mono text-xs ${
              count.current > count.max ? "text-danger" : "text-slate"
            }`}
          >
            {count.current}/{count.max}
          </span>
        )}
      </div>
      {children}
      {hint && !error && <p className="text-xs text-slate">{hint}</p>}
      {error && (
        <p role="alert" className="text-xs font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

/** Single-line text input with label, optional character counter, and error text. */
export function TextField({
  label,
  error,
  hint,
  maxLength,
  id,
  value,
  ...props
}: TextFieldProps) {
  return (
    <FieldWrapper
      label={label}
      htmlFor={id ?? label}
      error={error}
      hint={hint}
      count={
        maxLength
          ? { current: String(value ?? "").length, max: maxLength }
          : undefined
      }
    >
      <input
        id={id}
        value={value}
        maxLength={maxLength}
        aria-invalid={Boolean(error)}
        className={`w-full rounded-sm border bg-paper px-3 py-2 text-ink placeholder:text-slate/60 focus:outline-none focus:ring-2 focus:ring-ink/40 ${
          error ? "border-danger" : "border-line"
        }`}
        {...props}
      />
    </FieldWrapper>
  );
}

interface TextAreaFieldProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
}

/** Multi-line textarea with the same label/counter/error treatment as TextField. */
export function TextAreaField({
  label,
  error,
  hint,
  maxLength,
  id,
  value,
  rows = 4,
  ...props
}: TextAreaFieldProps) {
  return (
    <FieldWrapper
      label={label}
      htmlFor={id ?? label}
      error={error}
      hint={hint}
      count={
        maxLength
          ? { current: String(value ?? "").length, max: maxLength }
          : undefined
      }
    >
      <textarea
        id={id}
        value={value}
        maxLength={maxLength}
        rows={rows}
        aria-invalid={Boolean(error)}
        className={`w-full resize-none rounded-sm border bg-paper px-3 py-2 text-ink placeholder:text-slate/60 focus:outline-none focus:ring-2 focus:ring-ink/40 ${
          error ? "border-danger" : "border-line"
        }`}
        {...props}
      />
    </FieldWrapper>
  );
}
