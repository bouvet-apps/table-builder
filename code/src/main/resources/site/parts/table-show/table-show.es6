const libs = {
  portal: require("/lib/xp/portal"),
  content: require("/lib/xp/content"),
  freemarker: require("/lib/tineikt/freemarker"),
  palette: require("/lib/color-palette"),
  util: require("/lib/project-util")
};

exports.get = () => {
  const component = libs.portal.getComponent();
  const config = component?.config || {};

  const tableNode = config?.tableToPreview ? libs.content.get({ key: config.tableToPreview }) : libs.portal.getContent();
  const tableRows = libs.util.forceArray(tableNode?.data?.rows);

  const palette = libs.palette.getPalette();
  const fillStyle = (key) => libs.palette.fillStyle(libs.palette.resolveColor(key, palette));

  const rows = tableRows.map((row) => {
    const rowColorValue = row?.rowColor || null;

    const cells = libs.util.forceArray(row?.cells).map((cell) => {
      const cellValue = cell?.cellValue ? libs.portal.processHtml({ value: cell.cellValue }).trim() : "";
      const cellColorValue = cell?.cellColor || null;
      const colorName = cellColorValue || rowColorValue || "";

      return {
        value: /^[-+ ]*\d+[.,/ \d]*?$/.test(cellValue) ? `<p style="text-align:right">${cellValue}</p>` : cellValue, // Number/date types always right aligned (unless style has been adjusted already)
        style: fillStyle(colorName)
      };
    });

    return {
      cells,
      style: fillStyle(rowColorValue)
    };
  });

  const model = {
    paddingClass: libs.util.getPartPadding(config),
    title: {
      text: tableNode?.data?.title?.text ?? "",
      type: tableNode?.data?.title?.type ?? "h3",
      style: fillStyle(tableNode?.data?.title?.color ?? "black")
    },
    preface: {
      text: tableNode?.data?.preface?.text ?? "",
      style: fillStyle(tableNode?.data?.preface?.color ?? "black")
    },
    footnotes: {
      text: tableNode?.data?.footnotes?.text ? libs.portal.processHtml({ value: tableNode?.data?.footnotes?.text }) : "",
      style: fillStyle(tableNode?.data?.footnotes?.color ?? "white")
    },
    rows
  };

  const view = resolve("table-show.ftl");
  const body = libs.freemarker.render(view, model);

  return {
    body,
    pageContributions: {
      headEnd: libs.util.getStylesheetContribution()
    }
  };
};
