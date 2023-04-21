import React, { useContext, useEffect, useState } from "react";
import UseManualContext from "../context/useManualContext";
import "./WaistOptions.css";

function WaistOptions({
  waistOptions,
  onSubmit,
  setMessage,
  waistError,
  setWaistError,
}) {
  const [selectedWaist, setSelectedWaist] = useState("");
  const [manualWaist, setManualWaist] = useState("");
  const { useManual, setUseManual, useAPIflag } = useContext(UseManualContext);

  const waistRegex =
    /^(?!0(\.0{1,2})?$)(150(\.00)?|1[0-4]\d?|[1-9]\d?)(\.\d{1,2})?$/;

  const isManualWaistValid = () => {
    const waistValid = waistRegex.test(manualWaist);
    return waistValid;
  };

  useEffect(() => {
    if (waistOptions && waistOptions.length > 0) {
      setSelectedWaist(waistOptions[0]);
    } else {
      setSelectedWaist(null);
    }
  }, [waistOptions]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (useManual && !isManualWaistValid()) {
      setWaistError("Waist measurement entered is not valid!");
      return;
    } else {
      setWaistError("");
    }

    const waist =
      useManual && manualWaist.length > 0 ? manualWaist : selectedWaist;
    setManualWaist("");
    onSubmit(waist);
  };

  return (
    <div className="waist-options-container">
      {useAPIflag && (
        <form onSubmit={handleSubmit}>
          {waistOptions.length > 0 && (
            <div>
              <label>
                Waist options:
                <select
                  value={selectedWaist}
                  onChange={(e) => setSelectedWaist(e.target.value)}
                >
                  {waistOptions.map((waist, index) => (
                    <option key={`waist_${index}`} value={waist}>
                      {waist}
                    </option>
                  ))}
                </select>
              </label>
              <br />
            </div>
          )}

          <label>
            <input
              type="checkbox"
              checked={useManual}
              onChange={() => setUseManual(!useManual)}
            />
            Enter waist manually
          </label>
          <br />
          {useManual && (
            <label>
              Waist (cm):
              <input
                type="number"
                step="0.01"
                value={manualWaist}
                onChange={(e) => setManualWaist(e.target.value)}
              />
            </label>
          )}
          {useManual && (
            <span className={waistError ? "input-error" : "hidden-message"}>
              {waistError}
            </span>
          )}
          <br />
          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
}

export default WaistOptions;
