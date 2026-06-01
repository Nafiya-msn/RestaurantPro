const Modal = ({ title, show, onClose, children, footer }) => {
    if (!show) return null;

    return (
        <div className="modal-backdrop d-flex align-items-center justify-content-center">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content bg-black border border-secondary">
                    <div className="modal-header border-0">
                        <h5 className="modal-title text-white">{title}</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <div className="modal-body text-white">{children}</div>
                    {footer && <div className="modal-footer border-0">{footer}</div>}
                </div>
            </div>
        </div>
    );
};

export default Modal;
