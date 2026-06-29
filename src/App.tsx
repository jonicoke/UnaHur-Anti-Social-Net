import { BrowserRouter, Routes, Route } from "react-router-dom";
import RutaProtegida from "./components/RutaProtegida";
import NavBar from "./components/NavBar";
import Perfil from "./pages/Perfil";
import Home from "./pages/Home";
import Login from "./pages/Login";
import './styles/mobileFooter.css'
import MobileFooter from "./components/MobileFooter"
import { FeedCreateProvider } from "./context/FeedCreateContext";

function App() {
    return (
        <BrowserRouter>
            <FeedCreateProvider>            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={
                    <RutaProtegida>
                        <NavBar />
                        <Perfil />
                        <Home />
                        <MobileFooter />
                    </RutaProtegida>
                } />
            </Routes>
            </FeedCreateProvider>
        </BrowserRouter>
    );
}

export default App;