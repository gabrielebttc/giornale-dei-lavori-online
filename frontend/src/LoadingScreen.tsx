import { useEffect } from 'react';

type LoadingScreenProps = {
  isLoading: boolean;
};

export default function LoadingScreen({ isLoading }: LoadingScreenProps) {
  useEffect(() => {
    if (!isLoading) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{
        zIndex: 9999,
        backgroundColor: 'rgba(10, 18, 35, 0.78)',
        backdropFilter: 'blur(4px)',
        pointerEvents: 'all',
      }}
      role="status"
      aria-live="polite"
      aria-label="Caricamento in corso"
    >
      <div className="text-center text-white px-4 py-4 rounded-4" style={{ maxWidth: 460 }}>
        <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-white bg-opacity-10 mb-3" style={{ width: 84, height: 84 }}>
          <i className="bi bi-box-seam fs-1 text-info" aria-hidden="true"></i>
        </div>

        <div className="d-flex justify-content-center mb-3">
          <div className="spinner-border text-info" style={{ width: '2.2rem', height: '2.2rem' }} role="status" aria-hidden="true"></div>
        </div>

        <h5 className="fw-bold mb-2">Caricamento...</h5>
        <p className="mb-0 small text-white-50">
          Non uscire e non ricaricare la pagina
        </p>
      </div>
    </div>
  );
}
