// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { useAuth } from "../context/authContext";
// import { createUser } from "../services/api";

// function Registro() {
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const [nickName, setNickName] = useState("");
//   const [email, setEmail] = useState("");
//   const [contraseña, setContraseña] = useState("");
//   const [error, setError] = useState("");

//   const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault();
//   setError("");

//   if (!nickName || !email || !contraseña) {
//     setError("Todos los campos son obligatorios.");
//     return;
//   }

//   // Validamos que use la contraseña correcta
//   if (contraseña !== "123456") {
//     setError("La contraseña debe ser 123456.");
//     return;
//   }

//   try {
//     const nuevoUsuario = await createUser({ nickName, email, password: "123456" });
//     login(nuevoUsuario);
//     navigate("/");
//   } catch (err) {
//     if (err instanceof Error) {
//       setError(err.message);
//     } else {
//       setError("Error al registrar el usuario.");
//     }
//   }
// };

//   return (
//     <div>
//       <h2>Registrarse</h2>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label>NickName</label>
//           <input
//             type="text"
//             value={nickName}
//             onChange={e => setNickName(e.target.value)}
//           />
//         </div>
//         <div>
//           <label>Email</label>
//           <input
//             type="email"
//             value={email}
//             onChange={e => setEmail(e.target.value)}
//           />
//         </div>
//         <div>
//           <label>Contraseña</label>
//           <input
//             type="password"
//             value={contraseña}
//             onChange={e => setContraseña(e.target.value)}
//           />
//         </div>
//         {error && <p style={{ color: "red" }}>{error}</p>}
//         <button type="submit">Crear cuenta</button>
//       </form>
//       <p>¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link></p>
//     </div>
//   );
// }

// export default Registro;