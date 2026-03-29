import { useEffect, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageWithStorageKey from './extensions/ImageWithStorageKey';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import './styles/RichTextEditorComponent.css';
import InsertImageComponent from './InsertImageComponent';

type RichTextEditorProps = {
  value?: any;
  onChange?: (doc: any) => void;
  placeholder?: string;
  editable?: boolean;
  buildingSiteId?: string;
};

type ToolbarButtonProps = {
  onClick: () => void;
  active?: boolean;
  danger?: boolean;
  title: string;
  children: React.ReactNode;
};

function ToolbarButton({ onClick, active, danger, title, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={title}
      className={`rte-btn${active ? ' active' : ''}${danger ? ' danger' : ''}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function Sep() {
  return <div className="rte-sep" />;
}

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
      ImageWithStorageKey,
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: 'https',
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: typeof value === 'string' ? (value ? JSON.parse(value) : '') : value,
    editable,
    immediatelyRender: false,
    onUpdate: ({ editor: e }) => onChange?.(e.getJSON()),
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
    const prev = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('Inserisci URL', prev || 'https://');
    if (url === null) return;
    if (url.trim() === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  if (!editor) {
    return (
      <div className="rte-container" style={{ padding: '1.5rem', color: '#bbb', fontSize: '0.9rem' }}>
        Caricamento editor...
      </div>
    );
  }

  return (
    <div className="rte-container">
      {editable && (
        <div className="rte-toolbar">
          {/* Headings */}
          <ToolbarButton
            title="Titolo 1"
            active={editor.isActive('heading', { level: 1 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          >
            <span className="rte-btn-label">H1</span>
          </ToolbarButton>
          <ToolbarButton
            title="Titolo 2"
            active={editor.isActive('heading', { level: 2 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          >
            <span className="rte-btn-label">H2</span>
          </ToolbarButton>
          <ToolbarButton
            title="Titolo 3"
            active={editor.isActive('heading', { level: 3 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          >
            <span className="rte-btn-label">H3</span>
          </ToolbarButton>

          <Sep />

          {/* Formattazione testo */}
          <ToolbarButton
            title="Grassetto"
            active={editor.isActive('bold')}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <i className="bi bi-type-bold" />
          </ToolbarButton>
          <ToolbarButton
            title="Corsivo"
            active={editor.isActive('italic')}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <i className="bi bi-type-italic" />
          </ToolbarButton>
          <ToolbarButton
            title="Sottolineato"
            active={editor.isActive('underline')}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <i className="bi bi-type-underline" />
          </ToolbarButton>
          <ToolbarButton
            title="Barrato"
            active={editor.isActive('strike')}
            onClick={() => editor.chain().focus().toggleStrike().run()}
          >
            <i className="bi bi-type-strikethrough" />
          </ToolbarButton>

          <Sep />

          {/* Liste */}
          <ToolbarButton
            title="Elenco puntato"
            active={editor.isActive('bulletList')}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <i className="bi bi-list-ul" />
          </ToolbarButton>
          <ToolbarButton
            title="Elenco numerato"
            active={editor.isActive('orderedList')}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <i className="bi bi-list-ol" />
          </ToolbarButton>

          <Sep />

          {/* Blocchi */}
          <ToolbarButton
            title="Citazione"
            active={editor.isActive('blockquote')}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            <i className="bi bi-blockquote-left" />
          </ToolbarButton>
          <ToolbarButton
            title="Codice"
            active={editor.isActive('code')}
            onClick={() => editor.chain().focus().toggleCode().run()}
          >
            <i className="bi bi-code-slash" />
          </ToolbarButton>

          <Sep />

          {/* Link e immagini */}
          <ToolbarButton
            title="Inserisci link"
            active={editor.isActive('link')}
            onClick={setLink}
          >
            <i className="bi bi-link-45deg" />
          </ToolbarButton>
          <ToolbarButton
            title="Inserisci immagine"
            onClick={() => setShowImageModal(true)}
          >
            <i className="bi bi-image" />
          </ToolbarButton>

          <Sep />

          {/* Pulisci */}
          <ToolbarButton
            title="Rimuovi formattazione"
            danger
            onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
          >
            <i className="bi bi-eraser" />
          </ToolbarButton>
        </div>
      )}

      <EditorContent editor={editor} className="rte-content" />

      {showImageModal && (
        <InsertImageComponent
          buildingSiteId={buildingSiteId ?? ''}
          onClose={() => setShowImageModal(false)}
          onComplete={(results) => {
            results.forEach((r) => {
              editor.chain().focus().insertContent({
                type: 'image',
                attrs: { src: r.downloadUrl, storageKey: r.storageKey },
              } as any).run();
            });
            try {
              onChange?.(editor.getJSON());
            } catch { /* ignore */ }
            setShowImageModal(false);
          }}
        />
      )}
    </div>
  );
}
