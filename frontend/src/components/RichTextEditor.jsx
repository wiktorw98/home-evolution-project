// frontend/src/components/RichTextEditor.jsx
'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { Link } from '@tiptap/extension-link'; 
import { TextStyle } from '@tiptap/extension-text-style'; 
import { Color } from '@tiptap/extension-color';
import styles from './RichTextEditor.module.css';
import { useCallback } from 'react';

const Toolbar = ({ editor }) => {
  if (!editor) return null;

  const setLink = useCallback(() => { /* ... (logika bez zmian) ... */ }, [editor]);

  return (
    <div className={styles.toolbar}>
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? styles.isActive : ''}><b>B</b></button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? styles.isActive : ''}><i>I</i></button>
      <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor.isActive('underline') ? styles.isActive : ''}><u>U</u></button>
      <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={editor.isActive('strike') ? styles.isActive : ''}><s>S</s></button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? styles.isActive : ''}>H2</button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={editor.isActive('heading', { level: 3 }) ? styles.isActive : ''}>H3</button>
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? styles.isActive : ''}>Lista</button>
      <button type="button" onClick={setLink} className={editor.isActive('link') ? styles.isActive : ''}>Link</button>
      
      {/* ZMIANA: Implementujemy technikę "konia trojańskiego" */}
      <div className={styles.colorButtonWrapper}>
        <span style={{ color: editor.getAttributes('textStyle').color }}>A</span>
        <input
          type="color"
          onInput={event => editor.chain().focus().setColor(event.target.value).run()}
          value={editor.getAttributes('textStyle').color || '#000000'}
          className={styles.colorInput}
          title="Zmień kolor tekstu"
        />
      </div>
    </div>
  );
};

export default function RichTextEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Underline,
      Link.configure({ openOnClick: false }),
      TextStyle,
      Color,
    ],
    content: value,
    editorProps: {
      attributes: {
        class: styles.editorContent,
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  return (
    <div className={styles.editorWrapper}>
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}