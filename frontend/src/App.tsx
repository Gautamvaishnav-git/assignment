import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import ListPage from "./pages/list.page";
import ProtectedPage from "./pages/protected.page";
import Login from "./pages/login.page";
import SignUp from "./pages/signup.page";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedPage />}>
          <Route path="/" element={<div>Home</div>} />
          <Route path="/lists" element={<ListPage />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<div>Not found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
