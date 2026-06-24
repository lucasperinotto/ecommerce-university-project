import './ModalConfirm.css';

function ModalConfirm({ mensaje, onConfirmar, onCancelar }) {
  return (
    <div className="modal-overlay" onClick={onCancelar}>
      <div className="modal-caja" onClick={(e) => e.stopPropagation()}>
        <p className="modal-mensaje">{mensaje}</p>
        <div className="modal-acciones">
          <button className="modal-btn-cancelar" onClick={onCancelar}>
            Cancelar
          </button>
          <button className="modal-btn-confirmar" onClick={onConfirmar}>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalConfirm;
