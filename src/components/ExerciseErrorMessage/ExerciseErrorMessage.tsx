import React from "react";
import styles from "./ExerciseErrorMessage.module.css";

export interface ExerciseErrorMessageProps {
  error?: string;
  discreteMode?: boolean;
}

const ExerciseErrorMessage: React.FC<ExerciseErrorMessageProps> = ({ error, discreteMode }) => {
  const dataName = discreteMode ? "values" : "limits";
  const errorMessage = `${
    error ?? `Invalid range ${dataName}`
  }. Default ${dataName} are being used.`;
  return (
    <div className={`${styles.container} exercise-error-message__container`}>{errorMessage}</div>
  );
};

export default ExerciseErrorMessage;
