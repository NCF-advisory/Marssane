/** Règle commune aux schémas SVG : voir le début au moment du défilement. */
export function observeSchemaVisibility(schema) {
  let restartOnEntry = true;
  schema.inView = false;
  schema.schedule();

  const observer = new IntersectionObserver(([entry]) => {
    const visible = entry.isIntersecting && entry.intersectionRatio >= 0.5;
    if (!entry.isIntersecting) restartOnEntry = true;

    if (visible && !schema.inView && restartOnEntry && schema.running && !schema.reduced.matches) {
      schema.seek(0);
      restartOnEntry = false;
    }
    schema.inView = visible;
    schema.schedule();
  }, {
    // Écarter le header fixe et attendre que le dessin soit suffisamment visible.
    rootMargin: "-100px 0px -5% 0px",
    threshold: [0, 0.5],
  });
  observer.observe(schema);
  return observer;
}
