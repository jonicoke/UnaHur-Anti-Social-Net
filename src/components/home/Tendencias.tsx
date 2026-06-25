import '../../styles/components/home/tendencias.css'

interface Trend {
    name: string
    count: number
}

interface Props {
    trends: Trend[]
}

function Tendencias({ trends }: Props) {
    return (
        <div className="suggestions-card" data-reveal="right" data-reveal-delay="100">
            <h4>TENDENCIAS</h4>
            <div className="trend-tag-container">
                {trends.length > 0 ? (
                    trends.map((trend, index) => (
                        <div className="trend-item" key={trend.name}>
                            <div className="trend-hashtag-box" data-index={index}>#</div>
                            <div className="trend-info">
                                <span className="trend-name">#{trend.name}</span>
                                <small className="trend-count">
                                    {trend.count} {trend.count === 1 ? 'post' : 'posts'}
                                </small>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="no-trends">No hay tendencias aún.</p>
                )}
            </div>
        </div>
    )
}

export default Tendencias