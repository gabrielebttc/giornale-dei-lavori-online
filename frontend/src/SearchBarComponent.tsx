type SearchBarComponentProps = {
    searchTerm?: string,
    setSearchTerm: (string: string) => void
};

export default function SearchBarComponent ({ searchTerm, setSearchTerm }: SearchBarComponentProps) {
    return (
        <div className="d-flex mb-4 gap-2">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <i className="bi bi-search text-muted"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0 ps-0 shadow-none"
              placeholder="Cerca cantiere per nome, città o note..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
    )
}