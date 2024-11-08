import { Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/Register";
import ChecklistPage from "./components/Checklist";
import CreateNew from "./components/CreateNew"

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/my-checklist" element={<ChecklistPage />} />
        <Route path="/create" element={<CreateNew />} />
      </Routes>
    </div>
  );
}

export default App;
