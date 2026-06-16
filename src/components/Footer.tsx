const SOCIAL_LINKS = [
  { name: 'Instagram', href: '#' },
  { name: 'Facebook', href: '#' },
  { name: 'WhatsApp', href: '#' },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-ink text-paper py-12 px-6">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 md:grid-cols-3">
        <div>
          <h3 className="font-serif text-2xl font-bold tracking-tight">Mantamar</h3>
          <p className="mt-2 text-sm text-paper/70">
            Ponchos y prendas de lana chilena, tejidos a mano.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest text-paper/60">
            Contacto
          </h4>
          <ul className="mt-3 space-y-1 text-sm">
            <li>
              <a href="mailto:contacto@mantamar.cl" className="hover:text-coffee">
                contacto@mantamar.cl
              </a>
            </li>
            <li>
              <a href="tel:+56912345678" className="hover:text-coffee">
                +56 9 1234 5678
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest text-paper/60">
            Síguenos
          </h4>
          <ul className="mt-3 flex gap-4 text-sm">
            {SOCIAL_LINKS.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className="rounded-full border border-paper/30 px-3 py-1 transition-colors hover:border-coffee hover:text-coffee"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-6xl border-t border-paper/10 pt-6 text-center text-xs text-paper/60">
        © {year} Mantamar. Todos los derechos reservados.
      </div>
    </footer>
  );
}
