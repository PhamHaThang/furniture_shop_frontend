import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const Input = forwardRef(
  (
    {
      label,
      error,
      helperText,
      type = "text",
      leftIcon,
      rightIcon,
      fullWidth = true,
      className = "",
      containerClassName = "",
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";

    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className={`${fullWidth ? "w-full" : ""} ${containerClassName}`}>
        {label && (
          <label className="block text-sm font-medium text-char-700 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-char-400">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            type={inputType}
            className={`
              w-full px-4 py-2 rounded-lg border transition-all duration-200
              bg-white text-char-900 placeholder:text-char-400
              focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500
              disabled:bg-beige-100 disabled:cursor-not-allowed
              ${leftIcon ? "pl-10" : ""}
              ${rightIcon || isPassword ? "pr-10" : ""}
              ${
                error
                  ? "border-red-500 focus:ring-red-300 focus:border-red-500"
                  : "border-beige-300"
              }
              ${className}
            `}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-char-400 hover:text-char-600">
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}
          {rightIcon && !isPassword && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-char-400">
              {rightIcon}
            </span>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        {helperText && !error && (
          <p className="mt-1 text-sm text-char-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
