import { observer } from "mobx-react-lite";
import React, { FC, useState } from "react";
import { Button, ListGroup, Modal } from "react-bootstrap";
import { Oval } from "react-loader-spinner";
import roomState from "../../../../store/roomState";
import AddMemberModal from "./AddMemberModal";
import MembersListItem from "./MembersListItem";

interface MembersModalProps {
  show: boolean;
  handleClose: () => void;
  inviteOpen: () => void;
}

const MembersModal: FC<MembersModalProps> = observer(
  ({ show, handleClose, inviteOpen }) => {
    const inviteClickHandler = () => {
      handleClose();
      inviteOpen();
    };

    return (
      <>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title className="mr-1">
              {roomState.chatName} members:
            </Modal.Title>
            <Oval
              height={20}
              width={20}
              color="#0d6efd"
              visible={roomState.loading}
              ariaLabel="oval-loading"
              secondaryColor="#0d6efd"
              strokeWidth={2}
              strokeWidthSecondary={2}
            />
          </Modal.Header>
          <Modal.Body>
            <Button
              onClick={inviteClickHandler}
              variant="outline-primary"
              className="w-100 mb-3"
            >
              Invite +
            </Button>
            <ListGroup>
              {roomState.membersList &&
                roomState.membersList.map((u) => (
                  <MembersListItem key={u._id} user={u} />
                ))}
            </ListGroup>
          </Modal.Body>
        </Modal>
      </>
    );
  }
);

export default MembersModal;
