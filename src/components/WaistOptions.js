import React, { useEffect, useState } from "react";

function WaistOptions({ waistOptions, onSubmit, setMessage }) {
  const [selectedWaist, setSelectedWaist] = useState("");
  const [manualWaist, setManualWaist] = useState("");
  const [useManual, setUseManual] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const waist = useManual ? manualWaist : selectedWaist;
    onSubmit(waist);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {!useManual && (
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
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default WaistOptions;
