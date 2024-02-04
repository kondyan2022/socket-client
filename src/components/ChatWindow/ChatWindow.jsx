import {
  Box,
  Button,
  Card,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useCallback, useEffect, useRef, useState } from "react";

import debounce from "lodash.debounce";
import { useParams } from "react-router-dom";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { io } from "socket.io-client";

import { v4 as uuidv4 } from "uuid";

const ChatWindow = ({ children, operator = false }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [inRoom, setInRoom] = useState(false);
  const [roomId, setRoomId] = useState(null);
  const { roomId: operatorRoomId } = useParams();

  const [messageText, setMessageText] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

  const fileInputRef = useRef();

  useEffect(() => {
    setSocket(io(process.env.REACT_APP_BACKEND));
  }, []);

  useEffect(() => {
    const roomId = operatorRoomId && operator ? operatorRoomId : uuidv4();
    setRoomId(roomId);
  }, [operatorRoomId, operator]);

  useEffect(() => {
    async function fetchRoom(roomId) {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND}/rooms/${roomId}`
        );
        const {
          room,
          isUserOnline = false,
          isOperatorOnline = false,
        } = await response.json();
        console.log("room=>", room);
        console.log("messages=>", room.messages);
        setInRoom(operator ? isUserOnline : isOperatorOnline);
        setChatMessages(
          room.messages.map((elem) => {
            return {
              message: elem.text,
              received: operator ? !elem.operator : elem.operator,
            };
          })
        );
      } catch (error) {
        console.log(error);
      }
    }

    if (roomId && socket) {
      socket.emit("join-room", { roomId, operator });
      fetchRoom(roomId);
    }
  }, [roomId, socket, operator]);

  useEffect(() => {
    if (!socket) return;
    socket.on("connect", () => {
      setConnected(true);
    });
    socket.on("disconnect", () => {
      setConnected(false);
    });

    if (operator) {
      socket.on("user-leave-room", ({ roomId }) => {
        setInRoom(false);

        console.log("user-leave-room", roomId);
      });
      socket.on("user-join-room", ({ roomId }) => {
        console.log("user-join-room", roomId);
        setInRoom(true);
      });
    } else {
      socket.on("operator-leave-room", ({ roomId }) => {
        setInRoom(false);
        console.log("operator-leave-room", roomId);
      });
      socket.on("operator-join-room", ({ roomId }) => {
        setInRoom(true);
        console.log("operator-join-room", roomId);
      });
    }

    socket.on("message-from-server", (data) => {
      setChatMessages((prev) => [
        ...prev,
        { message: data.message, received: true },
      ]);
      console.log("Received from server", data);
    });

    socket.on("start-typing-from-server", () => {
      setIsTyping(true);
    });
    socket.on("stop-typing-from-server", () => {
      setIsTyping(false);
    });
    // socket.on("room-removed", ({ roomId: currentRoomId }) => {
    //   console.log("Message", roomId, currentRoomId);
    //   if (roomId === currentRoomId) {
    //     navigate("/");
    //   }
    // });
  }, [socket, operator]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const startTyping = useCallback(
    debounce(() => socket.emit("start-typing", { roomId, operator }), 800, {
      trailing: false,
      leading: true,
    }),
    [socket, roomId]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const stopTyping = useCallback(
    debounce(() => socket.emit("stop-typing", { roomId, operator }), 800),
    [socket, roomId]
  );

  const handleFromSubmit = (e) => {
    e.preventDefault();
    socket.emit("message-send", { message: messageText, roomId, operator });
    setChatMessages((prev) => [
      ...prev,
      { message: messageText, received: false },
    ]);
    setMessageText("");
  };

  const handleInputChange = (e) => {
    startTyping();
    setMessageText(e.target.value);
    stopTyping();
  };

  // const handleDeleteRoom = (e) => {
  //   socket.emit("room-removed", { roomId });
  // };

  // const handleFileAttachClick = () => {
  //   fileInputRef.current.click();
  // };

  // const handleFileSelected = (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;
  //   const reader = new FileReader();

  //   reader.onload = () => {
  //     const data = reader.result;
  //     socket.emit("upload", { data });
  //   };
  // };

  return (
    <Card sx={{ padding: "10px", maxWidth: "100%" }} raised>
      <Box sx={{ marginBottom: 5 }}>
        {chatMessages.map(({ message, received }, index) => (
          <Typography
            key={`${message}${index}`}
            sx={{ textAlign: received ? "left" : "right" }}
          >
            {message}
          </Typography>
        ))}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography>{`Room ${roomId}`}</Typography>
        {inRoom && <Typography> Person here </Typography>}
        <Button size="small" variant="text">
          {connected ? "online" : "offline"}
        </Button>
      </Box>

      <Box component="form" onSubmit={handleFromSubmit}>
        <InputLabel
          sx={{ opacity: isTyping ? "1" : "0" }}
          shrink
          htmlFor="message-input"
        >
          Typing...
        </InputLabel>
        <OutlinedInput
          sx={{ backgroundColor: "white", maxWidth: "100%" }}
          id="message-input"
          placeholder="Write message"
          size="small"
          value={messageText}
          onChange={handleInputChange}
          endAdornment={
            <InputAdornment position="end" sx={{ gap: 1 }}>
              <input
                type="file"
                hidden
                ref={fileInputRef}
                // onChange={handleFileSelected}
              />
              <IconButton
                type="submit"
                edge="end"
                // onClick={handleFileAttachClick}
              >
                <AttachFileIcon />
              </IconButton>
              <IconButton type="submit" edge="end">
                <SendIcon />
              </IconButton>
            </InputAdornment>
          }
          autoComplete="off"
        />
        {children}
      </Box>
    </Card>
  );
};

export { ChatWindow };
