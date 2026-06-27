const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
// const nodemailer = require("nodemailer");

const { Resend } = require("resend");

const resend = new Resend(
  process.env.RESEND_API_KEY
);

const login = async (req, res) => {
  try {

    const { username, password } = req.body;

    const result = await pool.query(
      `
      SELECT *
      FROM users
      WHERE username = $1
      `,
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Invalid Credentials",
      });
    }

    const user = result.rows[0];

console.log(
  "Role from DB:",
  user.role
);

const isMatch = await bcrypt.compare(
  password,
  user.password
);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid Credentials",
      });
    }

   const token = jwt.sign(
  {
    
    id: user.id,
    username: user.username,
    role: user.role,
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "1d",
  }
  
);
    res.json({
  token,
  userId: user.id,
  username: user.username,
  role: user.role,
});

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });

  }
};

const forgotPassword = async (req, res) => {
  // console.log("Forgot Password button clicked");
  try {
    const { email } = req.body;

    // console.log("Email received:", email);

    const userResult = await pool.query(
      `
      SELECT *
      FROM users
      WHERE email = $1
      `,
      [email]
    );
//   console.log(
//   "Users found:",
//   userResult.rows.length
// );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        message: "Email not found",
      });
    }

    const user = userResult.rows[0];

        if (user.role !== "SUPER_ADMIN") {
  return res.status(403).json({
    message:
      "Password reset is available only for the administrator.",
  });
}

  const adminEmail = user.email;

//   console.log(
//   "User found:",
//   user.email
// );

    const resetToken =
      crypto.randomBytes(32).toString("hex");

    const expiry = new Date(
      Date.now() + 15 * 60 * 1000
    );

    await pool.query(
      `
      UPDATE users
      SET
        reset_token = $1,
        reset_token_expiry = $2
      WHERE id = $3
      `,
      [resetToken, expiry, user.id]
    );

//     console.log("EMAIL_USER:", process.env.EMAIL_USER);
// console.log(
//   "EMAIL_PASS LENGTH:",
//   process.env.EMAIL_PASS?.length
// );

//     console.log(
//   "BREVO_SMTP_USER:",
//   process.env.BREVO_SMTP_USER
// );

// console.log(
//   "BREVO_SMTP_PASS length:",
//   process.env.BREVO_SMTP_PASS?.length
// );


// const transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 465,
//     secure: true,
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//     },
// });




// console.log("EMAIL_USER:", process.env.EMAIL_USER);
// console.log("EMAIL_PASS:", process.env.EMAIL_PASS);

// transporter.verify((error, success) => {
//   if (error) {
//     console.error("SMTP Error:", error);
//   } else {
//     console.log("SMTP Server is ready");
//   }
// });

    const resetLink =
      `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;


  // console.log(
  //     "Sending reset email..."
  //   );


const { data, error } =
  await resend.emails.send({

    from: "onboarding@resend.dev",

    to: adminEmail,

    subject: "PVC Inventory Password Reset",

    html: `
      <h3>PVC Inventory Password Reset</h3>

      <p>Click the link below:</p>

      <a href="${resetLink}">
        Reset Password
      </a>

      <p>
        This link expires in 15 minutes.
      </p>
    `,
  });

  if (error) {
  console.error(error);

  return res.status(500).json({
    message:
      "Failed to send email",
  });
}

console.log(
  "Reset email sent:",
  data
);

  console.log(
      "Reset email sent successfully!"
    );

    res.status(200).json({
      message: "Password reset email sent",
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to send reset email",
    });

  }
};

const resetPassword = async (req, res) => {
  try {

    const { token } = req.params;

    const { password } = req.body;

    const result = await pool.query(
      `
      SELECT *
      FROM users
      WHERE reset_token = $1
      `,
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        message: "Invalid token",
      });
    }

    const user = result.rows[0];

    if (
      !user.reset_token_expiry ||
      new Date(user.reset_token_expiry) <
        new Date()
    ) {
      return res.status(400).json({
        message: "Token expired",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    await pool.query(
      `
      UPDATE users
      SET
        password = $1,
        reset_token = NULL,
        reset_token_expiry = NULL
      WHERE id = $2
      `,
      [hashedPassword, user.id]
    );

    res.status(200).json({
      message: "Password reset successful",
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to reset password",
    });

  }
};



module.exports = {
  login,
  forgotPassword,
  resetPassword,
};