import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
// import Home from './pages/Home'; // We will build this in the next branch

function App() {
  return (
    <Router>
      <Navbar />
      <div style={{ padding: '20px 0' }}>
        <Routes>
          <Route path="/" element={<div className="container"><h2>Welcome to Mini D-Mart! Please Login to continue. (Products page coming in next branch)</h2></div>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
