import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { Card, Container, Row } from "react-bootstrap";
import "../../../scss/Chat.scss";
import styles from "../../../scss/App.module.scss";
import Room from "./Room";
import RoomsList from "./RoomsList";

const Chats = observer(() => {
  return (
    <Container
      className={`${styles.ChatsContainer} d-flex align-items-center `}
    >
      <Card className=" shadow-lg h-100 w-100">
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
