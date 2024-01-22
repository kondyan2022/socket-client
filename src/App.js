import { Box, Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

function App() {
  const [socket, setSocket] = useState(null);
  const [messageText, setMessageText] = useState("");

  useEffect(() => {
    setSocket(io("http://localhost:4000"));
  }, []);

  const handleFromSubmit = (e) => {
    e.preventDefault();
    console.log(messageText);
    setMessageText("");
  };

  return (
    <>
      <div>Hello socket</div>
      <Box component="form" onSubmit={handleFromSubmit}>
        <TextField
          variant="standard"
          size="small"
          label="message"
          value={messageText}
          onChange={(e) => {
            setMessageText(e.target.value);
          }}
        />
        <Button type="submit" variant="text">
          connect
        </Button>
      </Box>
    </>
  );
}

export default App;
