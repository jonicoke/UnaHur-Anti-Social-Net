import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { getUsers, createUser } from "../services/api";
import '../styles/components/auth/base.css'

import AuthTopbar from "../components/auth/AuthTopbar";
import AuthCarousel from "../components/auth/AuthCarousel";
import RegisterPanel from "../components/auth/RegisterPanel";

import foto1 from '../assets/carrusel/foto1.jpg'
import foto2 from '../assets/carrusel/foto2.jpg'
import foto3 from '../assets/carrusel/foto3.jpeg'
import foto4 from '../assets/carrusel/foto4.jpg'
import foto5 from '../assets/carrusel/foto5.jpg'
import foto6 from '../assets/carrusel/foto6.jpg'
import foto7 from '../assets/carrusel/foto7.jpg'
import foto8 from '../assets/carrusel/foto8.jpg'
import foto9 from '../assets/carrusel/foto9.jpg'

const slides = [
  { img: foto1, eslogan: "Donde el conocimiento se construye por todos." },
  { img: foto2, eslogan: "Aprender juntos, crecer sin límites." },
  { img: foto3, eslogan: "Tu futuro empieza en estos pasillos." },
  { img: foto4, eslogan: "Una comunidad que te impulsa." },
  { img: foto5, eslogan: "Ciencia, arte y tecnología en un solo lugar." },
  { img: foto6, eslogan: "Orgullosos de ser UNAHUR." },
  { img: foto7, eslogan: "Cada día es una nueva oportunidad." },
  { img: foto8, eslogan: "La universidad que te pertenece." },
  { img: foto9, eslogan: "Formando los profesionales del mañana." },
]

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [nickName, setNickName] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [errorLogin, setErrorLogin] = useState("");
  const [errorContraseña, setErrorContraseña] = useState("");

  const [regNickName, setRegNickName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regContraseña, setRegContraseña] = useState("");
  const [errorRegistro, setErrorRegistro] = useState("");

  const [actual, setActual] = useState(0);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setActual(prev => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(intervalo);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorLogin("");
    setErrorContraseña("");
    try {
      const users = await getUsers();
      const usuarioEncontrado = users.find(u => u.nickName === nickName || u.email === nickName);
      if (!usuarioEncontrado) {
        setErrorLogin("El correo o NickName que ingresaste no está conectado a ninguna cuenta.");
        return;
      }
      if (contraseña !== "123456") {
        setErrorContraseña("La contraseña es incorrecta. Revisá e intentá de nuevo.");
        return;
      }
      login(usuarioEncontrado);
      navigate("/");
    } catch {
      setErrorLogin("Error al conectar con el servidor.");
    }
  };

  const handleRegistro = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorRegistro("");
    if (!regNickName || !regEmail || !regContraseña) { setErrorRegistro("Todos los campos son obligatorios."); return; }
    if (regContraseña !== "123456") { setErrorRegistro("La contraseña debe ser 123456."); return; }
    try {
      const nuevoUsuario = await createUser({ nickName: regNickName, email: regEmail, password: "123456" });
      login(nuevoUsuario);
      navigate("/");
    } catch (err) {
      setErrorRegistro(err instanceof Error ? err.message : "Error al registrar el usuario.");
    }
  };

  return (
    <div className="auth-wrapper">
      <AuthTopbar
        nickName={nickName}
        setNickName={setNickName}
        contraseña={contraseña}
        setContraseña={setContraseña}
        errorLogin={errorLogin}
        setErrorLogin={setErrorLogin}
        errorContraseña={errorContraseña}
        setErrorContraseña={setErrorContraseña}
        onSubmit={handleLogin}
      />

      <main className="auth-body">
        <AuthCarousel slides={slides} actual={actual} />
        <RegisterPanel
          regNickName={regNickName}
          setRegNickName={setRegNickName}
          regEmail={regEmail}
          setRegEmail={setRegEmail}
          regContraseña={regContraseña}
          setRegContraseña={setRegContraseña}
          errorRegistro={errorRegistro}
          onSubmit={handleRegistro}
        />
      </main>
    </div>
  );
}

export default Login;