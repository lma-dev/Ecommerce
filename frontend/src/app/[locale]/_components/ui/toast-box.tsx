import { toast } from "sonner";

type ToastType = {
  message: any;
};
const ToastAlert = {
  success: ({ message }: ToastType) => {
    toast.success(message);
  },

  error: ({ message }: ToastType) => {
    toast.error(message);
  },
};

export default ToastAlert;
