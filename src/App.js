import React, { useState } from "react";
import "./App.css";
import MeasurementForm from "./components/MeasurementForm";

function App() {
  const [useManual, setUseManual] = useState(false);

  return (
    <div className="App">
      <header className="App-header">
        <MeasurementForm />
      </header>
    </div>
  );
}

export default App;
