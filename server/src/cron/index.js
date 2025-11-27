const publicEventScheduler = require("./publicEventScheduler");

/**
 * 모든 스케줄러 초기화 및 시작
 */
function initializeSchedulers() {
  publicEventScheduler.start();
}

module.exports = {
  initializeSchedulers,
  publicEventScheduler,
};
