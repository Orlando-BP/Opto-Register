import React from "react";

type ButtonProps = {
    label?: string;
    onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    className?: string;
    fullWidth?: boolean;
    ariaLabel?: string;
};

export default function Button({
    label,
    onClick,
    type = "button",
    disabled = false,
    className,
    fullWidth = false,
    ariaLabel,
}: ButtonProps) {
    const baseClasses =
        "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed";
    const variantClasses =
        "bg-sky-600 text-white hover:bg-sky-700 active:bg-sky-800";
    const widthClasses = fullWidth ? "w-full" : "";

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            aria-label={ariaLabel || label}
            className={`${baseClasses} ${variantClasses} ${widthClasses} ${className ?? ""}`}
        >
            {label}
        </button>
    );
}
