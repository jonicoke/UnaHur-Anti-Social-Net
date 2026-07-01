import '../../styles/components/auth/registro-panel.css'

interface Props {
  regNickName: string
  setRegNickName: (v: string) => void

  regEmail: string
  setRegEmail: (v: string) => void

  regContraseña: string
  setRegContraseña: (v: string) => void

  errorNickName: string
  errorEmail: string
  errorContraseña: string

  setErrorNickName: (v: string) => void
  setErrorEmail: (v: string) => void
  setErrorContraseña: (v: string) => void

  onSubmit: (e: React.FormEvent) => void
}

function RegisterPanel({
  regNickName,
  setRegNickName,

  regEmail,
  setRegEmail,

  regContraseña,
  setRegContraseña,

  errorNickName,
  errorEmail,
  errorContraseña,

  setErrorNickName,
  setErrorEmail,
  setErrorContraseña,

  onSubmit
}: Props) {
  return (
    <div className="auth-panel">

      <div className="auth-card">

        <h2>Crear cuenta</h2>


        <form onSubmit={onSubmit}>

          {/* NICKNAME */}

          <div className="auth-field">

            <label>NickName</label>

            <input
              type="text"
              value={regNickName}
              className={errorNickName ? "input-error" : ""}
              onChange={(e) => {
                setRegNickName(e.target.value)

                if (errorNickName) {
                  setErrorNickName("")
                }
              }}
            />

            <span className="auth-error">
              {errorNickName}
            </span>

          </div>

          {/* EMAIL */}

          <div className="auth-field">

            <label>Email</label>

            <input
              type="email"
              value={regEmail}
              className={errorEmail ? "input-error" : ""}
              onChange={(e) => {
                setRegEmail(e.target.value)

                if (errorEmail) {
                  setErrorEmail("")
                }
              }}
            />

            <span className="auth-error">
              {errorEmail}
            </span>

          </div>

          {/* CONTRASEÑA */}

          <div className="auth-field">

            <label>Contraseña</label>

            <input
              type="password"
              value={regContraseña}
              className={errorContraseña ? "input-error" : ""}
              onChange={(e) => {
                setRegContraseña(e.target.value)

                if (errorContraseña) {
                  setErrorContraseña("")
                }
              }}
            />

            <span className="auth-error">
              {errorContraseña}
            </span>

          </div>

          <button
            type="submit"
            className="btn-registro"
          >
            Registrarse
          </button>

        </form>

      </div>

    </div>
  )
}

export default RegisterPanel