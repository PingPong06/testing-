const pool = require("../config/db");

// Create Products

const createProduct = async (req, res) => {
  try {
    // console.log(req.body);
    const { brand, size, pipe_type, min_stock, unit_price, weight_per_unit} = req.body;
    const brandValue = brand.trim().toLowerCase();

    const pipeTypeValue = pipe_type.trim().toLowerCase();

    if (
      !brand ||
      !size ||
      !pipe_type ||
      min_stock === "" ||
      unit_price === ""
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const result = await pool.query(
      `
  INSERT INTO products
  (
    brand,
    size,
    pipe_type,
    min_stock,
    unit_price,
    weight_per_unit
  )
  VALUES ($1,$2,$3,$4,$5,$6)
  RETURNING *
  `,
      [brandValue, size, pipeTypeValue, Number(min_stock), Number(unit_price), Number(weight_per_unit)],
    );
    await pool.query(
      `
  INSERT INTO inventory_history
  (
      product_id,
      action,
      description,
      username
  )
  VALUES
  (
      $1,
      $2,
      $3,
      $4
  )
  `,
      [result.rows[0].id, "CREATE", `Created ${brand}`,req.user.username],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).json({
        message: "Product already exists",
      });
    }

    console.error(error);

    res.status(500).json({
      message: "Error creating product",
    });
  }
};

// Get all products

const getAllProducts = async (req, res) => {
  try {
    // console.log("GET ALL PRODUCTS HIT");

    const { search } = req.query;

    let query = `
      SELECT
        p.id,
        p.brand,
        p.size,
        p.pipe_type,
        p.min_stock,
        p.weight_per_unit,
        p.unit_price,

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
    `;

    let values = [];

    if (search) {
      query += `
        WHERE
        LOWER(p.brand) LIKE LOWER($1)
        OR LOWER(p.size) LIKE LOWER($1)
        OR LOWER(p.pipe_type) LIKE LOWER($1)
      `;

      values.push(`%${search}%`);
    }

    query += `
      GROUP BY
        p.id,
        p.brand,
        p.size,
        p.pipe_type,
        p.unit,
        p.min_stock,
        p.weight_per_unit,
        p.unit_price

      ORDER BY p.id
    `;

    const result = await pool.query(query, values);

    const products = result.rows;

    // console.log(req.user);
    // console.log(req.user.role);

    if (req.user.role !== "ADMIN") {
      products.forEach((product) => {
        delete product.unit_price;
      });
    }

    res.json(products);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// Get product by id

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT *
      FROM products
      WHERE id = $1
      `,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error fetching product",
    });
  }
};

//Update Product

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const { brand, size, pipe_type, min_stock, unit_price, weight_per_unit } = req.body;

    const brandValue = brand.trim().toLowerCase();

    const pipeTypeValue = pipe_type.trim().toLowerCase();

    const result = await pool.query(
      `
      UPDATE products
      SET
        brand = $1,
        size = $2,
        pipe_type = $3,
        min_stock = $4,
        unit_price = $5,
        weight_per_unit = $6
      WHERE id = $7
      RETURNING *
      `,
      [brandValue, size, pipeTypeValue, min_stock, unit_price, weight_per_unit, id],
    );

    await pool.query(
      `
INSERT INTO inventory_history
(
    product_id,
    action,
    description,
    username
)
VALUES
(
    $1,
    $2,
    $3,
    $4
)
`,
      [id, "UPDATE", `Updated ${brandValue}`,req.user.username],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error updating product",
    });
  }
};

// Delete Product

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Get product details before deleting
    const existingProduct = await pool.query(
      `
      SELECT *
      FROM products
      WHERE id = $1
      `,
      [id],
    );

    if (existingProduct.rows.length === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // Delete product
    const result = await pool.query(
      `
      DELETE FROM products
      WHERE id = $1
      RETURNING *
      `,
      [id],
    );

    // Insert history record
    await pool.query(
      `
      INSERT INTO inventory_history
      (
        product_id,
        action,
        description,
        username
      )
      VALUES
      (
        $1,
        $2,
        $3,
        $4
      )
      `,
      [id, "DELETE", `Deleted ${existingProduct.rows[0].brand}`, req.user.username],
    );

    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error deleting product",
    });
  }
};

// search product (no need getallProducts does all the work)

// const searchProducts = async (req,res) => {

//   try {

//     const { q } = req.query;

//     const result = await pool.query(`
//       SELECT *
//       FROM products
//       WHERE
//       brand ILIKE $1
//       OR size ILIKE $1
//       OR pipe_type ILIKE $1
//     `,
//     [`%${q}%`]);

//     res.json(result.rows);

//   } catch(error) {

//     console.error(error);

//     res.status(500).json({
//       message:'Search Failed'
//     });

//   }
// };

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
