import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ListPage from "./pages/list.page";
import Navbar from "./components/navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<div>Home</div>} />
        <Route path="/lists" element={<ListPage />} />
        <Route path="*" element={<div>Not found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
