import React, { useState } from "react";
import styles from "../../../scss/Chat.module.scss";
import roomState from "../../../store/roomState";
import TextField from "../../common/form/TextField";

const MessageInput = () => {
  const [message, setMessage] = useState<string>("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    roomState.sendMessage(message);
    setMessage("");
  };

  return (
    <form
      onSubmit={handleSend}
      className="text-muted d-flex align-items-center  pt-3  "
    >
      <input
        autoFocus
        autoComplete="off"
        value={message}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setMessage(e.target.value)
        }
        name="message"
        type="text"
        className={`${styles.SendInput} form-control form-control-lg`}
        placeholder="Type message"
      />

      <button type="submit" className={styles.SendBtn} onClick={handleSend}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          className="bi bi-send"
          viewBox="0 0 16 16"
        >
          <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z" />
        </svg>
      </button>
    </form>
  );
};

export default MessageInput;
