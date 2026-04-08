const AboutPage = () => {
  return (
    <div className="about-page m-0 p-0">
      {/* HERO SECTION */}
      <section className="bg-primary text-white text-center py-5">
        <div className="container">
          <h1 className="display-4 fw-bold mb-3">Giornale dei Lavori</h1>
          <p className="lead mb-4">
            La piattaforma più semplice e intuitiva per la gestione dei cantieri. BRAND NEW!!
          </p>
          <a href="#features" className="btn btn-light btn-lg fw-semibold shadow-sm">
            Scopri di più
          </a>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="container my-5">
        <div className="row align-items-center">
          <div className="col-12 col-lg-6 mb-4 mb-lg-0">
            <h2 className="fw-bold mb-3">
              Gestisci il tuo cantiere con semplicità e velocità
            </h2>
            <p className="fs-5 text-muted">
              Dimentica fogli di calcolo disordinati!  
              Con <strong>Giornale dei Lavori</strong> hai un’interfaccia chiara e organizzata
              per gestire le attività quotidiane e generare report Excel in pochi click.
            </p>
            <a href="/register" className="btn btn-primary btn-lg mt-3">
              🚀 Provalo Gratis
            </a>
          </div>

          <div className="col-12 col-lg-6">
            <img
              src="https://cdn-icons-png.flaticon.com/512/681/681392.png"
              alt="Gestione Cantieri"
              className="img-fluid mx-auto d-block"
              style={{ maxHeight: "300px" }}
            />
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="bg-light py-5">
        <div className="container text-center">
          <h2 className="fw-bold mb-5">Funzionalità Principali</h2>
          <div className="row g-4">
            <div className="col-12 col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm p-4">
                <i className="bi bi-people fs-1 text-primary mb-3"></i>
                <h5 className="fw-semibold">Aggiungi Lavoratori</h5>
                <p className="text-muted">Gestisci facilmente tutti i membri del tuo team in un unico posto.</p>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm p-4">
                <i className="bi bi-card-checklist fs-1 text-primary mb-3"></i>
                <h5 className="fw-semibold">Fai l'appello</h5>
                <p className="text-muted">Tieni traccia delle presenze in modo veloce e preciso.</p>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm p-4">
                <i className="bi bi-calendar-check fs-1 text-primary mb-3"></i>
                <h5 className="fw-semibold">Segna le attività giornaliere</h5>
                <p className="text-muted">Annota le attività svolte ogni giorno con semplicità.</p>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm p-4">
                <i className="bi bi-building fs-1 text-primary mb-3"></i>
                <h5 className="fw-semibold">Crea tanti cantieri</h5>
                <p className="text-muted">Gestisci più cantieri contemporaneamente, senza confusione.</p>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm p-4">
                <i className="bi bi-database fs-1 text-primary mb-3"></i>
                <h5 className="fw-semibold">Memorizza informazioni</h5>
                <p className="text-muted">Ogni cantiere conserva dati, note e report in modo ordinato.</p>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm p-4">
                <i className="bi bi-rocket fs-1 text-primary mb-3"></i>
                <h5 className="fw-semibold">E molto altro...</h5>
                <p className="text-muted">Funzionalità sempre nuove per semplificare la tua giornata lavorativa.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section id="try" className="bg-primary text-white text-center py-5">
        <div className="container">
          <h2 className="fw-bold mb-3">Pronto a semplificare la gestione del tuo cantiere?</h2>
          <p className="lead mb-4">Registrati ora e prova gratuitamente tutte le funzionalità.</p>
          <button className="btn btn-light btn-lg px-5 fw-semibold" onClick={() => window.location.href = '/register'}>
            Inizia Ora
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-dark text-center text-white py-3">
        <small>© {new Date().getFullYear()} Giornale dei Lavori — Tutti i diritti riservati</small>
      </footer>
    </div>
  );
};

export default AboutPage;
