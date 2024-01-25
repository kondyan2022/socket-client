import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import { Home, Room, Chats } from "./pages";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "/chats", element: <Chats /> },
      { path: "/room/:roomId", element: <Room /> },
    ],
  },
]);

export default router;
