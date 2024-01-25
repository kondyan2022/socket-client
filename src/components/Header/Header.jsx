import { Button, Card } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

export const Header = () => {
  const navigate = useNavigate();

  const createNewRoom = () => {
    const roomId = uuidv4();
    navigate(`/room/${roomId}`);
  };
  return (
    <Card sx={{ marginTop: 5 }} raised>
      <NavLink to="/">
        <Button>Home</Button>
      </NavLink>

      {/* <NavLink to={`/room/${roomId}`}>
        <Button>Room</Button>
      </NavLink> */}

      <Button variant="text" type="button" onClick={createNewRoom}>
        New Room
      </Button>
    </Card>
  );
};
