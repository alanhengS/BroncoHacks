export function Card({ title, action, children, style, className = '' }) {
  const classes = ['card', className].filter(Boolean).join(' ');

  return (
    <section className={classes} style={style}>
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
