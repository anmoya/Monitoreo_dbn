const express = require("express");
const router = express.Router();
const PdfHandler = require('../handlers/PdfHandler');

router.get('/', PdfHandler.getPdf);
router.get('/chart', PdfHandler.Chart);

module.exports = router;