import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
  AddressForm,
  PhoneInput,
  type IdentityAddress,
} from "@identity-verification/sdk";
import "./App.css";

type DemoFormValues = {
  phone: string;
  address: IdentityAddress;
};

const EMPTY_ADDRESS: IdentityAddress = {
  street: "",
  city: "",
  state: "",
  country: "",
  postalCode: "",
};

function App() {
  const [submitted, setSubmitted] = useState<DemoFormValues | null>(null);
  const { control, handleSubmit } = useForm<DemoFormValues>({
    defaultValues: {
      phone: "",
      address: EMPTY_ADDRESS,
    },
  });
  const phoneValue = useWatch({ control, name: "phone" });
  const addressValue = useWatch({ control, name: "address" });
  const onSubmit = (values: DemoFormValues) => {
    setSubmitted(values);
  };

  return (
    <main className="demo-page">
      <form onSubmit={handleSubmit(onSubmit)}>
        <section className="demo-card">
          <h1>Phone Input Demo</h1>
          <p>Use this form to visually test validation and E.164 output.</p>

          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <>
                <PhoneInput
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              </>
            )}
          />

          <div className="result">
            <strong>Current value:</strong> {phoneValue || "(none yet)"}
          </div>
        </section>

        <section className="demo-card">
          <h1>Address Form Demo</h1>
          <p>
            Use this form to visually test required fields and payload updates.
          </p>

          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <>
                <AddressForm
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              </>
            )}
          />

          <div className="result">
            <strong>Current value:</strong> {JSON.stringify(addressValue)}
          </div>
        </section>
        <section className="demo-card">
          <button type="submit">Submit</button>
          <div className="result">
            <strong>Submitted payload:</strong>{" "}
            {submitted
              ? JSON.stringify(submitted)
              : "(submit form to see payload)"}
          </div>
        </section>
      </form>
    </main>
  );
}

export default App;
