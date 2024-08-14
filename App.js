// App.js
import React from "react";
import MainContainer from "./navigation/Maincontainer";
import { NotificationProvider } from "./context/NotificationContext";
import { StepProvider } from "./context/StepContext";

export default function App() {
  return (
    <StepProvider>
      <NotificationProvider>
        <MainContainer />
      </NotificationProvider>
    </StepProvider>
  );
}
