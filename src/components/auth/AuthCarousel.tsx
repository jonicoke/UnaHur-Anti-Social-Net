import '../../styles/components/auth/carrusel.css'

interface Slide {
  img: string;
  eslogan: string;
}

interface Props {
  slides: Slide[];
  actual: number;
}

function AuthCarousel({ slides, actual }: Props) {
  return (
    <div className="auth-carrusel">
      <img
        src={slides[actual].img}
        alt={`foto ${actual + 1}`}
        className="carrusel-img"
      />
      <div className="carrusel-overlay">
        <h1 className="carrusel-titulo">
          <span className="carrusel-barra"></span>
          UNAHUR AntiSocial
        </h1>
        <p className="carrusel-eslogan">{slides[actual].eslogan}</p>
      </div>
    </div>
  );
}

export default AuthCarousel;