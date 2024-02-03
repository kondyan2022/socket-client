import { Container } from "@mui/material";
import { Outlet } from "react-router-dom";
import { Header } from "./components/Header";
// import { useEffect, useState } from "react";
// import { io } from "socket.io-client";
// import Cookies from "js-cookies";

function App() {
  // const [socket, setSocket] = useState(null);
  // const [userId, setUserId] = useState(null);

  // useEffect(() => {
  //   setSocket(io(process.env.REACT_APP_BACKEND));
  //   const userId = Cookies.getItem("userId");
  //   if (userId) {
  //     setUserId(userId);
  //   }
  // }, []);

  return (
    <div>
      <Container>
        <Header
        // socket={socket} userId={userId} setUserId={setUserId}
        />
        <Outlet
        // context={{ socket, userId }}
        />
      </Container>
    </div>
  );
}

export default App;
