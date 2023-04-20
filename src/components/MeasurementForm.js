import React, { useState } from "react";
import axios from "axios";
import WaistOptions from "./WaistOptions";
import config from "../config";

function MeasurementForm() {
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [waistOptions, setWaistOptions] = useState([]);
  const [message, setMessage] = useState("");

  // Function to handle the 'Find waist measurement' button click
  const findWaistMeasurement = async () => {
    if (!height || !age || !weight) {
      setMessage("Field cannot be empty");
      return;
    }

    // Make GET request to measurements class in views.py
    await axios
      .get(`${config.BASE_URL}/measurements/`, {
        params: { height, age, weight },
      })
      .then((response) => {
        if (response.data.length > 0) {
          setWaistOptions(response.data.sort());
          setMessage("");
        } else {
          setWaistOptions([]);
          setMessage("No waist ranges found");
        }
      });
  };

  // Function to handle the 'Submit' button click
  const handleSubmit = async (waist) => {
    await axios
      .post(`${config.BASE_URL}/measurements/`, {
        height,
        age,
        weight,
        waist,
      })
      .then((response) => {
        if (response.data.status === "SUCCESS") {
          setMessage("Record has been stored");
        } else {
          setMessage("Record already exists");
        }
      });
  };

  return (
    <div>
      <h1>Measurement Form</h1>
      <label>
        Height (cm):
        <input
          type="number"
          step="0.01"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
        />
      </label>
      <br />
      <label>
        Age (years):
        <input
          type="number"
          step="0.01"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
      </label>
      <br />
      <label>
        Weight (kg):
        <input
          type="number"
          step="0.01"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
      </label>
      <br />
      <button onClick={findWaistMeasurement}>Find waist measurement</button>
      <p>{message}</p>
      {waistOptions.length > 0 && (
        <WaistOptions
          waistOptions={waistOptions}
          onSubmit={handleSubmit}
          setMessage={setMessage}
        />
      )}
    </div>
  );
}

export default MeasurementForm;
