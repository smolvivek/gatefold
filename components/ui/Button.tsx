import { type ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "tertiary";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-pop text-background hover:bg-pop-hover active:scale-[0.98] led-pulse-subtle disabled:opacity-50 disabled:cursor-not-allowed",
  secondary:
    "bg-transparent border border-border text-text-primary hover:border-pop active:bg-transparent disabled:text-text-disabled disabled:border-border disabled:cursor-not-allowed",
  tertiary:
    "bg-transparent text-link hover:underline active:text-pop disabled:text-text-disabled disabled:no-underline disabled:cursor-not-allowed",
};

const sizeStyles: Record<ButtonVariant, string> = {
  primary: "px-[32px] py-[16px] font-heading text-[14px] font-bold uppercase tracking-tighter",
  secondary: "px-[32px] py-[16px] font-heading text-[14px] font-bold uppercase tracking-tighter",
  tertiary: "px-[16px] py-[8px] text-[14px] font-medium",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className = "", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`
          inline-flex items-center justify-center
          rounded-none leading-[20px]
          transition-all duration-[200ms] ease-out
          transform-gpu
          cursor-pointer
          disabled:cursor-not-allowed
          ${variantStyles[variant]}
          ${sizeStyles[variant]}
          ${className}
        `}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
export type { ButtonProps, ButtonVariant };
