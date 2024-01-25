import {
  Box,
  Card,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useCallback, useEffect, useState } from "react";

import debounce from "lodash.debounce";
import { useOutletContext, useParams } from "react-router-dom";

const ChatWindow = ({ children }) => {
  const { socket } = useOutletContext();
  const { roomId } = useParams();
  const [messageText, setMessageText] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!socket) return;
    socket.on("message-from-server", (data) => {
      setChatMessages((prev) => [
        ...prev,
        { message: data.message, received: true },
      ]);
      console.log("Received from server", data);
    });
    socket.on("start-typing-from-server", () => {
      console.log("start");
      setIsTyping(true);
    });
    socket.on("stop-typing-from-server", () => {
      setIsTyping(false);
    });
  }, [socket]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const startTyping = useCallback(
    debounce(() => socket.emit("start-typing", { roomId }), 800, {
      trailing: false,
      leading: true,
    }),
    [socket, roomId]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const stopTyping = useCallback(
    debounce(() => socket.emit("stop-typing", { roomId }), 800),
    [socket, roomId]
  );

  const handleFromSubmit = (e) => {
    e.preventDefault();
    socket.emit("message-send", { message: messageText, roomId });
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

  return (
    <Card sx={{ padding: 2, marginTop: 10, width: "50%" }} raised>
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
      {roomId && <Typography>{`Room ${roomId}`}</Typography>}
      <Box component="form" onSubmit={handleFromSubmit}>
        <InputLabel
          sx={{ opacity: isTyping ? "1" : "0" }}
          shrink
          htmlFor="message-input"
        >
          Typing...
        </InputLabel>
        <OutlinedInput
          sx={{ backgroundColor: "white", width: "100%" }}
          id="message-input"
          placeholder="Write message"
          size="small"
          value={messageText}
          onChange={handleInputChange}
          endAdornment={
            <InputAdornment position="end">
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
