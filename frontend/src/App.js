import { BrowserRouter, Routes, Route } from "react-router-dom";
import Join from "./page/Join";
import Chat from "./page/Chat";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Join />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
