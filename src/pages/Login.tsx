import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { getUsers, createUser } from "../services/api";
import unahurImg from '../assets/unahur.jpg'
import '../styles/components/auth.css'

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
  { img: foto1, eslogan: "Donde el conocimiento se construye entre todos." },
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

  const [regNickName, setRegNickName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regContraseña, setRegContraseña] = useState("");
  const [errorRegistro, setErrorRegistro] = useState("");

  const [actual, setActual] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setActual(prev => (prev + 1) % slides.length);
        setFadeIn(true);
      }, 400);
    }, 4000);
    return () => clearInterval(intervalo);
  }, []);

  const cambiar = (idx: number) => {
    setFadeIn(false);
    setTimeout(() => { setActual(idx); setFadeIn(true); }, 400);
  }

  const anterior = () => cambiar((actual - 1 + slides.length) % slides.length);
  const siguiente = () => cambiar((actual + 1) % slides.length);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorLogin("");
    try {
      const users = await getUsers();
      const usuarioEncontrado = users.find(u => u.nickName === nickName);
      if (!usuarioEncontrado) { setErrorLogin("El usuario no existe."); return; }
      if (contraseña !== "123456") { setErrorLogin("Contraseña incorrecta."); return; }
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
    <div className="auth-wrapper" style={{ backgroundImage: `url(${unahurImg})` }}>

      {/* TOPBAR */}
      <header className="auth-topbar">
        <span className="auth-topbar-logo">AntiSocial</span>
        <form className="auth-topbar-form" onSubmit={handleLogin}>
          <div className="auth-topbar-field">
            <label>Correo electrónico o NickName</label>
            <input type="text" value={nickName} onChange={e => setNickName(e.target.value)} />
          </div>
          <div className="auth-topbar-field">
            <label>Contraseña</label>
            <input type="password" value={contraseña} onChange={e => setContraseña(e.target.value)} />
          </div>
          <button type="submit">Ingresar</button>
          {errorLogin && <span className="auth-error-topbar">{errorLogin}</span>}
        </form>
      </header>

      {/* BODY */}
      <main className="auth-body">

        {/* CARRUSEL */}
        <div className="auth-carrusel">
          <img
            src={slides[actual].img}
            alt={`foto ${actual + 1}`}
            className={`carrusel-img ${fadeIn ? 'fade-in' : 'fade-out'}`}
          />
          <div className={`carrusel-overlay ${fadeIn ? 'fade-in' : 'fade-out'}`}>
            <h1 className="carrusel-titulo">AntiSocial</h1>
            <p className="carrusel-eslogan">{slides[actual].eslogan}</p>
          </div>
          <button className="carrusel-btn carrusel-prev" onClick={anterior}>&#8249;</button>
          <button className="carrusel-btn carrusel-next" onClick={siguiente}>&#8250;</button>
          <div className="carrusel-dots">
            {slides.map((_, i) => (
              <span
                key={i}
                className={`carrusel-dot ${i === actual ? 'active' : ''}`}
                onClick={() => cambiar(i)}
              />
            ))}
          </div>
        </div>

        {/* PANEL REGISTRO */}
        <div className="auth-panel">
          <div className="auth-card">
            <h2>Crear cuenta</h2>
            <p className="auth-subtitle">Es gratis (y lo seguirá siendo).</p>
            <form onSubmit={handleRegistro}>
              <div className="auth-field">
                <label>NickName</label>
                <input type="text" value={regNickName} onChange={e => setRegNickName(e.target.value)} />
              </div>
              <div className="auth-field">
                <label>Email</label>
                <input type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)} />
              </div>
              <div className="auth-field">
                <label>Contraseña</label>
                <input type="password" value={regContraseña} onChange={e => setRegContraseña(e.target.value)} />
              </div>
              {errorRegistro && <p className="auth-error">{errorRegistro}</p>}
              <button type="submit" className="btn-registro">Registrarse</button>
            </form>
          </div>
        </div>

      </main>
    </div>
  );
}

export default Login;