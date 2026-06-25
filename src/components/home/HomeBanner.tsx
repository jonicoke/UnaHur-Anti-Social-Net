import '../../styles/components/home/homeBanner.css'

function HomeBanner() {
    return (
        <div className="home-banner" data-reveal="down" data-reveal-delay="0">
            <div className="home-banner-content">
                <h1>UNAHUR Anti-Social Net</h1>
                <p>
                    La red donde los estudiantes comparten proyectos,
                    sobreviven a los parciales y fingen no socializar.
                </p>
            </div>
        </div>
    )
}

export default HomeBanner