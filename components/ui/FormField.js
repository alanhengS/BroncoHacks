export function FormField({ label, htmlFor, children, hint }) {
  return (
    <div className="form-field">
      <label htmlFor={htmlFor}>{label}</label>
      {children}
      {hint && <small className="form-hint">{hint}</small>}
    </div>
  );
}
