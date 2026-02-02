import { toast } from "sonner";

export const showSuccessToast = (message: string) => {
  toast.success(message, {
    duration: 3000,
    position: "top-center",
  });
};

export const showErrorToast = (message: string) => {
  toast.error(message, {
    duration: 4000,
    position: "top-center",
  });
};

export const showInfoToast = (message: string) => {
  toast.info(message, {
    duration: 3000,
    position: "top-center",
  });
};

export const showWarningToast = (message: string) => {
  toast.warning(message, {
    duration: 3000,
    position: "top-center",
  });
};

export const showLoadingToast = (message: string) => {
  return toast.loading(message, {
    position: "top-center",
  });
};
