const express = require("express");
const router = express.Router();
const cronController = require("../controllers/cronController");

// Vercel Cron Jobs endpoints
// 보안을 위해 CRON_SECRET 헤더 확인 권장 (선택사항)
router.get("/weekly-sync", cronController.weeklySync);
router.get("/annual-sync", cronController.annualSync);

module.exports = router;
