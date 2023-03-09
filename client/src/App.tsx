import React from "react";
import AppRouter from "./components/AppRouter";
import styles from "./scss/App.module.scss";
import "./scss/index.scss";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className={styles.App}>
      <AppRouter />
      <ToastContainer />
    </div>
  );
}

export default App;
