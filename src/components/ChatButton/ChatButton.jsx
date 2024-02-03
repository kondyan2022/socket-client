import { Card } from "@mui/material";
import React, { useState } from "react";
import { ChatWindow } from "../ChatWindow";

export const ChatButton = () => {
  const [messageOn, setMessageOn] = useState(false);
  return (
    <Card
      onClick={() => setMessageOn(true)}
      sx={{
        position: "fixed",
        // padding: "20px",
        cursor: "pointer",
        bottom: "20px",
        right: "20px",
      }}
    >
      {messageOn ? <ChatWindow /> : "ChatButton"}
    </Card>
  );
};
