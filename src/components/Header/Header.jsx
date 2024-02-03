import { Button, Card } from "@mui/material";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import Cookies from "js-cookies";

export const Header = ({ socket, userId, setUserId }) => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);

  const createNewRoom = () => {
    const roomId = uuidv4();
    navigate(`/room/${roomId}`);
    socket.emit("new-room-created", { roomId, userId });
    setRooms((prev) => [...prev, { roomId, name: "Test" }]);
  };

  const login = () => {
    const userId = uuidv4();
    Cookies.setItem("userId", userId);
    setUserId(userId);
    navigate("/");
  };

  const logout = () => {
    Cookies.removeItem("userId");
    setUserId(null);
    navigate("/");
  };

  useEffect(() => {
    if (!socket) return;
    // console.log(socket);
    socket.on("new-room-created", (room) => {
      setRooms((prev) => [...prev, room]);
    });
    socket.on("room-removed", ({ roomId }) => {
      console.log("delete header", roomId);
      setRooms((prev) => [...prev].filter((elem) => elem.roomId !== roomId));
    });
  }, [socket]);

  // useEffect(() => {
  //   if (!socket) return;
  // }, [socket]);

  useEffect(() => {
    async function fetchRooms() {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND}/rooms`);
        const { rooms } = await response.json();
        console.log(rooms);
        setRooms(rooms);
      } catch (error) {
        console.log(error);
      }
    }
    fetchRooms();
  }, []);

  return (
    <Card sx={{ marginTop: 5 }} raised>
      <NavLink to="/">
        <Button>Home</Button>
      </NavLink>
      {rooms.map((room) => (
        <NavLink key={room.roomId} to={`/room/${room.roomId}`}>
          <Button>{room.name}</Button>
        </NavLink>
      ))}
      <NavLink to="/test-page">
        <Button>Test Page</Button>
      </NavLink>
      {userId ? (
        <>
          <Button variant="text" type="button" onClick={createNewRoom}>
            New Room
          </Button>
          <Button variant="text" type="button" onClick={logout}>
            Logout
          </Button>
        </>
      ) : (
        <Button variant="text" type="button" onClick={login}>
          Login
        </Button>
      )}
    </Card>
  );
};
