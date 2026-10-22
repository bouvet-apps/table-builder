const libs = {
  i18n: require("/lib/xp/i18n"),
  portal: require("/lib/xp/portal"),
  util: require("/lib/project-util")
};

// 4 and 8 digit forms carry an alpha channel.
const HEX = /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

// Always offered, regardless of site config. Trusted constants, so not hex-validated.
const DEFAULT_COLORS = [
  { key: "black", i18nKey: "table.color.black", background: "#111111", text: "#ffffff" },
  { key: "white", i18nKey: "table.color.white", background: "#ffffff", text: "#111111" },
  { key: "transparent", i18nKey: "table.color.transparent", background: "transparent", text: "inherit" }
];

// Used when a stored colour key no longer exists in the palette, or a hex value fails validation.
// Empty values make the renderer omit the style attribute entirely, falling back to the stylesheet.
const FALLBACK = {
  key: "",
  label: "",
  background: "",
  text: ""
};

// Values reach a style attribute, so anything that is not a plain hex literal is discarded.
const safeHex = (value, fallback) => {
  const candidate = String(value || "").trim();
  return HEX.test(candidate) ? candidate : fallback;
};

const toColor = (entry) => ({
  key: String(entry.key).trim(),
  label: String(entry.label || entry.key).trim(),
  background: safeHex(entry.background, FALLBACK.background),
  text: safeHex(entry.text, FALLBACK.text)
});

const builtInColors = () => DEFAULT_COLORS.map((color) => ({
  key: color.key,
  label: libs.i18n.localize({ key: color.i18nKey }),
  background: color.background,
  text: color.text
}));

const getPalette = () => {
  const builtIn = builtInColors();
  const reserved = DEFAULT_COLORS.map((color) => color.key);

  const configured = libs.util
    .forceArray(libs.portal.getSiteConfig()?.colors)
    .filter((entry) => entry?.key && reserved.indexOf(String(entry.key).trim()) === -1)
    .map(toColor);

  return builtIn.concat(configured);
};

const resolveColor = (key, palette) => {
  if (!key) {
    return FALLBACK;
  }

  const colors = palette || getPalette();
  return colors.filter((color) => color.key === key)[0] || FALLBACK;
};

// Inline style strings. Values are already hex-validated by getPalette, so they are safe in a style attribute.
const fillStyle = (color) => `${color.background ? `background-color:${color.background};` : ""}${color.text ? `color:${color.text};` : ""}`;

module.exports = {
  FALLBACK,
  fillStyle,
  getPalette,
  resolveColor
};
