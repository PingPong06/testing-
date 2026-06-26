const pool = require("../config/db");
const PDFDocument = require("pdfkit");
const path = require("path");

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
  p.unit_price,
  p.weight_per_unit,
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

    const logoPath = path.join(
  process.cwd(),
  "client",
  "src",
  "assets",
  "esscon-logo.png"
);

console.log(logoPath);

    doc.image(logoPath, 30, 30, {
      width: 140,
    });

    const fontPath = path.join(__dirname, "../../fonts/NotoSans-Regular.ttf");

    doc.registerFont("NotoSans", fontPath);

    res.setHeader("Content-Type", "application/pdf");

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=inventory-report.pdf",
    );

    doc.pipe(res);

    /* REPORT TITLE */

    doc.moveDown(2);

    doc
      .fontSize(20)
      .font("Helvetica-Bold")
      .text("PVC Inventory Report", 0, 60, {
        align: "center",
      });

    doc.moveDown(2);

    

    /* REPORT SUMMARY */

    doc.fontSize(12).font("Helvetica");

  doc.text(
  `Generated On: ${new Date().toLocaleString("en-IN")}`,
  60
);

doc.text(
  `Total Transactions: ${result.rows.length}`,
  60
);

    doc.moveDown();

    /* ACTIVE FILTERS */

    if (brand) doc.text(`Brand: ${brand}`);

    if (pipeType) doc.text(`Pipe Type: ${pipeType}`);

    if (size) doc.text(`Size (mm): ${size}`);

    if (transactionType) doc.text(`Transaction Type: ${transactionType}`);

    if (fromDate) doc.text(`From Date: ${fromDate}`);

    if (toDate) doc.text(`To Date: ${toDate}`);

    doc.moveDown();

    /* TABLE */

    doc.font("Helvetica-Bold").fontSize(10);

    let y = doc.y;

    const columns = {
      date: 40,
      brand: 180,
      type: 300,
      size: 420,
      txn: 500,
      qty: 580,
      price: 640,
      weight: 710,
      user: 790,
    };

    // doc.rect(35, y - 5, 820, 22)
    //    .fill("#F3F4F6");

    // doc.fillColor("black");

    doc.text("Date", 20, y, {
      width: 120,
      align: "center",
    });

    doc.text("Brand", 140, y, {
      width: 120,
      align: "center",
    });

    doc.text("Type", 220, y, {
      width: 120,
      align: "center",
    });

    doc.text("Size(mm)", 320, y, {
      width: 80,
      align: "center",
    });

    doc.text("Txn", 370, y, {
      width: 100,
      align: "center",
    });

    doc.text("Qty", 450, y, {
      width: 60,
      align: "center",
    });

    doc.text("Price/Unit", 500, y, {
      width: 80,
      align: "center",
    });

    doc.text("Weight/unit", 570, y, {
      width: 100,
      align: "center",
    });

    doc.text("User", 650, y, {
      width: 80,
      align: "center",
    });
    // doc.text("Remarks", 540, y);

    y += 20;

    const startX = 50;
    const endX = 720;

    doc.moveTo(startX, y).lineTo(endX, y).stroke();

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
        width: 120,
        align: "center",
      });

      doc.text(String(row.brand), 140, y, {
        width: 120,
        align: "center",
      });

      doc.text(String(row.pipe_type), 220, y, {
        width: 120,
        align: "center",
      });

      doc.text(String(row.size), 320, y, {
        width: 80,
        align: "center",
      });

      doc.text(
        row.transaction_type === "IN" ? "Stock In" : "Stock Out",
        370,
        y,
        {
          width: 100,
          align: "center",
        },
      );

      doc.text(String(row.quantity), 450, y, {
        width: 60,
        align: "center",
      });

      doc.text(`Rs. ${row.unit_price}`, 500, y, {
        width: 80,
        align: "center",
      });

      doc.text(`${row.weight_per_unit} kg`, 570, y, {
        width: 100,
        align: "center",
      });

      doc.text(String(row.performed_by || "-"), 650, y, {
        width: 80,
        align: "center",
      });

      // doc.text(String(row.remarks || "-"), 540, y, { width: 50 });

      y += 20;
    });

    const footerY = doc.page.height - 50;

   const margin = 40;

doc.moveTo(
  margin,
  footerY - 10
)
.lineTo(
  doc.page.width - margin,
  footerY - 10
)
.stroke();

    

    doc.fontSize(9).fillColor("gray");

    doc.text("Esscon Pipes & Fittings", 40, footerY);

    doc.text("Address: Plot No. B-242, MIDC, Malegaon, Sinnar, Dist. Nashik- 422103, Maharashtra, India.", 160, footerY);

    doc.text("Email: pb.esscon@gmail.com", 550, footerY);

    doc.text(
  `Page ${doc.bufferedPageRange().start + 1}`,
  725,
  footerY,
  {
    // align: "right",
    width: 50,
  }
);
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
        header: "Size (in mm)",
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
      { header: "Weight/Unit (kg)", key: "weight_per_unit", width: 18 },

      { header: "Unit Price (₹)", key: "unit_price", width: 18 },

      {
        header: "Performed By",
        key: "performed_by",
        width: 20,
      },
      // {
      //   header: "Remarks",
      //   key: "remarks",
      //   width: 30,
      // },
    ];

    worksheet.getColumn("quantity").alignment = {
      horizontal: "left",
    };

    const headerRow = worksheet.getRow(1);

    headerRow.eachCell((cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    headerRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "4472C4" },
      };

      cell.font = {
        bold: true,
        color: { argb: "FFFFFF" },
      };
    });

    result.rows.forEach((row) => {
      const date = new Date(row.transaction_date).toLocaleDateString("en-IN");

      worksheet.addRow({
        date,
        brand: row.brand,
        pipe_type: row.pipe_type,
        size: row.size,
        transaction_type: row.transaction_type,
        quantity: row.quantity,
        weight_per_unit: row.weight_per_unit,

        unit_price: row.unit_price,

        performed_by: row.performed_by || "-",
        // remarks: row.remarks || "-",
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
