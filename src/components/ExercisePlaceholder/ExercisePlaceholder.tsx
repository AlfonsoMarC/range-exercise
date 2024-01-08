import React from "react";
import styles from "./ExercisePlaceholder.module.css";

export interface ExercisePlaceholderProps {
  message: string;
}

const ExercisePlaceholder: React.FC<ExercisePlaceholderProps> = ({ message }) => {
  return <div className={`${styles.container} exercise-placeholder__container`}>{message}</div>;
};

export default ExercisePlaceholder;
