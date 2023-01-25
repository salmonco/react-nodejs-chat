import { BrowserRouter, Routes, Route } from "react-router-dom";
import Chat from "./page/Chat";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
