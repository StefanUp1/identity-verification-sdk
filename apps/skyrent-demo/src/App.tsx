import { useState } from "react";
import { PhoneInput } from "@identity-verification/sdk";
import "./App.css";

function App() {
  const [phoneValue, setPhoneValue] = useState("");

  return (
    <main className="demo-page">
      <section className="demo-card">
        <h1>Phone Input Demo</h1>
        <p>Use this form to visually test validation and E.164 output.</p>

        <PhoneInput onChange={setPhoneValue} />

        <div className="result">
          <strong>Current value:</strong> {phoneValue || "(none yet)"}
        </div>
      </section>
    </main>
  );
}

export default App;
