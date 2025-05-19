import { toast, ToastContainer } from 'react-toastify';

const ToastService = {
  successToast: function(msg) {
    return  toast.success(msg, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
  },
  errorToast: function(msg) {
    return  toast.error(msg, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
  },
}
export default ToastService