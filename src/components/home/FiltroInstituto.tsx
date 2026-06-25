import '../../styles/components/home/filtroInstituto.css'

const INSTITUTOS_CONFIG: Record<string, { className: string; name: string }> = {
    'Tec. e Ingenieria':  { className: 'inst-tec',   name: 'Tec. e Ingeniería' },
    'Biotecnologia':      { className: 'inst-bio',   name: 'Biotecnología' },
    'Educacion':          { className: 'inst-edu',   name: 'Educación' },
    'Salud Comunitaria':  { className: 'inst-salud', name: 'Salud Comunitaria' },
}

interface Props {
    institutoFilter: string | null
    onFilterChange: (key: string | null) => void
}

function FiltroInstituto({ institutoFilter, onFilterChange }: Props) {
    return (
        <div className="suggestions-card filtro-instituto" data-reveal="right" data-reveal-delay="0">
            <h4>Filtrar por Instituto</h4>
            <div className="institutos-grid">
                {Object.entries(INSTITUTOS_CONFIG).map(([key, val]) => (
                    <button
                        key={key}
                        className={`inst-btn ${val.className} ${institutoFilter === key ? 'active' : ''}`}
                        onClick={() => onFilterChange(institutoFilter === key ? null : key)}
                    >
                        {val.name}
                    </button>
                ))}
            </div>
        </div>
    )
}

export { INSTITUTOS_CONFIG }
export default FiltroInstituto