import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import { Home, Room, Chats } from "./pages";
import { TestPage } from "./pages/TestPage";
import { ChatWindow } from "./components/ChatWindow";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      {
        path: "/chats",
        element: <Chats />,
        children: [
          {
            path: "room/:roomId",
            element: <ChatWindow operator />,
          },
        ],
      },
      { path: "/room/:roomId", element: <Room /> },
      { path: "/test-page", element: <TestPage /> },
    ],
  },
]);

export default router;
