export function Card({ title, action, children, style }) {
  return (
    <section className="card" style={style}>
      {(title || action) && (
        <header className="card-header">
          {title && <h3 className="card-title">{title}</h3>}
          {action}
        </header>
      )}
      {children}
    </section>
  );
}
