import { observer } from "mobx-react-lite";
import React, { useEffect, useRef, useState } from "react";
import styles from "../../../scss/Chat.module.scss";
import roomState from "../../../store/roomState";
import userState from "../../../store/userState";
import Message from "./Message";

const MessageList = observer(() => {
  const listScroll = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (listScroll.current) roomState.setScroll(listScroll.current);
  }, []);

  useEffect(() => {
    roomState.scrollToEnd();
  }, [roomState.scroll]);

  return (
    <div
      ref={listScroll}
      className={`pe-3 mt-auto ${styles.MessageList} ${styles.CustomScroll}`}
    >
      {roomState.messages &&
        roomState.messages.map((m) => (
          <Message
            key={m._id}
            data={m}
            self={userState.auth.userId === m.user._id}
          />
        ))}
    </div>
  );
});

export default MessageList;
