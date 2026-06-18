const express = require("express");
// const PDFDocument = require("pdfkit");

const router = express.Router();

const {
  getReportData,
  downloadReportPDF,
  downloadReportExcel,
} = require("../controllers/reportController");

router.get("/", getReportData);
router.get("/pdf", downloadReportPDF);
router.get(
  "/excel",
  downloadReportExcel
);

module.exports = router;