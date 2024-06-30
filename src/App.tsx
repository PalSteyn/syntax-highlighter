import React from "react";
import "./App.css";
import CodeEditor from "./CodeEditor/CodeEditor";
import Footer from "./Footer/Footer";

function App() {
  return (
    <div>
      <h3 className="title">Simple Code Editor</h3>
      <CodeEditor />
      <Footer />
    </div>
  );
}

export default App;
