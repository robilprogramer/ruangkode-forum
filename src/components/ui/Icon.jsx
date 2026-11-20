const graphics = {
  code: <><path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 4l-4 16" /></>,
  arrowRight: <><path d="M5 12h14m-7-7 7 7-7 7" /></>,
  arrowLeft: <><path d="m12 19-7-7 7-7M5 12h14" /></>,
  plus: <><path d="M12 5v14M5 12h14" /></>,
  search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4" /></>,
  message: <><path d="M20 11.5a8 8 0 0 1-8 8c-1.5 0-3-.4-4.2-1.2L4 20l1.7-3.8A8 8 0 1 1 20 11.5Z" /></>,
  thumbsUp: <><path d="M7 10v11H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3ZM7 10l5-8a3 3 0 0 1 2 3v5h5a3 3 0 0 1 2.9 3.7l-1.6 5A3 3 0 0 1 17.5 21H7" /></>,
  thumbsDown: <><path d="M17 14V3h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3ZM17 14l-5 8a3 3 0 0 1-2-3v-5H5a3 3 0 0 1-2.9-3.7l1.6-5A3 3 0 0 1 6.5 3H17" /></>,
  trophy: <><path d="M8 21h8m-4-4v4M7 3h10v6a5 5 0 0 1-10 0V3ZM7 5H4v3a4 4 0 0 0 4 4m9-7h3v3a4 4 0 0 1-4 4" /></>,
  logout: <><path d="M10 17l5-5-5-5m5 5H3M12 3h6a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3h-6" /></>,
  user: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0" /></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2" /></>,
  sparkles: <><path d="m12 3 2.3 6.7L21 12l-6.7 2.3L12 21l-2.3-6.7L3 12l6.7-2.3L12 3ZM19 3v4M17 5h4" /></>,
  chevronDown: <><path d="m6 9 6 6 6-6" /></>,
  check: <><path d="m5 12 4 4L19 6" /></>,
  send: <><path d="m22 2-7 20-4-9-9-4 20-7ZM11 13 22 2" /></>,
  shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4" /></>,
  fire: <><path d="M12 22a8 8 0 0 0 8-8c0-4-3-7-5-9-.5 3-2 4-3 5 0-4-2-6-4-8 0 4-4 7-4 12a8 8 0 0 0 8 8ZM12 22c-2 0-4-2-4-4s2-3 3-5c0 2 1 3 2 4 1-1 1-2 1-3 2 2 2 3 2 4a4 4 0 0 1-4 4Z" /></>,
  menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
  x: <><path d="M5 5l14 14M19 5 5 19" /></>,
  info: <><circle cx="12" cy="12" r="9"/><path d="M12 11v5m0-8h.01" /></>,
  pencil: <><path d="m4 20 4.5-1 11-11a2.2 2.2 0 0 0-3.1-3.1l-11 11L4 20ZM14 6l4 4" /></>,
  users: <><circle cx="9" cy="8" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2M17 11a3 3 0 1 0 0-6m2 15v-2a6 6 0 0 0-3-5" /></>,
  grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
  external: <><path d="M13 5h6v6m0-6L9 15M19 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5" /></>,
  lock: <><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4" /></>,
};

export default function Icon({ name, size = 20, className = '', ...props }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true" {...props}>
      {graphics[name] || graphics.info}
    </svg>
  );
}
