const buildRowsFromExcelData = (excelData = "") => excelData
  .split("\n")
  .filter((rowText) => rowText.trim() !== "")
  .map((rowText) => ({
    cells: rowText.split("\t").map((cellText) => {
      const cellValue = cellText.trim();

      return {
        cellValue: /^[-+ ]*\d+[.,/ \d]*?$/.test(cellValue) ? `<p style="text-align:right">${cellValue}</p>` : cellValue, // Number/date types always right aligned
        cellColor: null
      };
    }),
    rowColor: null
  }));

exports.getRowsFromExcelData = (excelData = "") => buildRowsFromExcelData(excelData);

exports.rowsChanged = (existingRows, newRows) => JSON.stringify(existingRows || []) !== JSON.stringify(newRows || []);
