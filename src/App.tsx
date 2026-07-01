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
import { useAuth } from "./context/authContext";

function CatchAll() {
    const { usuario } = useAuth();
    return <Navigate to={usuario ? "/inicio" : "/login"} replace />;
}

function LoginRoute() {
    const { usuario } = useAuth();
    return usuario ? <Navigate to="/inicio" replace /> : <Login />;
}

function App() {
    return (
        <BrowserRouter>
            <FeedCreateProvider>
                <Routes>
                    <Route path="/login" element={<LoginRoute />} />
                    <Route path="/inicio" element={
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
                    <Route path="/profile/:id" element={
                        <RutaProtegida>
                            <NavBar />
                            <Perfil />
                            <MobileFooter />
                        </RutaProtegida>
                    } />
                    <Route path="/post/:id" element={
                        <RutaProtegida>
                            <NavBar />
                            <DetallePost />
                            <MobileFooter />
                        </RutaProtegida>
                    } />
                    <Route path="*" element={<CatchAll />} />
                </Routes>
            </FeedCreateProvider>
        </BrowserRouter>
    );
}

export default App;