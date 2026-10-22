const libs = {
  event: require("/lib/xp/event"),
  content: require("/lib/xp/content"),
  context: require("/lib/xp/context"),
  tableContent: require("/lib/table-content"),
  util: require("/lib/project-util")
};

function generateTable(event) {
  event.data.nodes
    .filter((node) => node.repo.indexOf("com.enonic.cms.") === 0)
    .forEach((node) => {
      libs.context.run({
        repository: node.repo,
        branch: "draft",
        principals: ["role:system.admin"]
      }, () => {
        if ((/unnamed/gmi).test(node.path)) {
          // Race condition, i dont know...
        } else {
          const content = libs.content.get({ key: node.id });

          if (content && (content.type === `${app.name}:table` && content?.data?.excelData)) {

            const currentRows = libs.util.forceArray(content.data?.rows);

            // Only generate table when currentRows is 0
            // So manual edits in Content Studio are not overwritten on save.
            if (currentRows.length === 0) {
              const rows = libs.tableContent.getRowsFromExcelData(content.data?.excelData || "");
              if (libs.tableContent.rowsChanged(currentRows, rows)) {
                libs.content.modify({
                  key: content._id,
                  requireValid: false,
                  editor: (c) => {
                    const _c = c;
                    _c.data.excelData = "";
                    _c.data.rows = rows;
                    return _c;
                  }
                });
              }
            } else {
              libs.content.modify({
                key: content._id,
                requireValid: false,
                editor: (c) => {
                  const _c = c;
                  _c.data.excelData = "";
                  return _c;
                }
              });
            }
          }
        }
      });
    });
}

libs.event.listener({
  type: "node.updated",
  localOnly: false,
  callback: generateTable
});
