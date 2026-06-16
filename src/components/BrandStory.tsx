export default function BrandStory() {
  return (
    <section
      id="nosotros"
      className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 py-20 md:grid-cols-2"
    >
      <div className="flex flex-col gap-6 text-ink">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Nuestra historia
        </h2>
        <p className="text-lg leading-relaxed text-ink/80">
          Mantamar nace del encuentro entre el campo chileno y el oficio
          artesano. Tejemos ponchos de lana chilena con técnicas heredadas,
          en pequeños talleres del sur, donde cada pieza lleva el tiempo
          y las manos de quien la hace.
        </p>
        <p className="text-lg leading-relaxed text-ink/80">
          Creemos en una moda lenta, en los materiales nobles y en el
          valor de lo hecho a mano. Por eso cada poncho que sale de
          Mantamar es único: una prenda para usar muchos años, no una
          temporada.
        </p>
      </div>
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-cream-dark">
        <img
          src="/product_placeholder_2.svg"
          alt="Artesana tejiendo un poncho de lana chilena en su taller"
          className="h-full w-full object-cover"
        />
      </div>
    </section>
  );
}
