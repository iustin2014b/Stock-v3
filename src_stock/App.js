import React, { useEffect, useState, useRef } from "react";
import "./index.css";
import InputSymbol from "./Components/InputSymbol";
import ChartLine from "./Components/ChartLine";
import DropdownTime from "./Components/DropdownTime";
import getAPI from "./Components/helperAPI";
import getValues from "./Components/helperValues";
import getDates from "./Components/helperDates";

function App() {
  const [values, setValues] = useState(() => []);
  const [dates, setDates] = useState(() => []);
  const [companySymbol, setCompanySymbol] = useState("");
  const [intervalTime, setIntervalTime] = React.useState("hour");
  const [msg, setMsg] = useState("Enter a company symbol");
  //Use effect to triger fetch- function
  useEffect(() => {fetchStockDates();}, [companySymbol + intervalTime]);
  //Fetch function
  const fetchStockDates = async () => {
    const data = [];
    if (companySymbol.length > 1)
      try {
        const response = await fetch(getAPI(intervalTime, companySymbol));
        if (response.ok) {
          const data = await response.json();
          if (Object.keys(data)[0].indexOf("Meta Data") == 0) {
            setDates(getDates(data));
            setValues(getValues(data));
          } else setMsg("Error API");
        } else setMsg("Error response from site");
      } catch (error) {
        setMsg("Error fetch data");
        throw Error(error);
      }
  };
  //Button click handler
  function handleButtonClick() {
    setCompanySymbol(document.getElementById("inputBox").value);
    setIntervalTime(document.getElementById("dropboxTime").value);
    document.getElementById("inputBox").value = "";
  }
  //Text input change handler
  function handleChangeInput(e) {
    setCompanySymbol("");
    setMsg("Enter a company symbol");
  }
  //return from App
  return (
    <div>
      <DropdownTime />
      <InputSymbol
        onChange={handleChangeInput}
        onClick={handleButtonClick}
        companySymbol={companySymbol}
      />
      <p>${msg}</p>
      <ChartLine
        render={companySymbol.length != 0}
        dates={dates}
        values={values}
        valuesMax={values}
        valuesMin={values}
        inputName={companySymbol}
      />
    </div>
  );
}
export default App;