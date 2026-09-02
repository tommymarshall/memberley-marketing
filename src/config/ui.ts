// Shared class tokens for the marketing pages. The homepage, help page, and
// alternatives pages all render the same eyebrow, display heading, and button
// shapes; keeping them here means a tweak lands everywhere at once instead of
// drifting page by page.

export const eyebrow =
  "font-mono text-[0.625rem] font-semibold tracking-[0.14em] text-brand-800 uppercase";

export const eyebrowOnDark =
  "font-mono text-[0.625rem] font-semibold tracking-[0.14em] text-brand-300 uppercase";

export const display = "font-serif font-semibold tracking-tight";

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-[0.875rem] font-semibold transition hover:-translate-y-px motion-reduce:transform-none";

export const primaryButton = `${buttonBase} bg-stone-950 text-white shadow-btn hover:bg-stone-800`;

export const secondaryButton = `${buttonBase} border border-stone-950/14 bg-white/72 text-stone-800 shadow-[0_1px_0_rgb(255_255_255/.8)_inset] hover:border-stone-950/24 hover:bg-white`;

// Buttons that sit on the dark (stone-950) sections.
export const primaryButtonOnDark = `${buttonBase} bg-white text-stone-950 shadow-btn hover:bg-stone-100`;

export const secondaryButtonOnDark = `${buttonBase} border border-white/20 text-stone-100 hover:border-white/40 hover:bg-white/10`;
