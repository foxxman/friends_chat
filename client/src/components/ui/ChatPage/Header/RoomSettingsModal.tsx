import React, { FC } from "react";
import { ListGroup, Modal } from "react-bootstrap";
import roomState from "../../../../store/roomState";
import userState from "../../../../store/userState";

interface SettingsModalProps {
  show: boolean;
  handleClose: () => void;
  warningOpen: () => void;
}

enum ICON_VARIANTS {
  LEAVE = "leave",
  REMOVE = "remove",
}

const getIcon = (icon: ICON_VARIANTS) => {
  switch (icon) {
    case ICON_VARIANTS.LEAVE:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
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
      );
    case ICON_VARIANTS.REMOVE:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          className="bi bi-trash3"
          viewBox="0 0 16 16"
        >
          <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
        </svg>
      );

    default:
      break;
  }
};

const RoomSettingsModal: FC<SettingsModalProps> = ({
  show,
  handleClose,
  warningOpen,
}) => {
  const isAdmin = roomState.admin?._id === userState.auth.userId;

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Settings</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListGroup>
          <ListGroup.Item
            className="font-weight-bold text-danger d-flex justify-content-between"
            action
            onClick={warningOpen}
          >
            <span>{isAdmin ? "Remove" : "Leave"} chat</span>
            {getIcon(isAdmin ? ICON_VARIANTS.REMOVE : ICON_VARIANTS.LEAVE)}
          </ListGroup.Item>
        </ListGroup>
      </Modal.Body>
    </Modal>
  );
};

export default RoomSettingsModal;
