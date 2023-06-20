import React from 'react';
import useCustomEditor from './useCustomEditor';

function App(): JSX.Element {
  const { editorRef: editorRef1 } = useCustomEditor({
    initialValue: String.raw` <p><span class="math-tex">\(x=-b\pm\sqrt{b^2-4ac}\frac{2}{a}-\ 7\)</span>Editor 1: Hello, World!</p>`,
    onChangeEditor: (data) => {
      console.log('Editor 1 data:', data);
    },
  });

  return (
    <div>
      <textarea ref={editorRef1} />
    </div>
  );
}

export default App;
