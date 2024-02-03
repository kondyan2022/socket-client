import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { ChatWindow } from "../../components/ChatWindow";

export const Room = () => {
  // const { roomId } = useParams();
  // // const { socket } = useOutletContext();
  // useEffect(() => {
  //   if (!socket) return;
  //   socket.emit("join-room", { roomId });
  // }, [socket, roomId]);
  return (
    <>
      <ChatWindow />
    </>
  );
  // );
};
