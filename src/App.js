import React, { useState } from "react";
import "./App.css";
import MeasurementForm from "./components/MeasurementForm";
import UseManualContext from "./context/useManualContext";

function App() {
  const [useManual, setUseManual] = useState(false);
  const [useAPIflag, setAPIflag] = useState(false);

  return (
    <div className="App">
      <UseManualContext.Provider
        value={{
          useManual,
          setUseManual,
          useAPIflag,
          setAPIflag,
        }}
      >
        <header className="App-header">
          <MeasurementForm />
        </header>
      </UseManualContext.Provider>
    </div>
  );
}

export default App;
