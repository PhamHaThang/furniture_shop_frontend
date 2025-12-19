import { forwardRef } from "react";

const Textarea = forwardRef(
  (
    {
      label,
      error,
      helperText,
      rows = 4,
      fullWidth = true,
      className = "",
      containerClassName = "",
      ...props
    },
    ref
  ) => {
    return (
      <div className={`${fullWidth ? "w-full" : ""} ${containerClassName}`}>
        {label && (
          <label className="block text-sm font-medium text-char-700 mb-1">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          rows={rows}
          className={`
            w-full px-4 py-2.5 rounded-lg border transition-all duration-200 resize-none
            bg-white text-char-900 placeholder:text-char-400
            focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500
            disabled:bg-beige-100 disabled:cursor-not-allowed
            ${
              error
                ? "border-red-500 focus:ring-red-300 focus:border-red-500"
                : "border-beige-300"
            }
            ${className}
          `}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        {helperText && !error && (
          <p className="mt-1 text-sm text-char-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;
