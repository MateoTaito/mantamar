// @ts-nocheck
export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-coffee-dark/30"
    >
      <img
        src="/hero_placeholder.webp"
        alt="Poncho de lana chilena sobre fondo rural"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-ink/40" />
      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 text-center text-paper">
        <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
          Ponchos de lana chilena, tejidos a mano.
        </h1>
        <p className="max-w-xl text-lg leading-relaxed sm:text-xl">
          Prendas únicas hechas por artesanas y artesanos del sur de Chile.
          Tradición, oficio y materiales nobles.
        </p>
        <a
          href="#catalogo"
          className="mt-4 inline-flex items-center justify-center rounded-full bg-cream px-8 py-3 text-base font-semibold text-ink transition-colors hover:bg-coffee"
        >
          Ver catálogo
        </a>
      </div>
    </section>
  );
}
