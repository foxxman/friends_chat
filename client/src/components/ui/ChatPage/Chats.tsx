import { observer } from "mobx-react-lite";
import React, { FC, MutableRefObject, useEffect, useState } from "react";
import { Card, Container, Row } from "react-bootstrap";
import "../../../scss/Chat.scss";
import styles from "../../../scss/App.module.scss";
import Room from "./Room";
import RoomsList from "./RoomsList";
import roomState from "../../../store/roomState";

interface ChatsProps {
  headerRef: MutableRefObject<HTMLHeadElement | null>;
}

const Chats: FC<ChatsProps> = observer(({ headerRef }) => {
  const [containerHeight, setContainerHeight] = useState<number | null>(null);

  window.addEventListener("resize", () => resizeContainer());

  useEffect(() => resizeContainer(), [headerRef.current, roomState.chatId]);

  const resizeContainer = () => {
    if (headerRef.current?.offsetHeight !== undefined)
      setContainerHeight(window.innerHeight - headerRef.current?.offsetHeight);
  };

  return (
    <Container
      style={{
        height: containerHeight !== null ? `${containerHeight}px` : "auto",
      }}
      className={`${styles.ChatsContainer} d-flex align-items-center py-3`}
    >
      <Card className="shadow-lg h-100 w-100">
        <Card.Body className="h-100">
          <Row className="h-100">
            <RoomsList />
            <Room />
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
});

export default Chats;
