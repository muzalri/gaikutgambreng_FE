import React, { createContext, useContext, useState, useCallback } from "react";
import SimpleAlert from "../components/SimpleAlert";

const AlertContext = createContext();

export const useAlertContext = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlertContext must be used within an AlertProvider");
  }
  return context;
};

export const AlertProvider = ({ children }) => {
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

  const value = {
    showAlert,
    hideAlert,
    showSuccess,
    showWarning,
    showError,
  };

  return (
    <AlertContext.Provider value={value}>
      {children}
      <SimpleAlert
        type={alertState.type}
        message={alertState.message}
        show={alertState.show}
        onClose={hideAlert}
        duration={alertState.duration}
        withIcon={alertState.withIcon}
      />
    </AlertContext.Provider>
  );
};
