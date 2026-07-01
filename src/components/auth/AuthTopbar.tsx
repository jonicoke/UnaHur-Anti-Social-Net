import logoUnahur from '../../assets/logo.png'
import '../../styles/components/auth/topbar.css'

interface Props {
  nickName: string;
  setNickName: (v: string) => void;
  contraseña: string;
  setContraseña: (v: string) => void;
  errorLogin: string;
  setErrorLogin: (v: string) => void;
  errorContraseña: string;
  setErrorContraseña: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

function AuthTopbar({
  nickName, setNickName,
  contraseña, setContraseña,
  errorLogin, setErrorLogin,
  errorContraseña, setErrorContraseña,
  onSubmit
}: Props) {
  return (
    <header className="auth-topbar">
      <div className="auth-topbar-brand">
        <img src={logoUnahur} alt="UNAHUR" className="auth-topbar-logo-img" />
        <span className="auth-topbar-logo">UNAHUR Anti-Social Net</span>
      </div>
      <form className="auth-topbar-form" onSubmit={onSubmit}>
        <div className="auth-topbar-field">
          <label>Correo electrónico o NickName</label>
          <input
            type="text"
            value={nickName}
            onChange={(e) => {
              setNickName(e.target.value)
              setErrorLogin("")
            }}
            className={errorLogin ? "input-error" : ""}
          />
          <span className="auth-error-topbar">{errorLogin}</span>
        </div>
        
        <div className="auth-topbar-field">
          <label>Contraseña</label>
          <input
            type="password"
            value={contraseña}
            onChange={(e) => {
              setContraseña(e.target.value)
              setErrorContraseña("")
            }}
            className={errorContraseña ? "input-error" : ""}
          />
          <span className="auth-error-topbar">{errorContraseña}</span>

          
          <span className={`auth-forgot-password pc-only ${errorContraseña ? "mover-abajo" : ""}`}>
            ¿Olvidaste tu contraseña?
          </span>
        </div>
        
        <button type="submit">Ingresar</button>

        <span className="auth-forgot-password mobile-only">
          ¿Olvidaste tu contraseña?
        </span>
      </form>
    </header>
  );
}

export default AuthTopbar;