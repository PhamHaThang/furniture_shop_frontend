import { forwardRef } from "react";
import { ChevronDown } from "lucide-react";

const Select = forwardRef(
  (
    {
      label,
      error,
      options = [],
      placeholder = "Chọn...",
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
        <div className="relative">
          <select
            ref={ref}
            className={`
              appearance-none w-full px-4 py-2.5 pr-10 rounded-lg border transition-all duration-200
              bg-white text-char-900
              focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500
              disabled:bg-beige-100 disabled:cursor-not-allowed
              ${
                error
                  ? "border-red-500 focus:ring-red-300 focus:border-red-500"
                  : "border-beige-300"
              }
              ${className}
            `}
            {...props}>
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={20}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-char-400 pointer-events-none"
          />
        </div>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
