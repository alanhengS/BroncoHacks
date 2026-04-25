export function Alert({ kind = 'danger', children }) {
  if (!children) return null;
  return <div className={`alert alert-${kind}`}>{children}</div>;
}
