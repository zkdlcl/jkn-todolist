import { useEffect } from "react";
import { useForm } from "react-hook-form";
import useTodoStore from "../stores/useTodoStore";

function TodoModal({ isOpen, onClose, todoToEdit }) {
  const { addTodo, updateTodo, isLoading } = useTodoStore();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      content: "",
      start_date: "",
      due_date: "",
      priority: "MEDIUM",
    },
  });

  // 시작 날짜와 마감 날짜 감시
  const startDate = watch("start_date");
  const dueDate = watch("due_date");

  // 모달이 열릴 때 초기값 설정
  useEffect(() => {
    if (isOpen) {
      if (todoToEdit) {
        // 수정 모드
        setValue("title", todoToEdit.title);
        setValue("content", todoToEdit.content || "");
        setValue("priority", todoToEdit.priority);

        // 날짜 포맷팅 (datetime-local input에 맞게)
        if (todoToEdit.start_date) {
          setValue(
            "start_date",
            new Date(todoToEdit.start_date).toISOString().slice(0, 16)
          );
        }
        if (todoToEdit.due_date) {
          setValue(
            "due_date",
            new Date(todoToEdit.due_date).toISOString().slice(0, 16)
          );
        }
      } else {
        // 추가 모드 - 폼 초기화
        reset({
          title: "",
          content: "",
          start_date: new Date().toISOString().slice(0, 16), // 기본값: 현재 시간
          due_date: "",
          priority: "MEDIUM",
        });
      }
    }
  }, [isOpen, todoToEdit, setValue, reset]);

  const onSubmit = async (data) => {
    // 빈 문자열 날짜 처리
    const todoData = {
      ...data,
      start_date: data.start_date || null,
      due_date: data.due_date || null,
    };

    let result;
    if (todoToEdit) {
      result = await updateTodo(todoToEdit.id, todoData);
    } else {
      result = await addTodo(todoData);
    }

    if (result.success) {
      onClose();
    } else {
      alert(result.error || "작업에 실패했습니다.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      {/* max-w-xl로 가로폭 확대 */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-xl overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {todoToEdit ? "할일 수정" : "할일 추가"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          {/* 제목 */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              제목 <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              {...register("title", {
                required: "제목을 입력해주세요",
                maxLength: {
                  value: 200,
                  message: "제목은 200자 이내여야 합니다",
                },
              })}
              className={`w-full px-4 py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.title ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="할일을 입력하세요"
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-600">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* 내용 */}
          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              내용
            </label>
            <textarea
              id="content"
              rows="4"
              {...register("content")}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="상세 내용을 입력하세요 (선택)"
            />
          </div>

          {/* 날짜 설정 */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="start_date"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                시작 일시
              </label>
              <input
                id="start_date"
                type="datetime-local"
                {...register("start_date")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="due_date"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                마감 일시
              </label>
              <div className="relative">
                <input
                  id="due_date"
                  type={watch("due_date") ? "datetime-local" : "text"}
                  placeholder="마감기한 없음"
                  onFocus={(e) => (e.target.type = "datetime-local")}
                  onBlur={(e) => {
                    if (!e.target.value) e.target.type = "text";
                  }}
                  {...register("due_date", {
                    validate: (value) => {
                      if (!value || !startDate) return true;
                      return (
                        new Date(value) >= new Date(startDate) ||
                        "마감일은 시작일 이후여야 합니다"
                      );
                    },
                  })}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                    errors.due_date ? "border-red-500" : "border-gray-300"
                  } ${!watch("due_date") ? "text-gray-500" : "text-gray-900"}`}
                />
              </div>
              {errors.due_date && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.due_date.message}
                </p>
              )}
            </div>
          </div>

          {/* 우선순위 */}
          <div>
            <label
              htmlFor="priority"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              우선순위
            </label>
            <select
              id="priority"
              {...register("priority")}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="LOW">낮음 (LOW)</option>
              <option value="MEDIUM">보통 (MEDIUM)</option>
              <option value="HIGH">높음 (HIGH)</option>
            </select>
          </div>

          {/* 버튼 그룹 */}
          <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "저장 중..." : "저장"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TodoModal;
