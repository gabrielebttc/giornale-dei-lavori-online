import { useEffect, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import './styles/RichTextEditorComponent.css';
import InsertImageComponent from './InsertImageComponent';

type RichTextEditorProps = {
  // content can be a JSON document or a stringified JSON
  value?: any;
  // onChange receives the tiptap JSON document
  onChange?: (doc: any) => void;
  placeholder?: string;
  editable?: boolean;
  buildingSiteId?: string;
};

export default function RichTextEditorComponent({
  value = '',
  onChange,
  placeholder = 'Inizia a scrivere qui...',
  editable = true,
  buildingSiteId,
}: RichTextEditorProps) {
  const [showImageModal, setShowImageModal] = useState(false);
    const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: 'https',
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    // value can be a JSON object or a string containing JSON
    content: typeof value === 'string' ? (value ? JSON.parse(value) : '') : value,
    editable,
    immediatelyRender: false,
    onUpdate: ({ editor: currentEditor }) => {
      onChange?.(currentEditor.getJSON());
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getJSON();
    const incoming = typeof value === 'string' ? (value ? JSON.parse(value) : null) : value;
    if (JSON.stringify(current) !== JSON.stringify(incoming)) {
      editor.commands.setContent(incoming || '', { emitUpdate: false });
    }
  }, [editor, value]);

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(editable);
  }, [editor, editable]);

  const setLink = () => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('Inserisci URL', previousUrl || 'https://');

    if (url === null) return;
    if (url.trim() === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  if (!editor) {
    return (
      <div className="rte-container border rounded-3 p-3 bg-white">
        <span className="text-muted small">Caricamento editor...</span>
      </div>
    );
  }

  return (
    <div className="rte-container border rounded-3 bg-white shadow-sm overflow-hidden">
      <div className="rte-toolbar d-flex flex-wrap gap-2 p-2 border-bottom bg-light">
        <button
          type="button"
          className={`btn btn-sm ${editor.isActive('bold') ? 'btn-primary' : 'btn-outline-secondary'}`}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          B
        </button>
        <button
          type="button"
          className={`btn btn-sm ${editor.isActive('italic') ? 'btn-primary' : 'btn-outline-secondary'}`}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          I
        </button>
        <button
          type="button"
          className={`btn btn-sm ${editor.isActive('underline') ? 'btn-primary' : 'btn-outline-secondary'}`}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          U
        </button>
        <button
          type="button"
          className={`btn btn-sm ${editor.isActive('heading', { level: 2 }) ? 'btn-primary' : 'btn-outline-secondary'}`}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </button>
        <button
          type="button"
          className={`btn btn-sm ${editor.isActive('bulletList') ? 'btn-primary' : 'btn-outline-secondary'}`}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          Lista
        </button>
        <button
          type="button"
          className={`btn btn-sm ${editor.isActive('orderedList') ? 'btn-primary' : 'btn-outline-secondary'}`}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          Lista num
        </button>
        <button
          type="button"
          className={`btn btn-sm ${editor.isActive('link') ? 'btn-primary' : 'btn-outline-secondary'}`}
          onClick={setLink}
        >
          Link
        </button>
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary"
          onClick={() => setShowImageModal(true)}
        >
          Immagini
        </button>
        <button
          type="button"
          className="btn btn-sm btn-outline-danger"
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
        >
          Pulisci
        </button>
      </div>

      <EditorContent editor={editor} className="rte-content" />

      {showImageModal && (
        <InsertImageComponent
          buildingSiteId={buildingSiteId ?? ''}
          onClose={() => setShowImageModal(false)}
          onComplete={(results) => {
            // insert each image into the editor as an image node including storageKey in attrs
            results.forEach((r) => {
              // use insertContent with a raw node object to include custom attrs (storageKey)
              editor.chain().focus().insertContent({ type: 'image', attrs: { src: r.downloadUrl, storageKey: r.storageKey } } as any).run();
            });
            // ensure parent receives the updated JSON (force immediate sync)
            try {
              const doc = editor.getJSON();
              console.debug('Inserted images, editor JSON now:', doc);
              onChange?.(doc);
            } catch (err) {
              console.warn('Failed to emit editor JSON after insert:', err);
            }
            setShowImageModal(false);
          }}
        />
      )}
    </div>
  );
}
