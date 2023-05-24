import  { useEffect, useRef } from 'react';
type EditorProps ={
  onChangeEditor?: (data: string ) => void;
}

function CustomEditor({onChangeEditor}: EditorProps): JSX.Element {
  const editorRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    let editor: CKEDITOR.editor | undefined;

    const initializeEditor = () => {
      if (window.CKEDITOR && editorRef.current) {
        editor = window.CKEDITOR.replace(editorRef.current);
        // Customize the editor configuration as needed
        // editor.config.someConfigOption = 'value';
        // editor.config.somePluginOption = true;

        editor.on('change', () => {
          const data = editor?.getData();
         if(onChangeEditor) onChangeEditor(data || " ");
          // console.log(data);
          // Handle the editor data
        });
      }
    };

    initializeEditor();

    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, []);

  return <textarea ref={editorRef} />;
}

export default CustomEditor;
