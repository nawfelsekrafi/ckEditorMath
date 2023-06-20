import { useEffect, useRef } from 'react';

type EditorProps = {
  initialValue?: string;
  onChangeEditor?: (data: string) => void;
};

type EditorHook = {
  editorRef: React.RefObject<HTMLTextAreaElement>;
};

declare global {
  interface Window {
    MathJax: any;
  }
}

function useCustomEditor({ initialValue = '', onChangeEditor }: EditorProps): EditorHook {
  const editorRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    let editor: CKEDITOR.editor | undefined;

    const initializeEditor = () => {
      if (window.CKEDITOR && editorRef.current) {
        editor = window.CKEDITOR.replace(editorRef.current);

        editor.on('change', () => {
          const data = editor?.getData();
          if (onChangeEditor) onChangeEditor(data || '');
        });

        // Set initial value
        editor.setData(initialValue, {
          callback: () => {
            // Delay MathJax rendering after setting the data
            setTimeout(() => {
              window.MathJax?.Hub.Queue(['Typeset', window.MathJax.Hub, editor!.editable().$]);
            }, 0);
          },
        });
      }
    };

    initializeEditor();

    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, [initialValue, onChangeEditor]);

  useEffect(() => {
    const handleMathJaxTypeset = () => {
      window.MathJax?.Hub.Queue(['Typeset', window.MathJax.Hub]);
    };

    if (window.MathJax) {
      handleMathJaxTypeset();
    } else {
      const script = document.createElement('script');
      script.src = '//cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/MathJax.js?config=TeX-AMS_HTML';
      script.async = true;
      script.onload = handleMathJaxTypeset;
      document.body.appendChild(script);
    }
  }, []);

  return { editorRef };
}

export default useCustomEditor;
