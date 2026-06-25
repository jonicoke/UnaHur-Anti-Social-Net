import '../../styles/components/home/accesosRapidos.css'

function AccesosRapidos() {
    return (
        <div className="suggestions-card accesos-rapidos-card" data-reveal="left" data-reveal-delay="120">
            <h4>ACCESOS RÁPIDOS</h4>
            <a href="https://unahur.edu.ar/calendario-academico/" target="_blank" rel="noreferrer" className="acceso-item">
                <span className="icon-box geo-green"><i className="bi bi-calendar3"></i></span>
                <span>Calendario</span>
            </a>
            <a href="https://unahur.edu.ar/biblioteca/" target="_blank" rel="noreferrer" className="acceso-item">
                <span className="icon-box geo-blue"><i className="bi bi-book"></i></span>
                <span>Biblioteca</span>
            </a>
            <a href="https://campus.unahur.edu.ar/" target="_blank" rel="noreferrer" className="acceso-item">
                <span className="icon-box geo-cyan"><i className="bi bi-laptop"></i></span>
                <span>Campus virtual</span>
            </a>
            <a href="https://servicios.unahur.edu.ar/unahur3w/" target="_blank" rel="noreferrer" className="acceso-item">
                <span className="icon-box geo-orange"><i className="bi bi-mortarboard"></i></span>
                <span>SIU Guaraní</span>
            </a>
        </div>
    )
}

export default AccesosRapidos