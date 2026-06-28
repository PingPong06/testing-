const pool = require("../config/db");

const ExcelJS = require("exceljs");

const exportActivityHistoryExcel = async (req, res) => {
  try {

    const result = await pool.query(`
  SELECT
    h.created_at,
    h.description,
    h.username,
    p.pipe_type,
    p.size
  FROM inventory_history h
  LEFT JOIN products p
  ON h.product_id = p.id
  ORDER BY h.created_at DESC
`);

    const workbook = new ExcelJS.Workbook();

    const worksheet =
      workbook.addWorksheet(
        "Activity History"
      );

    worksheet.columns = [
  {
    header: "Date",
    key: "date",
    width: 25,
  },
  {
    header: "Description",
    key: "description",
    width: 40,
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
    header: "Performed By",
    key: "username",
    width: 20,
  },
];

    const headerRow =
      worksheet.getRow(1);

    headerRow.eachCell((cell) => {

      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };

      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb: "4472C4",
        },
      };

      cell.font = {
        bold: true,
        color: {
          argb: "FFFFFF",
        },
      };

    });

    result.rows.forEach((row) => {

  const date = new Date(
    row.created_at
  ).toLocaleDateString("en-IN");

  worksheet.addRow({
    date,

    description: row.description,

    pipe_type: row.pipe_type || "-",

    size: row.size || "-",

    username: row.username || "-",
  });

});
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=activity-history.xlsx"
    );

    await workbook.xlsx.write(res);

    res.end();

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message:
        "Error generating Activity History Excel",
    });

  }
};

// Stock In

const stockIn = async (req, res) => {

  try {
    // console.log(req.body);

    const { product_id, quantity, remarks,performed_by, } = req.body;

    const product = await pool.query(
  `
  SELECT id
  FROM products
  WHERE id = $1
  `,
  [product_id]
);

// console.log("Product query result:", product.rows);
// console.log("Product ID received:", product_id);

if (product.rows.length === 0) {

  return res.status(404).json({
    message: `Product with ID ${product_id} not found`
  });

}

    const result = await pool.query(
  `
  INSERT INTO inventory_transactions
  (
    product_id,
    transaction_type,
    quantity,
    remarks,
    performed_by
  )
  VALUES
  (
    $1,
    'IN',
    $2,
    $3,
    $4
  )
  RETURNING *
  `,
  [
    product_id,
    quantity,
    remarks,
    performed_by,
  ]
);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Stock In Failed",
    });
  }
};

// Stock Out

const stockOut = async (req, res) => {
  try {
    const { product_id, quantity, remarks, performed_by, } = req.body;

    const stockResult = await pool.query(
      `
      SELECT
        COALESCE(
          SUM(
            CASE
              WHEN transaction_type = 'IN'
              THEN quantity
              ELSE -quantity
            END
          ),
          0
        ) AS current_stock
      FROM inventory_transactions
      WHERE product_id = $1
    `,
      [product_id],
    );

    const currentStock = Number(stockResult.rows[0].current_stock);

    if (currentStock < quantity) {
      return res.status(400).json({
        message: "Insufficient stock",
        available_stock: currentStock,
      });
    }

    const result = await pool.query(
      `
      INSERT INTO inventory_transactions
(
  product_id,
  transaction_type,
  quantity,
  remarks,
  performed_by
)
VALUES
(
  $1,
  'OUT',
  $2,
  $3,
  $4
)
RETURNING *
    `,
      [
  product_id,
  quantity,
  remarks,
  performed_by
],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Stock Out Failed",
    });
  }
};

// Inventory Summary

const getInventorySummary = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        p.id,
        p.brand,
        p.size,
        p.pipe_type,
        t.performed_by,

        COALESCE(
          SUM(
            CASE
              WHEN t.transaction_type = 'IN'
              THEN t.quantity
              ELSE -t.quantity
            END
          ),
          0
        ) AS current_stock

      FROM products p

      LEFT JOIN inventory_transactions t
      ON p.id = t.product_id

      GROUP BY
        p.id,
        p.brand,
        p.size,
        p.pipe_type

      ORDER BY p.id
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch inventory",
    });
  }
};

// Inventory History

const getTransactionHistory = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        t.id,
        p.brand,
        p.size,
        p.pipe_type,
        t.transaction_type,
        t.quantity,
        t.transaction_date,
        t.performed_by

      FROM inventory_transactions t

      JOIN products p
      ON p.id = t.product_id

      ORDER BY t.transaction_date DESC
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch history",
    });
  }

  // shows stocks which are below threshold
};

const getLowStockItems = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
          p.id,
          p.brand,
          p.size,
          p.pipe_type,
          p.min_stock,

          COALESCE(
              SUM(
                  CASE
                      WHEN t.transaction_type='IN'
                      THEN t.quantity
                      ELSE -t.quantity
                  END
              ),
              0
          ) AS current_stock

      FROM products p

      LEFT JOIN inventory_transactions t
      ON p.id=t.product_id

      GROUP BY
          p.id,
          p.brand,
          p.size,
          p.pipe_type,
          p.min_stock

      HAVING
          COALESCE(
              SUM(
                  CASE
                      WHEN t.transaction_type='IN'
                      THEN t.quantity
                      ELSE -t.quantity
                  END
              ),
              0
          ) < p.min_stock
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch low stock items",
    });
  }
};

const getInventoryHistory = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM inventory_history
      ORDER BY created_at DESC
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch inventory history",
    });
  }
};



const downloadTransactionExcel = async (req, res) => {
  try {

    const result = await pool.query(`
      SELECT
        p.brand,
        p.size,
        p.pipe_type,
        it.transaction_type,
        it.quantity,
        it.remarks,
        it.transaction_date
      FROM inventory_transactions it
      JOIN products p
      ON it.product_id = p.id
      ORDER BY it.transaction_date DESC
    `);

    const workbook = new ExcelJS.Workbook();

    const worksheet =
      workbook.addWorksheet(
        "Transaction History"
      );

    worksheet.columns = [
      {
        header: "Brand",
        key: "brand",
        width: 20,
      },
      {
        header: "Size (mm)",
        key: "size",
        width: 15,
      },
      {
        header: "Pipe Type",
        key: "pipe_type",
        width: 20,
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
        header: "Remarks",
        key: "remarks",
        width: 30,
      },
      {
        header: "Date",
        key: "transaction_date",
        width: 25,
      },
    ];

    result.rows.forEach((row) => {
      worksheet.addRow(row);
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=transaction_history.xlsx"
    );

    await workbook.xlsx.write(res);

    res.end();

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message:
        "Failed to download transaction history",
    });

  }
};

module.exports = {
  stockIn,
  stockOut,
  getInventorySummary,
  getTransactionHistory,
  getLowStockItems,
  getInventoryHistory,
  exportActivityHistoryExcel,
  downloadTransactionExcel,
};
