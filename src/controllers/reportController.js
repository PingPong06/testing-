const pool = require("../config/db");
const PDFDocument = require("pdfkit");

const ExcelJS = require("exceljs");

const buildReportQuery = (filters) => {
  // console.log(response.data);
  const {
    brand,
    pipeType,
    size,
    transactionType,
    fromDate,
    toDate,
    sortBy,
    order,
  } = filters;

  let query = `
    SELECT
      t.id,
      p.brand,
      p.pipe_type,
      p.size,
      t.transaction_type,
      t.quantity,
      t.remarks,
      t.performed_by,
      t.transaction_date

    FROM inventory_transactions t

    JOIN products p
    ON p.id = t.product_id

    WHERE 1=1
  `;

  const values = [];

  if (brand) {
    values.push(brand);

    query += `
      AND p.brand = $${values.length}
    `;
  }

  if (pipeType) {
    values.push(pipeType);

    query += `
      AND p.pipe_type = $${values.length}
    `;
  }

  if (size) {
    values.push(size);

    query += `
      AND p.size = $${values.length}
    `;
  }

  if (transactionType && transactionType !== "ALL") {
    values.push(transactionType);

    query += `
      AND t.transaction_type = $${values.length}
    `;
  }

  if (fromDate) {
    values.push(fromDate);

    query += `
      AND DATE(t.transaction_date)
      >= $${values.length}
    `;
  }

  if (toDate) {
    values.push(toDate);

    query += `
      AND DATE(t.transaction_date)
      <= $${values.length}
    `;
  }

  const allowedColumns = {
    date: "t.transaction_date",
    brand: "p.brand",
    pipe_type: "p.pipe_type",
    size: "p.size",
    quantity: "t.quantity",
  };

  const sortColumn = allowedColumns[sortBy] || "t.transaction_date";

  const sortDirection = order === "ASC" ? "ASC" : "DESC";

  query += `
    ORDER BY
    ${sortColumn}
    ${sortDirection}
  `;

  return {
    query,
    values,
  };
};

const getReportData = async (req, res) => {
  try {
    const { query, values } = buildReportQuery(req.query);

    const result = await pool.query(query, values);

    res.json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const downloadReportPDF = async (req, res) => {
  try {
    // console.log(req.query);
    const { query, values } = buildReportQuery(req.query);

    const result = await pool.query(query, values);

    const { brand, pipeType, size, transactionType, fromDate, toDate } =
      req.query;

    const doc = new PDFDocument({
      margin: 30,
      layout: "landscape",
    });

    res.setHeader("Content-Type", "application/pdf");

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=inventory-report.pdf",
    );

    doc.pipe(res);

    /* REPORT TITLE */

    doc.fontSize(20).font("Helvetica-Bold").text("PVC Inventory Report", {
      align: "center",
    });

    doc.moveDown();

    /* REPORT SUMMARY */

    doc.fontSize(12).font("Helvetica");

    doc.text(`Generated On: ${new Date().toLocaleString("en-IN")}`);

    doc.text(`Total Transactions: ${result.rows.length}`);

    doc.moveDown();

    /* ACTIVE FILTERS */

    if (brand) doc.text(`Brand: ${brand}`);

    if (pipeType) doc.text(`Pipe Type: ${pipeType}`);

    if (size) doc.text(`Size: ${size}`);

    if (transactionType) doc.text(`Transaction Type: ${transactionType}`);

    if (fromDate) doc.text(`From Date: ${fromDate}`);

    if (toDate) doc.text(`To Date: ${toDate}`);

    doc.moveDown();

    /* TABLE */

    doc.font("Helvetica-Bold").fontSize(10);

    let y = doc.y;

    doc.text("Date", 40, y);
    doc.text("Brand", 150, y);
    doc.text("Type", 240, y);
    doc.text("Size", 330, y);
    doc.text("Txn", 390, y);
    doc.text("Qty", 450, y);
    doc.text("User", 490, y);
    doc.text("Remarks", 540, y);

    y += 20;

    doc.moveTo(40, y).lineTo(580, y).stroke();

    y = doc.y + 20;

    result.rows.forEach((row) => {
      const date = new Date(row.transaction_date).toLocaleString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      doc.font("Helvetica").fontSize(9);

      doc.text(date, 40, y, {
        width: 100,
      });

      doc.text(String(row.brand), 150, y, { width: 80 });

      doc.text(String(row.pipe_type), 240, y, { width: 80 });

      doc.text(String(row.size), 330, y, { width: 50 });

      doc.text(
        row.transaction_type === "IN" ? "Stock In" : "Stock Out",
        390,
        y,
        { width: 60 },
      );

      doc.text(String(row.quantity), 450, y, { width: 35 });

      doc.text(String(row.performed_by || "-"), 490, y, { width: 45 });

      doc.text(String(row.remarks || "-"), 540, y, { width: 50 });

      y += 20;
    });
    doc.end();
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error generating PDF",
    });
  }
};

const downloadReportExcel = async (req, res) => {
  try {
    const { query, values } = buildReportQuery(req.query);

    const result = await pool.query(query, values);

    const workbook = new ExcelJS.Workbook();

    const worksheet = workbook.addWorksheet("Transactions");

    worksheet.columns = [
      {
        header: "Date",
        key: "date",
        width: 25,
      },
      {
        header: "Brand",
        key: "brand",
        width: 20,
      },
      {
        header: "Pipe Type",
        key: "pipe_type",
        width: 20,
      },
      {
        header: "Size",
        key: "size",
        width: 15,
      },
      {
        header: "Transaction Type",
        key: "transaction_type",
        width: 20,
      },
      {
        header: "Quantity",
        key: "quantity",
        width: 15,
      },
      {
        header: "Performed By",
        key: "performed_by",
        width: 20,
      },
      {
        header: "Remarks",
        key: "remarks",
        width: 30,
      },
    ];

    result.rows.forEach((row) => {
      const date = new Date(row.transaction_date).toLocaleDateString("en-IN");

      worksheet.addRow({
        date,
        brand: row.brand,
        pipe_type: row.pipe_type,
        size: row.size,
        transaction_type: row.transaction_type,
        quantity: row.quantity,
        performed_by: row.performed_by || "-",
        remarks: row.remarks || "-",
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=inventory-report.xlsx",
    );

    await workbook.xlsx.write(res);

    res.end();
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error generating Excel",
    });
  }
};

module.exports = {
  getReportData,
  downloadReportPDF,
  downloadReportExcel,
};
