import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { ko } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./CalendarPage.css";
import useTodoStore from "../stores/useTodoStore";
import TodoModal from "../components/TodoModal";

const locales = {
  ko: ko,
};

// Configure localizer with Korean locale
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date) => startOfWeek(date, { locale: ko }),
  getDay,
  locales,
});

const TooltipPortal = ({ children, position }) => {
  const mount = document.getElementById("portal-root") || document.body;
  return createPortal(
    <div
      className="fixed z-[9999] pointer-events-none"
      style={{
        left: position.x,
        top: position.y,
        transform: "translate(10px, 10px)", // Offset from cursor
      }}
    >
      {children}
    </div>,
    mount
  );
};

const CalendarPage = () => {
  const navigate = useNavigate();
  const { calendarEvents, fetchCalendarData, error, isLoading } =
    useTodoStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState("month");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [todoToEdit, setTodoToEdit] = useState(null);

  const handleSelectSlot = ({ start }) => {
    setSelectedDate(start);
    setTodoToEdit(null);
    setIsModalOpen(true);
  };

  const handleSelectEvent = (event) => {
    // 공휴일은 수정 불가
    if (event.isPublicEvent) return;

    // 할일 데이터 구성 (모달 포맷에 맞게)
    const todoData = {
      id: event.id,
      title: event.title,
      content: event.content,
      priority: event.priority,
      start_date: event.start,
      due_date: event.end,
      is_completed: event.is_completed,
    };

    setTodoToEdit(todoData);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
    setTodoToEdit(null);
    // Refresh calendar data to show new todo
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    fetchCalendarData(year, month);
  };

  // Fetch calendar data for the current month
  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // Month is 0-indexed, but API expects 1-12
    fetchCalendarData(year, month);
  }, [currentDate, fetchCalendarData]);

  // Custom event style based on event type and completion status
  const eventStyleGetter = (event) => {
    let backgroundColor;

    if (event.isPublicEvent) {
      // 공휴일 및 공공 이벤트 - 타입별로 색상 구분
      switch (event.eventType) {
        case "SOLAR_TERM": // 24절기 - 보라색
          backgroundColor = "#9333ea";
          break;
        case "SEASONAL_DAY": // 잡절 - 주황색
          backgroundColor = "#ea580c";
          break;
        case "NOTICE": // 기념일 - 분홍색
          backgroundColor = "#ec4899";
          break;
        case "HOLIDAY": // 공휴일 - 빨간색
        default:
          backgroundColor = "#dc2626";
          break;
      }
    } else if (event.is_completed) {
      // Completed todos - gray color
      backgroundColor = "#94a3b8";
    } else {
      // Pending todos - blue color
      backgroundColor = "#3b82f6";
    }

    const style = {
      backgroundColor,
      borderRadius: "5px",
      opacity: 0.8,
      color: "white",
      border: "0px",
      display: "block",
    };
    return {
      style: style,
      title: "", // Suppress default browser tooltip
    };
  };

  // Custom event component with tooltip
  const CustomEvent = ({ event }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
    const isHoliday = event.isPublicEvent;

    const handleMouseEnter = (e) => {
      setShowTooltip(true);
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseLeave = () => {
      setShowTooltip(false);
    };

    return (
      <>
        <div
          className="relative h-full overflow-hidden"
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div className="text-sm truncate pl-1">{event.title}</div>
        </div>

        {showTooltip && (
          <TooltipPortal position={cursorPos}>
            <div className="bg-white text-gray-800 text-xs p-3 rounded-lg shadow-xl border border-gray-200 w-72">
              <div
                className={`font-bold text-sm mb-2 pb-2 border-b ${
                  isHoliday
                    ? "text-red-600 border-red-100"
                    : "text-gray-800 border-gray-100"
                }`}
              >
                {event.title}
              </div>

              {!isHoliday && (
                <>
                  {event.content ? (
                    <div className="mb-3 text-gray-600 line-clamp-3 leading-relaxed">
                      {event.content}
                    </div>
                  ) : (
                    <div className="mb-3 text-gray-400 italic">
                      상세 내용 없음
                    </div>
                  )}

                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-50">
                    <span
                      className={`px-2 py-1 rounded-md text-[10px] font-semibold ${
                        event.priority === "HIGH"
                          ? "bg-red-50 text-red-600 border border-red-100"
                          : event.priority === "MEDIUM"
                          ? "bg-yellow-50 text-yellow-600 border border-yellow-100"
                          : "bg-blue-50 text-blue-600 border border-blue-100"
                      }`}
                    >
                      {event.priority === "HIGH"
                        ? "높음"
                        : event.priority === "MEDIUM"
                        ? "보통"
                        : "낮음"}
                    </span>
                    <span className="text-gray-500 font-medium">
                      {format(event.start, "M월 d일 a h:mm", { locale: ko })}
                    </span>
                  </div>
                </>
              )}

              {isHoliday && (
                <div className="text-gray-500 text-right font-medium">
                  {format(event.start, "M월 d일 (E)", { locale: ko })}
                </div>
              )}
            </div>
          </TooltipPortal>
        )}
      </>
    );
  };

  const handleNavigate = (newDate) => {
    setCurrentDate(newDate);
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  if (!localizer) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <p>캘린더를 로드하는 중 오류가 발생했습니다.</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col p-4 max-w-7xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <div className="flex-none flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">달력</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md transition-colors shadow-sm"
          >
            할일 목록
          </button>
          <button
            onClick={() => navigate("/trash")}
            className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors shadow-sm"
          >
            휴지통
          </button>
        </div>
      </div>

      {error && (
        <div className="flex-none mb-4 p-4 bg-red-100 border border-red-300 text-red-700 rounded-md">
          <p>{error}</p>
          <p className="text-sm mt-1">
            문제 해결 후 페이지를 새로고침해주세요.
          </p>
        </div>
      )}

      <div className="flex-1 min-h-0 border rounded-lg shadow-sm relative z-0">
        {isLoading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-white bg-opacity-70 backdrop-blur-sm">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-3"></div>
              <p className="text-blue-600 font-medium animate-pulse">
                일정을 불러오는 중입니다...
              </p>
            </div>
          </div>
        )}
        <Calendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%" }}
          eventPropGetter={eventStyleGetter}
          components={{
            event: CustomEvent,
          }}
          toolbar={true}
          views={["month", "week", "day"]}
          view={currentView}
          onView={handleViewChange}
          date={currentDate}
          onNavigate={handleNavigate}
          selectable={true}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          messages={{
            date: "날짜",
            time: "시간",
            event: "이벤트",
            allDay: "하루종일",
            week: "주",
            work_week: "근무 주",
            day: "일",
            month: "월",
            previous: "이전",
            next: "다음",
            today: "오늘",
            agenda: "일정",
            showMore: (total) => `+${total} 더보기`,
          }}
          popup={true}
        />
      </div>

      {/* 할일 추가 모달 */}
      <TodoModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        defaultDate={selectedDate}
        todoToEdit={todoToEdit}
      />
    </div>
  );
};

export default CalendarPage;
