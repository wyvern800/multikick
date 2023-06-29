import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./style.css";
import Notification from "./Components/Notification";
import Home from "./Components/Home";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<Home />} />
      </Routes>
      <Notification />
    </Router>
  );
};

export default App;
