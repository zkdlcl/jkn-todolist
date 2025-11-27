const express = require("express");
const router = express.Router();
const syncController = require("../controllers/syncController");
const authMiddleware = require("../middlewares/authMiddleware");

// 공휴일 데이터 동기화 (인증 필요)
router.post("/holidays", authMiddleware, syncController.syncHolidays);

module.exports = router;
