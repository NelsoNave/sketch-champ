import "./App.css";
import Header from "./components/Header";
import PendingRoom from "./components/PendingRoom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./components/Home";

function App() {
  return (
    <div className="App h-screen px-6 sm:px-10 lg:px-24">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/:roomId/room" element={<PendingRoom />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;
