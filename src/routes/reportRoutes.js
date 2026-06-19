const express = require("express");
// const PDFDocument = require("pdfkit");

const router = express.Router();
const verifyToken =
  require("../middleware/authMiddleware");

const {
  getReportData,
  downloadReportPDF,
  downloadReportExcel,
} = require("../controllers/reportController");

router.get("/",verifyToken, getReportData);
router.get("/pdf",verifyToken, downloadReportPDF);
router.get(
  "/excel",
  verifyToken,
  downloadReportExcel
);

module.exports = router;