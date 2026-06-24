import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { getUsers, createUser } from "../services/api";
import '../styles/components/auth.css'

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
  <div className="auth-wrapper">

    {/* TOPBAR */}
    <header className="auth-topbar">
      <span className="auth-topbar-logo">AntiSocial</span>
      <form className="auth-topbar-form" onSubmit={handleLogin}>
        <div className="auth-topbar-field">
          <label>Correo electrónico o NickName</label>
          <input
            type="text"
            value={nickName}
            onChange={e => setNickName(e.target.value)}
          />
        </div>
        <div className="auth-topbar-field">
          <label>Contraseña</label>
          <input
            type="password"
            value={contraseña}
            onChange={e => setContraseña(e.target.value)}
          />
        </div>
        <button type="submit">Ingresar</button>
        {errorLogin && <span className="auth-error-topbar">{errorLogin}</span>}
      </form>
    </header>

    {/* BODY */}
    <main className="auth-body">

      <div className="auth-left">
        <h1 className="auth-logo">AntiSocial</h1>
        <p className="auth-slogan">La red social para los que no quieren socializar.</p>
      </div>

      <div className="auth-card">
        <h2>Crear cuenta</h2>
        <p className="auth-subtitle">Es gratis (y lo seguirá siendo).</p>
        <form onSubmit={handleRegistro}>
          <div className="auth-field">
            <label>NickName</label>
            <input
              type="text"
              value={regNickName}
              onChange={e => setRegNickName(e.target.value)}
            />
          </div>
          <div className="auth-field">
            <label>Email</label>
            <input
              type="email"
              value={regEmail}
              onChange={e => setRegEmail(e.target.value)}
            />
          </div>
          <div className="auth-field">
            <label>Contraseña</label>
            <input
              type="password"
              value={regContraseña}
              onChange={e => setRegContraseña(e.target.value)}
            />
          </div>
          {errorRegistro && <p className="auth-error">{errorRegistro}</p>}
          <button type="submit" className="btn-registro">Registrarse</button>
        </form>
      </div>

    </main>
  </div>
);

}

export default Login;