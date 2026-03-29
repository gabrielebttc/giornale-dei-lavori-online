import Image from '@tiptap/extension-image';

/**
 * Estende l'extension Image di TipTap aggiungendo l'attributo `storageKey`.
 *
 * Flusso immagini:
 * - Inserimento: { src: presignedUrl (temporaneo), storageKey: 'uploads/uuid-siteX.jpg' }
 * - Salvataggio nel DB: src viene sostituito con storageKey (link permanente)
 * - Caricamento dal DB: storageKey viene risolto in un presignedUrl fresco
 *
 * Senza questa estensione TipTap scarta `storageKey` da getJSON(),
 * rendendo impossibile rigenerare il link dopo la scadenza.
 */
const ImageWithStorageKey = Image.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            storageKey: {
                default: null,
                parseHTML: (element) => element.getAttribute('data-storage-key') || null,
                renderHTML: (attrs) =>
                    attrs.storageKey ? { 'data-storage-key': attrs.storageKey } : {},
            },
        };
    },
});

export default ImageWithStorageKey;
