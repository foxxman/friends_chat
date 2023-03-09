import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import roomState from "../../../../store/roomState";
import styles from "../../../../scss/Chat.module.scss";
import RoomHeaderBtn, { BTN_VARIANTS } from "./RoomHeaderBtn";
import MembersModal from "./MembersModal";
import AddMemberModal from "./AddMemberModal";
import RoomSettingsModal from "./RoomSettingsModal";
import WarningModal from "../../../common/modal/WarningModal";
import userState from "../../../../store/userState";
import chatsState from "../../../../store/chatsState";

const RoomHeader = observer(() => {
  const isAdmin = roomState.admin?._id === userState.auth.userId;

  const [modals, setModals] = useState<{ [index: string]: boolean }>({
    [BTN_VARIANTS.MEMBERS]: false,
    [BTN_VARIANTS.SETTINGS]: false,
    [BTN_VARIANTS.ADD_MEMBERS]: false,
    warning: false,
  });

  const changeShow = (index: string) => {
    setModals((m) => ({ ...m, [index]: !m[index] }));
  };

  const leaveRoomHandler = () => {
    if (roomState.chatId) chatsState.leaveRoomReq(roomState.chatId);
  };

  const removeRoomHandler = () => {
    if (roomState.chatId) chatsState.removeRoomReq(roomState.chatId);
  };

  return (
    <>
      <div className={styles.RoomHeader}>
        <h2 className="mr-auto">{roomState.chatName}</h2>
        <RoomHeaderBtn
          clickHandler={() => changeShow(BTN_VARIANTS.MEMBERS)}
          variant={BTN_VARIANTS.MEMBERS}
        />
        <RoomHeaderBtn
          clickHandler={() => changeShow(BTN_VARIANTS.SETTINGS)}
          variant={BTN_VARIANTS.SETTINGS}
        />
        <RoomHeaderBtn
          clickHandler={() => roomState.removeRoomState()}
          variant={BTN_VARIANTS.CLOSE_ROOM}
        />
      </div>
      {/* MODAL WINDIWS */}
      <MembersModal
        show={modals[BTN_VARIANTS.MEMBERS]}
        handleClose={() => changeShow(BTN_VARIANTS.MEMBERS)}
        inviteOpen={() => changeShow(BTN_VARIANTS.ADD_MEMBERS)}
      />
      <AddMemberModal
        show={modals[BTN_VARIANTS.ADD_MEMBERS]}
        handleClose={() => {
          changeShow(BTN_VARIANTS.ADD_MEMBERS);
          changeShow(BTN_VARIANTS.MEMBERS);
        }}
      />
      <RoomSettingsModal
        show={modals[BTN_VARIANTS.SETTINGS]}
        handleClose={() => changeShow(BTN_VARIANTS.SETTINGS)}
        warningOpen={() => {
          changeShow(BTN_VARIANTS.SETTINGS);
          changeShow("warning");
        }}
      />
      <WarningModal
        show={modals.warning}
        handleClose={() => changeShow("warning")}
        handleAgree={() => {
          changeShow("warning");
          if (isAdmin) removeRoomHandler();
          else leaveRoomHandler();
        }}
        text="You can not undo this action"
        title="Are you sure?"
      />
    </>
  );
});

export default RoomHeader;
