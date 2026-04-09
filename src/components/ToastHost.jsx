import { ToastContainer } from "react-toastify";
import { useTheme } from "../hooks/useTheme";

export const ToastHost = () => {
  const { isDark } = useTheme();

  return (
    <ToastContainer
      position="top-right"
      autoClose={2200}
      hideProgressBar={false}
      theme={isDark ? "dark" : "light"}
    />
  );
};
