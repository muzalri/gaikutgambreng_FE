import { useState, useCallback } from "react";

const useAlert = () => {
  const [alertState, setAlertState] = useState({
    show: false,
    type: "success",
    message: "",
    withIcon: false,
    duration: 3000,
  });

  const showAlert = useCallback(
    ({ type = "success", message, withIcon = false, duration = 3000 }) => {
      setAlertState({
        show: true,
        type,
        message,
        withIcon,
        duration,
      });
    },
    []
  );

  const hideAlert = useCallback(() => {
    setAlertState((prev) => ({
      ...prev,
      show: false,
    }));
  }, []);

  const showSuccess = useCallback(
    (message, withIcon = false) => {
      showAlert({ type: "success", message, withIcon });
    },
    [showAlert]
  );

  const showWarning = useCallback(
    (message, withIcon = false) => {
      showAlert({ type: "warning", message, withIcon });
    },
    [showAlert]
  );

  const showError = useCallback(
    (message, withIcon = false) => {
      showAlert({ type: "error", message, withIcon });
    },
    [showAlert]
  );

  return {
    alertState,
    showAlert,
    hideAlert,
    showSuccess,
    showWarning,
    showError,
  };
};

export default useAlert;
