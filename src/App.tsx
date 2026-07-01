import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RutaProtegida from "./components/RutaProtegida";
import NavBar from "./components/navbar/NavBar";
import Perfil from "./pages/Perfil";
import Home from "./pages/Home";
import Login from "./pages/Login";
import './styles/mobileFooter.css'
import MobileFooter from "./components/MobileFooter"
import { FeedCreateProvider } from "./context/FeedCreateContext";
import DetallePost from "./components/DetallePost";

function App() {
    return (
        <BrowserRouter>
            <FeedCreateProvider>            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={
                    <RutaProtegida>
                        <NavBar />
                        <Home />
                        <MobileFooter />
                    </RutaProtegida>
                } />
                <Route path="/profile" element={
                    <RutaProtegida>
                        <NavBar />
                        <Perfil />
                        <MobileFooter />
                    </RutaProtegida>
                } />
                {}
                <Route path="/profile/:id" element={
                    <RutaProtegida>
                        <NavBar />
                        <Perfil />
                        <MobileFooter />
                    </RutaProtegida>
                } />
                <Route
                    path="/post/:id"
                    element={
                        <RutaProtegida>
                            <NavBar />
                            <DetallePost />
                            <MobileFooter />
                        </RutaProtegida>
                    }
                />
                <Route path="*" element={<Navigate to="/login" replace />} />
                {/* <Route
                    path="/post/:id"
                    element={
                        <RutaProtegida>
                            <DetallePost />
                        </RutaProtegida>
                    }
                /> */}
            </Routes>
            </FeedCreateProvider>
            </BrowserRouter>
    );
}

export default App;