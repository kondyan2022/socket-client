import React, { Suspense, useCallback, useEffect, useState } from "react";
import { ChatWindow } from "../../components/ChatWindow";
import {
  Avatar,
  Box,
  Card,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import MessageIcon from "@mui/icons-material/Message";
import PersonIcon from "@mui/icons-material/Person";
import { Link, NavLink, Outlet } from "react-router-dom";
import { io } from "socket.io-client";

export const Chats = () => {
  const [rooms, setRooms] = useState([]);
  const [userOnline, setUserOnline] = useState([]);
  const [operatorOnline, setOperatorOnline] = useState([]);
  const [typing, setTyping] = useState([]);

  const [socketChats, setSocketChats] = useState();

  useEffect(() => {
    async function fetchRooms() {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND}/rooms`);
        const {
          rooms = [],
          userOnline = [],
          operatorOnline = [],
        } = await response.json();
        setOperatorOnline(operatorOnline);
        setUserOnline(userOnline);
        setRooms(rooms);
      } catch (error) {
        console.log(error);
      }
    }
    fetchRooms();
    setSocketChats(io(process.env.REACT_APP_BACKEND));
  }, []);

  useEffect(() => {
    async function fetchRooms() {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND}/rooms`);
        const { rooms = [] } = await response.json();
        setRooms(rooms);
      } catch (error) {
        console.log(error);
      }
    }

    if (!socketChats) return;
    socketChats.on("refresh-typing", (typingArray) => {
      setTyping(typingArray);
    });
    socketChats.on("refresh-online", ({ user, operator }) => {
      setOperatorOnline(operator);
      setUserOnline(user);
    });
    socketChats.on("refresh-rooms", () => {
      fetchRooms();
    });
  }, [socketChats]);

  // const refreshList = useCallback(() => {
  //   first;
  // }, [second]);

  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      <Card variant="outlined" sx={{ maxWidth: "600px" }}>
        <List sx={{ display: "flex", flexDirection: "column" }}>
          {rooms.map((room) => (
            <ListItem key={room.roomId}>
              <NavLink to={`room/${room.roomId}`} style={{ display: "flex" }}>
                <ListItemText primary={room.roomId} />

                <PersonIcon
                  color="success"
                  sx={{ opacity: userOnline.includes(room.roomId) ? "1" : "0" }}
                />
                <PersonIcon
                  color="secondary"
                  sx={{
                    opacity: operatorOnline.includes(room.roomId) ? "1" : "0",
                  }}
                />
                <KeyboardIcon
                  color="success"
                  sx={{ opacity: typing.includes(room.roomId) ? "1" : "0" }}
                />
              </NavLink>
            </ListItem>
          ))}
        </List>
      </Card>
      <Suspense>
        <Outlet />
      </Suspense>
    </div>
  );
};
