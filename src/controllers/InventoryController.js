const pool = require("../config/db");

// Stock In

const stockIn = async (req, res) => {

  try {
    console.log(req.body);

    const { product_id, quantity, remarks } = req.body;

    const product = await pool.query(
  `
  SELECT id
  FROM products
  WHERE id = $1
  `,
  [product_id]
);

console.log("Product query result:", product.rows);
console.log("Product ID received:", product_id);

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
        remarks
      )
      VALUES
      (
        $1,
        'IN',
        $2,
        $3
      )
      RETURNING *
      `,
      [product_id, quantity, remarks],
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
    const { product_id, quantity, remarks } = req.body;

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
        remarks
      )
      VALUES
      (
        $1,
        'OUT',
        $2,
        $3
      )
      RETURNING *
    `,
      [product_id, quantity, remarks],
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
        t.remarks,
        t.transaction_date

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

module.exports = {
  stockIn,
  stockOut,
  getInventorySummary,
  getTransactionHistory,
  getLowStockItems,
  getInventoryHistory,
};
