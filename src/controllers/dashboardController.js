const pool = require('../config/db');

const getDashboardSummary = async (req, res) => {
  try {

    const totalProducts = await pool.query(`
      SELECT COUNT(*) AS total_products
      FROM products
    `);

    const totalTransactions = await pool.query(`
  SELECT COUNT(*) AS total_transactions
  FROM inventory_transactions
  WHERE DATE(transaction_date) = CURRENT_DATE
`);

    const stockResult = await pool.query(`
      SELECT
        COALESCE(
          SUM(
            CASE
              WHEN transaction_type='IN'
              THEN quantity
              ELSE -quantity
            END
          ),
          0
        ) AS total_stock
      FROM inventory_transactions
    `);

    const lowStock = await pool.query(`
      SELECT COUNT(*) AS low_stock_count
      FROM (
        SELECT
          p.id,
          COALESCE(
            SUM(
              CASE
                WHEN t.transaction_type='IN'
                THEN t.quantity
                ELSE -t.quantity
              END
            ),
            0
          ) AS current_stock,
          p.min_stock

        FROM products p

        LEFT JOIN inventory_transactions t
        ON p.id=t.product_id

        GROUP BY p.id,p.min_stock

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
      ) x
    `);

    res.json({
      total_products:
        Number(totalProducts.rows[0].total_products),

      total_stock:
        Number(stockResult.rows[0].total_stock),

      low_stock_count:
        Number(lowStock.rows[0].low_stock_count),

      total_transactions:
        Number(totalTransactions.rows[0].total_transactions)
    });

  } catch(error) {

    console.error(error);

    res.status(500).json({
      message: 'Dashboard Error'
    });

  }
};
module.exports ={
  getDashboardSummary
};