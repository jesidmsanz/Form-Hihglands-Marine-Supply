import Swal from 'sweetalert2';
const generalConfig = {
  showCloseButton: true,
  showConfirmButton: false,
  showClass: {
    popup: '',
    backdrop: 'swal2-backdrop-show',
    icon: 'swal2-icon-show',
  },
};

export const loading = (messageText = 'Saving...') => {
  Swal.fire({
    icon: 'question',
    text: messageText,
    ...generalConfig,
  });
};

const message = (messageText, type = 4) => {
  switch (type) {
    case 1: {
      Swal.fire({
        icon: 'success',
        text: messageText,
        ...generalConfig,
      });
      break;
    }
    case 2: {
      Swal.fire({
        icon: 'warning',
        text: messageText,
        ...generalConfig,
      });
      break;
    }
    case 3: {
      Swal.fire({
        icon: 'error',
        text: messageText,
        ...generalConfig,
      });
      break;
    }
    default: {
      Swal.fire({
        icon: 'info',
        text: messageText,
        ...generalConfig,
      });
    }
  }
};

export const success = (messageText) => {
  message(messageText, 1);
};

export const warning = (messageText) => {
  message(messageText, 2);
};

export const error = (messageText) => {
  message(messageText, 3);
};

const customMessage = { loading, message, success, warning, error };
export default customMessage;
