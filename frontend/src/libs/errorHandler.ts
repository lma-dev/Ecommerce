import ToastAlert from "@/app/[locale]/_components/ui/toast-box";
import { z } from "zod";

// Define a type for the error parameter
type ErrorType = z.ZodError | Error | unknown;

export const handleErrors = (error: ErrorType) => {
  if (error instanceof z.ZodError) {
    const errorMessages = error.errors.map((e) => e.message);

    errorMessages.forEach((errorMessage) => {
      ToastAlert.error({ message: errorMessage });
    });
  } else if (error instanceof Error) {
    ToastAlert.error({ message: error.message || "An unknown error occurred" });
  } else {
    ToastAlert.error({ message: "An unknown error occurred" });
  }
};
