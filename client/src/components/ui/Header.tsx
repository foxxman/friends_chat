import React from "react";
import { Button, Container } from "react-bootstrap";
import styles from "../../scss/App.module.scss";
import localStorageService from "../../services/localStorage.service";
import chatsState from "../../store/chatsState";
import roomState from "../../store/roomState";
import userState from "../../store/userState";
import history from "../../utils/history";

const Header = () => {
  const exitHandler = () => {
    roomState.removeRoomState();
    chatsState.removeState();
    userState.logout();
  };

  return (
    <header className={` ${styles.Header} w-100 border-bottom py-3 mb-3`}>
      <Container className="d-flex align-items-center justify-content-between">
        <h1 className="text-primary text-bold m-0">Friends Chat</h1>

        <p className="">{userState.auth.login}</p>

        <button onClick={exitHandler}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            // width="25"
            // height="25"
            fill="currentColor"
            className="bi bi-box-arrow-right"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"
            />
            <path
              fillRule="evenodd"
              d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"
            />
          </svg>
        </button>
      </Container>
    </header>
  );
};

export default Header;
