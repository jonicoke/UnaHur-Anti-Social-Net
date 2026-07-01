# 🌐 UNAHUR Anti-Social Net

> [!NOTE]
> Trabajo Práctico Final — Construcción de Interfaces de Usuario · UNAHUR 2026

La red social donde los estudiantes de la Universidad Nacional de Hurlingham comparten proyectos, sobreviven a los parciales y fingen no socializar.

---

## ✨ Funcionalidades

### Requeridas
- 🔐 **Login simulado** con nickName y contraseña fija `123456`
- 📝 **Registro de usuarios** con validación de campos
- 🏠 **Home / Feed** con publicaciones recientes, imágenes, etiquetas y cantidad de comentarios
- 📄 **Detalle de publicación** con comentarios y formulario para comentar
- 👤 **Perfil de usuario** con publicaciones propias y botón de logout
- ✏️ **Crear publicación** con descripción, imágenes (URLs) y etiquetas

### Extras implementados ⭐
- ♾️ **Scroll infinito** — carga 1 post por vez con delay animado
- 🔽 **Filtro por instituto** — Tec. e Ingeniería, Biotecnología, Educación, Salud Comunitaria
- 🔥 **Ordenar por recientes / destacados** — destacados = más comentarios
- 📈 **Tendencias** — tags con más apariciones en el feed
- 👥 **Seguir / Dejar de seguir** usuarios desde el feed
- 💬 **Comentar inline** desde el feed sin ir al detalle
- 🌙 **Modo oscuro** con persistencia
- 🎞️ **Animaciones de entrada**
- 📱 **Diseño responsive** con navbar y footer mobile que se ocultan al scrollear
- 🖼️ **Foto de perfil, instituto y descripción** por usuario
- ⚡ **Accesos rápidos** a Calendario, Biblioteca, Campus virtual y SIU Guaraní

---

## 🛠️ Tecnologías

| Tecnología | Uso |
|---|---|
| React + TypeScript | Framework principal |
| Vite | Bundler |
| React Router DOM | Navegación y rutas protegidas |
| CSS puro + Variables | Estilos y theming |
| Bootstrap Icons | Iconografía |
| Context API | Estado global (auth, tema) |
| IntersectionObserver | Scroll infinito y reveal animations |
| localStorage | Persistencia de sesión |

---

## 🚀 Cómo correr el proyecto

### Prerrequisitos
- Node.js 18+
- npm

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/unahur-antisocial-net.git
cd unahur-antisocial-net
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Levantar el backend

> [!IMPORTANT]
> El frontend requiere que el backend esté corriendo en `http://localhost:3001` antes de iniciar.

Cloná y corré la API del profesor:

```bash
git clone https://github.com/lucasfigarola/backend-api.git
cd backend-api
npm install
node seed.js   # poblar la base de datos
node index.js  # levantar el servidor
```

### 4. Levantar el frontend

```bash
npm run dev
```

Abrí [http://localhost:5173](http://localhost:5173) en el navegador.

---

## 🌐 API utilizada

**Base URL:** `http://localhost:3001`

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/users` | Lista de usuarios |
| GET | `/users/:id` | Usuario por ID |
| POST | `/users` | Crear usuario |
| GET | `/posts` | Lista de publicaciones |
| GET | `/posts/:id` | Detalle de publicación |
| GET | `/posts?userId=xxx` | Posts de un usuario |
| POST | `/posts` | Crear publicación |
| GET | `/tags` | Listado de etiquetas |
| GET | `/comments/post/:postId` | Comentarios de un post |
| POST | `/comments` | Crear comentario |
| GET | `/postimages/post/:postId` | Imágenes de un post |
| POST | `/postimages` | Asociar imagen a post |

---
## 👤 Credenciales de prueba

> [!TIP]
> Podés loguearte con cualquiera de estos usuarios. La contraseña siempre es `123456`.

| NickName | Instituto |
|---|---|
| `luna` | Arte y Diseño |
| `sol` | Tec. e Ingeniería |
| `joni` | Tec. e Ingeniería |
| `marcos` | Biotecnología |
| `vale` | Educación |

---

## ⚠️ Consideraciones

> [!WARNING]
> El backend debe estar corriendo antes de iniciar el frontend. Sin la API, el login y el feed no funcionan.

> [!CAUTION]
> Al correr `node seed.js` se borra y recrea toda la base de datos. No lo corras si ya tenés datos que querés conservar.

---

## 👨‍💻 Integrantes

| Nombre | GitHub |
|---|---|
| Jonathan Giacomini | [@jonicoke](https://github.com/jonicoke) |
| Alan Gonzalez | [@1-AlanGonzalez](https://github.com/1-AlanGonzalez) |
| Damian Haberkorn |  [@DarkoDv](https://github.com/DarkoDv) |
| Brandon Duce | [@agusolv580](https://github.com/agusolv580) |
| Agustin Olavarria |  [@Brandonduce67](https://github.com/Brandonduce67) |
---

