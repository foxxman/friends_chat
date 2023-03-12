import { observer } from "mobx-react-lite";
import React, { useEffect, useRef } from "react";
import { Navigate, useParams } from "react-router-dom";
import Chats from "../components/ui/ChatPage/Chats";
import Header from "../components/ui/Header";
import chatsState from "../store/chatsState";
import userState from "../store/userState";

const Chat = observer(() => {
  const header = useRef<HTMLHeadElement | null>(null);
  const currentUserId = userState.auth.userId;
  const { userId } = useParams();

  useEffect(() => {
    userState.setIsLoading(true);
    if (userState.auth.userId) chatsState.setUserChats(userState.auth.userId);
  }, []);

  return userId === currentUserId ? (
    chatsState.rooms ? (
      <>
        <Header headerRef={header} />
        <Chats headerRef={header} />
      </>
    ) : null
  ) : (
    <Navigate replace to={`/chat/${currentUserId}`} />
  );
});

export default Chat;
