import { Container } from "@mui/material";
import { Outlet } from "react-router-dom";
import { Header } from "./components/Header";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

function App() {
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    setSocket(io("http://192.168.1.107:4000"));
  }, []);

  return (
    <div>
      <Container>
        <Header />
        <Outlet context={{ socket }} />
      </Container>
    </div>
  );
}

export default App;
