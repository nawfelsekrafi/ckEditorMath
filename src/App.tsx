import useCustomEditor from './useCustomEditor';

function App(): JSX.Element {
  const { editorRef: editorRef1 } = useCustomEditor({
    initialValue: String.raw``,
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
