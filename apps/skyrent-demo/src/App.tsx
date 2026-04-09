import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
  AddressForm,
  PhoneInput,
  SelfieCapture,
  type IdentityAddress,
} from "@identity-verification/sdk";
import "./App.css";

type DemoFormValues = {
  selfie: string;
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
      selfie: "",
      phone: "",
      address: EMPTY_ADDRESS,
    },
  });
  const selfieValue = useWatch({ control, name: "selfie" });
  const phoneValue = useWatch({ control, name: "phone" });
  const addressValue = useWatch({ control, name: "address" });
  const onSubmit = (values: DemoFormValues) => {
    setSubmitted(values);
  };

  return (
    <main className="demo-page">
      <form onSubmit={handleSubmit(onSubmit)}>
        <section className="demo-card">
          <h1>Selfie capture</h1>
          <p>
            Start the camera, align your face in the oval, then capture. The
            value is stored as a JPEG data URL for <code>IdentityInputs</code>.
          </p>
          <Controller
            name="selfie"
            control={control}
            render={({ field }) => (
              <SelfieCapture
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
              />
            )}
          />
          <div className="result">
            <strong>Selfie:</strong>{" "}
            {selfieValue
              ? `Captured (${Math.round(selfieValue.length / 1024)} KB data URL)`
              : "(none yet)"}
          </div>
        </section>

        <section className="demo-card">
          <h1>Phone Input Demo</h1>
          <p>
            SDK validation is on: invalid numbers while typing and blur checks
            (including required) use the default component behavior.
          </p>

          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <>
                <PhoneInput
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  validateOnBlur
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
            SDK validation is on: required-field messages appear on blur; values
            still flow to the form on every change.
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
                  validateOnBlur
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
