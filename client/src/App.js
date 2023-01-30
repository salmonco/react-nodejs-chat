import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SocketContext, socket } from "./context/socket";
import Join from "./page/Join";
import Chat from "./page/Chat";

function App() {
  return (
    <SocketContext.Provider value={socket}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Join />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </BrowserRouter>
    </SocketContext.Provider>
  );
}

export default App;
