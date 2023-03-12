import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "../../../scss/Chat.module.scss";
import chatsState from "../../../store/chatsState";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";
import RoomHeader from "./Header/RoomHeader";
import roomState from "../../../store/roomState";
import userState from "../../../store/userState";

const Room = observer(() => {
  const { chatId } = useParams();

  useEffect(() => {
    if (chatId) chatsState.setChat(chatId);
    else userState.setIsLoading(false);
  }, []);

  return (
    <div
      className={`col-md-6 col-lg-7 col-xl-8 ${styles.MessageBlock} ${
        roomState.chatId ? styles.MessageBlockActive : ""
      }`}
    >
      {roomState.chatId ? (
        <>
          <RoomHeader />
          <MessageList />
          <MessageInput />
        </>
      ) : (
        <p className="text-center m-auto">
          <span className="display-6 text-muted ">
            Choose some room or create new
          </span>
        </p>
      )}
    </div>
  );
});

export default Room;
