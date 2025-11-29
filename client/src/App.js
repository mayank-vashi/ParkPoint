// src/App.js
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import BookSlot from './pages/BookSlot';
import ModifySlot from './pages/ModifySlot';
import MainLayout from './layout/MainLayout';
import FrontMainLayout from './layout/FrontMainLayout';
import Home from './pages/Home';

function App() {
  return (
    <div>
    <Router>
      <Routes>
        <Route element={<FrontMainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Route>
        <Route element={<MainLayout />}>
          <Route path="/user" element={<UserDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/book" element={<BookSlot />} />
          <Route path="/modifyslot" element={<ModifySlot />} />
        </Route>
      </Routes>
    </Router>
    </div>
  );
}

export default App;
