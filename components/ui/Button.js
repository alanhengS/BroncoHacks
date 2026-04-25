export function Button({
  children,
  variant = 'primary',
  type = 'button',
  disabled,
  onClick,
  fullWidth,
  style,
}) {
  const className = `btn btn-${variant}`;
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={className}
      style={{ width: fullWidth ? '100%' : undefined, ...style }}
    >
      {children}
    </button>
  );
}
