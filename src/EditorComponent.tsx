import React, { useEffect, useRef } from 'react';

interface EditorComponentProps {
  onEditorChange: (data: string | undefined) => void;
}

const EditorComponent: React.FC<EditorComponentProps> = ({ onEditorChange }) => {
  const editorRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    let editor: CKEDITOR.editor | undefined;

    const initializeEditor = () => {
      if (window.CKEDITOR && editorRef.current) {
        editor = window.CKEDITOR.replace(editorRef.current);
        editor.on('change', () => {
          const data = editor?.getData();
          onEditorChange(data);
          editor?.focus();
        });
      }
    };

    initializeEditor();

    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, [onEditorChange]);

  return <textarea ref={editorRef} />;
};

export default EditorComponent;
