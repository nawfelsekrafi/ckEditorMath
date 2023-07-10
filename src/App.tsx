import useCustomEditor from './useCustomEditor';

function App(): JSX.Element {
  // when you pass a value to the editor that is coming from backend, it works Example, initialValue: `${selectedQuestion.description}`,

  const { editorRef: editorRef1 } = useCustomEditor({
    initialValue: ``,
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
