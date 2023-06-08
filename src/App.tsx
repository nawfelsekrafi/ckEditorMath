
import React from 'react';
import CustomEditor from './CustomEditor';

declare const MathJax: {
  Hub: {
    Queue: (tasks: any[]) => void;
  };
};


function App(): JSX.Element {
  const [data, setData] = React.useState<string>('');
  const equationRef = React.useRef<HTMLDivElement>(null);
 
 const handleEditorChange = (data: string ) => {
  
  console.log(data);
  setData(data);
 }
 React.useEffect(() => {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/MathJax.js?config=TeX-AMS_HTML';

  script.onload = () => {
    MathJax.Hub.Queue(['Typeset', MathJax.Hub, equationRef.current]);
  };

  document.head.appendChild(script);

  return () => {
    document.head.removeChild(script);
  };
}, [data]);




  return<> <CustomEditor onChangeEditor={handleEditorChange} />
  <div>
  <h3>Editor Output:</h3>
  {/* {data} */}
</div></>;
}

export default App;
