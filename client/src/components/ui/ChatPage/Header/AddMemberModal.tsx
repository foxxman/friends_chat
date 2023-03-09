import React, { FC, useEffect, useState } from "react";
import {
  Form,
  InputGroup,
  ListGroup,
  ListGroupItem,
  Modal,
} from "react-bootstrap";
import { Oval } from "react-loader-spinner";
import userService, { IUserData } from "../../../../services/user.service";
import roomState from "../../../../store/roomState";
import userState from "../../../../store/userState";

interface MembersModalProps {
  show: boolean;
  handleClose: () => void;
}

const AddMemberModal: FC<MembersModalProps> = ({ show, handleClose }) => {
  const [searchStr, setSearchStr] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [usersList, setUsersList] = useState<IUserData[]>([]);

  useEffect(() => {
    loadUsersList();
  }, [searchStr]);

  const loadUsersList = async () => {
    if (searchStr.length > 0) {
      setLoading(true);
      const data = await userService.getByLogin(searchStr);
      setLoading(false);
      if (data)
        setUsersList(
          data.users.filter((u) => !roomState.membersIds?.includes(u._id))
        );
    } else {
      setUsersList([]);
    }
  };

  const inviteUser = (userId: string) => {
    roomState.inviteMember(userId);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title className="mr-1">Add users:</Modal.Title>
        <Oval
          height={20}
          width={20}
          color="#0d6efd"
          visible={loading}
          ariaLabel="oval-loading"
          secondaryColor="#0d6efd"
          strokeWidth={2}
          strokeWidthSecondary={2}
        />
      </Modal.Header>
      <Modal.Body>
        <Form.Control
          className="mb-3"
          value={searchStr}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearchStr(e.target.value)
          }
        />
        <ListGroup variant="flush">
          {usersList.map((u) => (
            <ListGroupItem
              action
              key={u._id}
              className="d-flex align-items-center"
              onClick={() => inviteUser(u._id)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="bi bi-plus"
                viewBox="0 0 16 16"
              >
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
              </svg>
              <span>{u.login}</span>
            </ListGroupItem>
          ))}
        </ListGroup>
      </Modal.Body>
    </Modal>
  );
};

export default AddMemberModal;
