import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from './components/NavBar'; 
import Footer from './components/Footer';
import Home from './pages/Home';

function App() {
  return (
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
        <Footer />
      </BrowserRouter>
  );
}

export default App