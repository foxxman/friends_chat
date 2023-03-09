import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import Chats from "../components/ui/ChatPage/Chats";
import Header from "../components/ui/Header";
import chatsState from "../store/chatsState";
import userState from "../store/userState";

const Chat = observer(() => {
  const currentUserId = userState.auth.userId;
  const { userId } = useParams();

  useEffect(() => {
    userState.setIsLoading(true);

    if (userState.auth.userId) chatsState.setUserChats(userState.auth.userId);
  }, []);

  return userId === currentUserId ? (
    chatsState.rooms ? (
      <>
        <Header />
        <Chats />
      </>
    ) : null
  ) : (
    <Navigate replace to={`/chat/${currentUserId}`} />
  );
});

export default Chat;
