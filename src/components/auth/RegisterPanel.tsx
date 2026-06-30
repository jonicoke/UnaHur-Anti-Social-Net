import '../../styles/components/auth/registro-panel.css'

interface Props {
  regNickName: string;
  setRegNickName: (v: string) => void;
  regEmail: string;
  setRegEmail: (v: string) => void;
  regContraseña: string;
  setRegContraseña: (v: string) => void;
  errorRegistro: string;
  onSubmit: (e: React.FormEvent) => void;
}

function RegisterPanel({
  regNickName, setRegNickName,
  regEmail, setRegEmail,
  regContraseña, setRegContraseña,
  errorRegistro,
  onSubmit
}: Props) {
  return (
    <div className="auth-panel">
      <div className="auth-card">
        <h2>Crear cuenta</h2>
        <p className="auth-subtitle">Es gratis (y lo seguirá siendo).</p>
        <form onSubmit={onSubmit}>
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
  );
}

export default RegisterPanel;