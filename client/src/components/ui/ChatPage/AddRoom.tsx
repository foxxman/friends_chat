import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import AddRoomForm from "../AddRoomForm";

const AddRoom = () => {
  const [show, setShow] = useState<boolean>(false);
  const handleShow = () => setShow((p) => !p);
  return (
    <>
      <Button
        onClick={handleShow}
        variant="outline-primary"
        className="mb-2 d-flex justify-content-center align-items-center"
      >
        <span className="d-block mr-2">New room</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          style={{ marginLeft: "6px" }}
          fill="currentColor"
          className="bi bi-plus-lg ml-2"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"
          />
        </svg>
      </Button>
      <Modal show={show} onHide={handleShow}>
        <Modal.Header closeButton>
          <Modal.Title>Create new desk</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddRoomForm onSubmit={() => setShow(false)} />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AddRoom;
