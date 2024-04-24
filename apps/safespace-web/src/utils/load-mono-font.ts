const isBrowser = typeof window !== "undefined";

const robotomonoFont =
  isBrowser &&
  new FontFace("Roboto Mono", "url(/fonts/roboto-mono-regular.woff2)");

async function loadRobotoMonoFont() {
  if (!robotomonoFont) return;
  await robotomonoFont.load();
  document.fonts.add(robotomonoFont);
}

export { loadRobotoMonoFont, robotomonoFont };
