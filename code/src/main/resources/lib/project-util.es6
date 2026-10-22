const portal = require("/lib/xp/portal");

// Forces object into an array if object is not already an array
exports.forceArray = (object) => {
  if (!object) {
    return [];
  }

  if (!Array.isArray(object)) {
    return [object];
  }

  return object;
};

exports.getPartPadding = (config) => {
  let paddingClass = "";
  if (config.paddingTop && config.paddingTop === true) {
    paddingClass += " hasPaddingTop";
  }
  if (config.paddingBottom && config.paddingBottom === true) {
    paddingClass += " hasPaddingBottom";
  }
  return paddingClass;
};

// headEnd contribution for the app's own CSS. Sites that style the markup themselves opt out in site config;
// config saved before the option existed is undefined and keeps the default styling.
exports.getStylesheetContribution = () => {
  if (portal.getSiteConfig()?.styling === "none") {
    return [];
  }

  const href = portal.assetUrl({ path: "css/main.css" });
  return [`<link rel="preload" href="${href}" as="style"><link rel="stylesheet" href="${href}">`];
};
