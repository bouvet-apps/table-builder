const libs = {
  palette: require("/lib/color-palette"),
  util: require("/lib/project-util")
};

// Hex values are validated by the palette, so they are safe to inline in the SVG.
const swatch = (color) => ({
  data: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><rect width="24" height="24" rx="4" fill="${color.background || "transparent"}" stroke="#c0c0c0"/>${color.text ? `<text x="12" y="17" font-size="14" text-anchor="middle" fill="${color.text}">A</text>` : ""}</svg>`,
  type: "image/svg+xml"
});

const toHit = (color) => ({
  id: color.key,
  displayName: color.label,
  description: [color.background, color.text].filter((value) => value).join(" / "),
  icon: swatch(color)
});

exports.get = (req) => {
  const params = req.params || {};
  // Content Studio sends a bare string for a single id, and an array for several.
  const ids = libs.util.forceArray(params.ids);
  const query = (params.query || "").toLowerCase();
  const palette = libs.palette.getPalette();

  // Already-selected values are requested by id and must be returned regardless of the search text.
  const matches = ids.length > 0 ? palette.filter((color) => ids.indexOf(color.key) !== -1) : palette.filter((color) => color.label.toLowerCase().indexOf(query) !== -1);

  const start = parseInt(params.start) || 0;
  const count = parseInt(params.count) || matches.length;
  const page = matches.slice(start, start + count);

  return {
    contentType: "application/json",
    body: {
      total: matches.length,
      count: page.length,
      hits: page.map(toHit)
    }
  };
};
