const ChartCard = ({ title, description, children }) => {
    return (
        <div className="card chart-card border-0 shadow-sm bg-black text-white">
            <div className="card-body">
                <div className="d-flex align-items-center justify-content-between mb-3">
                    <div>
                        <h5 className="mb-1">{title}</h5>
                        <p className="text-muted small mb-0">{description}</p>
                    </div>
                    <span className="badge rounded-pill bg-gold text-dark">Live</span>
                </div>
                {children}
            </div>
        </div>
    );
};

export default ChartCard;
