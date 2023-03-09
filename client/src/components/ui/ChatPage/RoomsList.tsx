import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { Oval } from "react-loader-spinner";
import styles from "../../../scss/Chat.module.scss";
import roomService from "../../../services/room.service";
import chatsState, { IRoomsListItem } from "../../../store/chatsState";
import roomState from "../../../store/roomState";
import AddRoom from "./AddRoom";
import RoomsListItem from "./RoomsListItem";

const RoomsList = observer(() => {
  const [searchRoom, setSearchRoom] = useState<string>("");
  const [searchResults, setSearchResults] = useState<IRoomsListItem[] | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (searchRoom !== "") loadSearchingRooms();
    else setSearchResults(null);
  }, [searchRoom]);

  const loadSearchingRooms = async () => {
    setLoading(true);
    const data = await roomService.getByRoomname(searchRoom);
    if (data && data.rooms) setSearchResults(data.rooms);
    setLoading(false);
  };

  return (
    <div
      className={` col-md-6 col-lg-5 col-xl-4 mb-4 mb-md-0 ${
        styles.ChatsListBlock
      } ${!roomState.chatId ? styles.ChatsListBlockActive : ""}`}
    >
      <AddRoom />
      <InputGroup className="rounded mb-3">
        <Form.Control
          type="search"
          className="shadow-none"
          placeholder="Search room.."
          value={searchRoom}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearchRoom(e.target.value)
          }
        />
        <Button variant="primary" className="input-group-text border-0">
          <i className="bi bi-search"></i>
        </Button>
      </InputGroup>

      <div className={styles.ChatsList + " " + styles.CustomScroll}>
        {!loading ? (
          searchResults ? (
            searchResults.length !== 0 ? (
              <ul className="list-unstyled mb-0">
                {searchResults.map((room) => (
                  <RoomsListItem key={room._id} room={room} />
                ))}
              </ul>
            ) : (
              <p className="text-center text-secondary">No rooms found.</p>
            )
          ) : chatsState.rooms ? (
            chatsState.rooms.length !== 0 ? (
              <ul className="list-unstyled mb-0">
                {chatsState.rooms.map((room) => (
                  <RoomsListItem key={room._id} room={room} />
                ))}
              </ul>
            ) : (
              <p className="text-center text-secondary">No rooms found.</p>
            )
          ) : null
        ) : (
          <Oval
            height={40}
            width={40}
            // className="m-auto"
            color="#0d6efd"
            visible={loading}
            ariaLabel="oval-loading"
            secondaryColor="#0d6efd"
            strokeWidth={2}
            strokeWidthSecondary={2}
          />
        )}
      </div>
    </div>
  );
});

export default RoomsList;
