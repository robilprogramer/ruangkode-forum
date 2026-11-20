import Icon from './Icon';

export function Spinner({ label = 'Memuat...' }) {
  return <span className="spinner" role="status" aria-label={label} />;
}

export function LoadingState({ label = 'Sedang memuat data...' }) {
  return <div className="status-view"><Spinner /><p>{label}</p></div>;
}

export function ErrorState({ message, onRetry }) {
  return <div className="status-view status-view--error">
    <div className="status-icon"><Icon name="info" size={28} /></div>
    <h3>Ups, ada kendala</h3>
    <p>{message || 'Terjadi kesalahan. Coba lagi nanti.'}</p>
    {onRetry && <button className="btn btn--primary" onClick={onRetry}>Coba lagi <Icon name="arrowRight" size={16} /></button>}
  </div>;
}

export function EmptyState({ title = 'Belum ada diskusi', description = 'Jadilah orang pertama yang memulai percakapan.', action }) {
  return <div className="status-view status-view--empty">
    <div className="status-icon"><Icon name="message" size={30} /></div>
    <h3>{title}</h3><p>{description}</p>{action}
  </div>;
}
