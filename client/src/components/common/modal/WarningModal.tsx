import React, { FC } from "react";
import { Button, Modal } from "react-bootstrap";

interface MembersModalProps {
  show: boolean;
  handleClose: () => void;
  handleAgree: () => void;
  title: string;
  text: string;
}

const WarningModal: FC<MembersModalProps> = ({
  show,
  handleClose,
  handleAgree,
  title,
  text,
}) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title className="mr-1">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{text}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleAgree}>
          Yes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default WarningModal;
