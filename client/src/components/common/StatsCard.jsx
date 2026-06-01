const StatsCard = ({ title, value, subtitle, icon }) => {
    return (
        <div className="card stats-card border-0 shadow-sm bg-black text-white">
            <div className="card-body d-flex align-items-start gap-3">
                <div className="icon-box bg-gold text-dark">{icon}</div>
                <div>
                    <p className="text-uppercase text-secondary mb-2 small">{title}</p>
                    <h3 className="mb-1">{value}</h3>
                    <p className="text-muted small mb-0">{subtitle}</p>
                </div>
            </div>
        </div>
    );
};

export default StatsCard;
