import { useState } from "react";
import {
  AddressForm,
  PhoneInput,
  type IdentityAddress,
} from "@identity-verification/sdk";
import "./App.css";

function App() {
  const [phoneValue, setPhoneValue] = useState("");
  const [addressValue, setAddressValue] = useState<IdentityAddress | null>(
    null,
  );

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

      <section className="demo-card">
        <h1>Address Form Demo</h1>
        <p>
          Use this form to visually test required fields and payload updates.
        </p>

        <AddressForm onChange={setAddressValue} />

        <div className="result">
          <strong>Current value:</strong>{" "}
          {addressValue ? JSON.stringify(addressValue) : "(none yet)"}
        </div>
      </section>
    </main>
  );
}

export default App;
