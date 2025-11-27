import Swal from 'sweetalert2';

/**
 * 알림 유틸리티
 * SweetAlert2를 기반으로 한 통합 알림 시스템
 */

export const showSuccess = (message, title = "성공") => {
  return Swal.fire({
    title: title,
    text: message,
    icon: 'success',
    confirmButtonText: '확인',
    confirmButtonColor: '#10b981',
    customClass: {
      popup: 'rounded-xl shadow-2xl',
      title: 'font-bold',
      content: 'text-gray-700'
    }
  });
};

export const showError = (message, title = "오류") => {
  return Swal.fire({
    title: title,
    text: message,
    icon: 'error',
    confirmButtonText: '확인',
    confirmButtonColor: '#ef4444',
    customClass: {
      popup: 'rounded-xl shadow-2xl',
      title: 'font-bold',
      content: 'text-gray-700'
    }
  });
};

export const showInfo = (message, title = "정보") => {
  return Swal.fire({
    title: title,
    text: message,
    icon: 'info',
    confirmButtonText: '확인',
    confirmButtonColor: '#3b82f6',
    customClass: {
      popup: 'rounded-xl shadow-2xl',
      title: 'font-bold',
      content: 'text-gray-700'
    }
  });
};

export const showWarning = (message, title = "경고") => {
  return Swal.fire({
    title: title,
    text: message,
    icon: 'warning',
    confirmButtonText: '확인',
    confirmButtonColor: '#f59e0b',
    customClass: {
      popup: 'rounded-xl shadow-2xl',
      title: 'font-bold',
      content: 'text-gray-700'
    }
  });
};

// Confirm 모달 기능 - SweetAlert2 기반
export const showConfirm = async (message, title = "확인", confirmText = "확인", cancelText = "취소") => {
  const result = await Swal.fire({
    title: title,
    text: message,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3b82f6',
    cancelButtonColor: '#9ca3af',
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    customClass: {
      popup: 'rounded-xl shadow-2xl',
      title: 'font-bold',
      content: 'text-gray-700'
    }
  });

  return result.isConfirmed;
};