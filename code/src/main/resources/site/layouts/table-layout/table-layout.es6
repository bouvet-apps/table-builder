const libs = {
  portal: require("/lib/xp/portal"),
  freemarker: require("/lib/tineikt/freemarker"),
  util: require("/lib/project-util")
};

exports.get = (req) => {
  const component = libs.portal.getComponent();
  const config = component.config;
  const mode = req?.mode;

  const model = {
    mainRegion: component.regions.main,
    paddingClass: libs.util.getPartPadding(config),
    heading: config.heading,
    headingStyle: config.headingStyle,
    subtitle: config.subtitle,
    mode
  };

  const accordionScript = `<script src="${libs.portal.assetUrl({ path: "js/main.js" })}"></script>`;

  const view = resolve("table-layout.ftl");
  const body = libs.freemarker.render(view, model);

  return {
    body,
    pageContributions: {
      headEnd: libs.util.getStylesheetContribution(),
      bodyEnd: [accordionScript]
    }
  };
};
