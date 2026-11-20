import { initials } from '../../utils/format';

export default function Avatar({ name = 'Pengguna', url, size = 'md', className = '' }) {
  return (
    <span className={`avatar avatar--${size} ${className}`} title={name} aria-label={name}>
      {url ? <img src={url} alt={`Avatar ${name}`} loading="lazy" referrerPolicy="no-referrer" />
        : <span>{initials(name)}</span>}
    </span>
  );
}
