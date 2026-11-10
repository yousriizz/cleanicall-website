type IconName = 'whatsapp' | 'bolt' | 'leaf' | 'shield' | 'chevron';
export function Icon({ name, className }: { name: IconName; className?: string }) {
  const paths: Record<IconName, React.ReactNode> = {
    whatsapp: <><path d="M20.5 11.7a8.5 8.5 0 0 1-12.6 7.5L3 20.5l1.3-4.8A8.5 8.5 0 1 1 20.5 11.7Z" /><path d="M8.2 7.5c-.5 0-1 1-1 1.7 0 2.5 3.7 6.2 6.3 6.2.8 0 1.7-.5 1.8-1.1l-2.1-1.2-.9.8a7.4 7.4 0 0 1-3.1-3.1l.8-.9-1.1-2.4Z" /></>,
    bolt: <path d="m13 2-9 12h7l-1 8 10-13h-7l1-7Z" />,
    leaf: <><path d="M20 3C8 3 3 7 5 14c2 7 14 6 15-11Z" /><path d="M3 21 16 8" /></>,
    shield: <><path d="m12 2 8 4v6c0 5-8 10-8 10S4 17 4 12V6l8-4Z" /><path d="m8 11 3 3 5-5" /></>,
    chevron: <path d="m6 9 6 6 6-6" />,
  };
  return <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}
