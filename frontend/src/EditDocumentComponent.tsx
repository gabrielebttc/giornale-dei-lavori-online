import { useEffect, useState } from 'react';
import RichTextEditorComponent from './RichTextEditorComponent';

type EditDocumentComponentProps = {
    documentAlreadyExist: boolean;
};

export default function EditDocumentComponent({ documentAlreadyExist }: EditDocumentComponentProps) {
    const [content, setContent] = useState<string>('');

    useEffect(() => {
        if (documentAlreadyExist) {
            // Placeholder: qui potrai caricare in futuro il contenuto esistente dal backend.
            setContent('<p>Documento gia esistente: puoi modificarlo qui.</p>');
            return;
        }

        setContent('<h2>Nuovo documento</h2><p>Inizia a scrivere...</p>');
    }, [documentAlreadyExist]);

    return (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div className="bg-primary bg-gradient p-3 text-white">
                <h5 className="mb-0 d-flex align-items-center">
                    <i className="bi bi-file-earmark-richtext me-2" />
                    Modifica documento
                </h5>
            </div>

            <div className="card-body p-3 p-md-4">
                <RichTextEditorComponent
                    value={content}
                    onChange={setContent}
                    placeholder="Scrivi il contenuto del documento..."
                />

                <div className="mt-3 small text-muted">
                    Lunghezza HTML attuale: {content.length} caratteri
                </div>
            </div>
        </div>
    );
}