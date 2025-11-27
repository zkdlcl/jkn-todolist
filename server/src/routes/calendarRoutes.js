const express = require("express");
const router = express.Router();
const calendarController = require("../controllers/calendarController");
const authMiddleware = require("../middlewares/authMiddleware");

// 모든 라우트에 인증 미들웨어 적용
router.use(authMiddleware);

// 달력 데이터 조회 (할일 및 공공 일정)
router.get("/:year/:month", calendarController.getCalendarData.bind(calendarController));

module.exports = router;