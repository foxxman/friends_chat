import React, { FC } from "react";
import styles from "../../../scss/Chat.module.scss";
import { IChatMessage } from "../../../store/chatsState";

interface MessageProps {
  self: boolean;
  data: IChatMessage;
}
// ДОБАВИТЬ ДАТУ ОТПРАВЛЕНИЯ

const Message: FC<MessageProps> = ({ self, data }) => {
  return (
    <div className={`${styles.Message} ${self && styles.Self}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        className={`bi bi-person-circle ${styles.MessageAvatar}`}
        viewBox="0 0 16 16"
      >
        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
        <path
          fillRule="evenodd"
          d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
        />
      </svg>
      <div>
        <p className={`${styles.MessageText}`}>{data.text}</p>
        <p className={`small text-muted ${self && "float-end"}`}>
          {/* 12:00 PM | Aug 13 */}
          {!self ? data.user.name : "You"}
        </p>
      </div>
    </div>
  );
};

export default Message;
