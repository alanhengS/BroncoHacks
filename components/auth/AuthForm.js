import { Card } from '../ui/Card';
import { Alert } from '../ui/Alert';
import { Button } from '../ui/Button';

export function AuthForm({ title, subtitle, error, success, onSubmit, submitting, submitLabel, footer, children }) {
  return (
    <div className="auth-shell">
      <div className="auth-heading">
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      <Card>
        <Alert kind="danger">{error}</Alert>
        <Alert kind="success">{success}</Alert>
        <form onSubmit={onSubmit} className="form-grid">
          {children}
          <Button type="submit" disabled={submitting} fullWidth>
            {submitting ? `${submitLabel}...` : submitLabel}
          </Button>
        </form>
      </Card>
      {footer && <div className="auth-footer">{footer}</div>}
    </div>
  );
}
