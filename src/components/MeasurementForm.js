import React, { useCallback, useContext, useState } from "react";
import axios from "axios";
import WaistOptions from "./WaistOptions";
import config from "../config";
import UseManualContext from "../context/useManualContext";
import "./MeasurementForm.css";

function MeasurementForm() {
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [heightError, setHeightError] = useState("");
  const [ageError, setAgeError] = useState("");
  const [weightError, setWeightError] = useState("");
  const [waistError, setWaistError] = useState("");

  const [waistOptions, setWaistOptions] = useState([]);
  const [message, setMessage] = useState("");
  const [SuccessMessage, setSuccessMessage] = useState("");

  const { useAPIflag, setAPIflag, setUseManual } = useContext(UseManualContext);

  const heightRegex =
    /^(?!0(\.0{1,2})?$)(240|2[0-3][0-9]?|1\d{0,2}|[1-9]\d?)(\.\d{1,2})?$/;
  const ageRegex = /^(?!0(\.0{1,2})?$)(100|1[0-9]{1}|[1-9]\d?)(\.\d{1,2})?$/;
  const weightRegex = /^(?!0(\.0{1,2})?$)(120|1[0-1]\d?|[1-9]\d?)(\.\d{1,2})?$/;

  const isInputValid = () => {
    const heightValid = heightRegex.test(height);
    const ageValid = ageRegex.test(age);
    const weightValid = weightRegex.test(weight);

    setHeightError(heightValid ? "" : "Invalid Height");
    setAgeError(ageValid ? "" : "Invalid Age");
    setWeightError(weightValid ? "" : "Invalid Weight");
    return heightValid && ageValid && weightValid;
  };

  // Function to handle the 'Find waist measurement' button click

  const findWaistMeasurement = async () => {
    if (!isInputValid()) {
      setAPIflag(false);
      setMessage("");
      return;
    }

    // Make GET request to measurements class in views.py

    try {
      const response = await axios.get(`${config.BASE_URL}/measurements/`, {
        params: { height, age, weight },
      });
      // console.log("height:", height, "age: ", age, "weight:", weight);
      setAPIflag(true);
      setSuccessMessage("");
      setWaistError("");
      setUseManual(false);
      console.log(response);
      if (response.data.length > 0) {
        setWaistOptions(response.data.sort());
        console.log("Response data:", response.data);

        setMessage("");
      } else {
        setWaistOptions([]);
        setMessage("No waist ranges found!!!");
      }
      console.log(waistOptions);
    } catch (error) {
      setMessage("An error occured while featching the form.");
      console.log("GET FORM request failed with error: ", error);
    }
  };

  // Function to handle the 'Submit' button click

  const handleSubmit = async (waist) => {
    setUseManual(false);
    try {
      const response = await axios.post(`${config.BASE_URL}/measurements/`, {
        height,
        age,
        weight,
        waist,
      });

      if (response.data.status === "SUCCESS") {
        setAPIflag(false);
        setMessage("");
        setSuccessMessage("Record has been stored");
      } else {
        setAPIflag(false);
        setMessage("Record already exists");
      }
    } catch (error) {
      setAPIflag(false);
      setMessage("An error occured while sending the form.");
      console.log("Error during form submission:", error);
    }
  };

  const handleReset = () => {
    setHeight("");
    setAge("");
    setWeight("");
    setAPIflag(false);
    setMessage("");
    setSuccessMessage("");
  };
  return (
    <div className="measurement-form">
      <div className="measurement-form-container">
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
        <span className={heightError ? "input-error" : "hidden-message"}>
          {heightError}
        </span>
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
        <span className={ageError ? "input-error" : "hidden-message"}>
          {ageError}
        </span>
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
        <span className={weightError ? "input-error" : "hidden-message"}>
          {weightError}
        </span>
        <br />
        <button onClick={findWaistMeasurement}>Find waist measurement</button>
        {(message != "" || SuccessMessage != "") && (
          <button onClick={handleReset}> Reset Form</button>
        )}
        <p className={`${message ? "error-message" : "hidden-message"}`}>
          {message}
        </p>
        <p
          className={`${SuccessMessage ? "success-message" : "hidden-message"}`}
        >
          {SuccessMessage}
        </p>
      </div>

      <div>
        {waistOptions.length >= 0 && (
          <WaistOptions
            waistOptions={waistOptions}
            onSubmit={handleSubmit}
            setMessage={setMessage}
            waistError={waistError}
            setWaistError={setWaistError}
          />
        )}
      </div>
    </div>
  );
}

export default MeasurementForm;
