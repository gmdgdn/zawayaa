'use client';

export default function DevNavigation() {
  const links = [
    { href: '/ar', label: 'Arabic Homepage' },
    { href: '/ar/programs', label: 'Programs' },
    { href: '/api/test-env', label: 'Test Environment' },
    { href: '/api/programs', label: 'Programs API' },
  ];

  return (
    <div className="fixed top-4 right-4 bg-white shadow-lg rounded-lg p-4 z-50 max-w-xs">
      <h3 className="font-bold text-sm mb-2">Dev Navigation</h3>
      <div className="space-y-1">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-xs text-blue-600 hover:underline"
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}