import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AddressForm,
  isValidPhoneE164,
  PhoneInput,
  SelfieCapture,
  validateAddress,
  type IdentityAddress,
  type IdentityInputs,
} from "@identity-verification/sdk";
import "../browse/BrowsePage.css";
import { ROUTES } from "../../routing/routes";
import { verifyIdentity } from "../../services/verifyIdentity";
import { VERIFICATION_ACTIONS } from "../../state/verification/verification.types";
import { useVerification } from "../../state/verification/verification.hooks";

const EMPTY_ADDRESS: IdentityAddress = {
  street: "",
  city: "",
  state: "",
  country: "",
  postalCode: "",
};

const initialDraft: IdentityInputs = {
  selfieUrl: "",
  phone: "",
  address: { ...EMPTY_ADDRESS },
};

type Step = 1 | 2 | 3;

function isStepSatisfied(step: Step, draft: IdentityInputs): boolean {
  switch (step) {
    case 1:
      return Boolean(draft.selfieUrl.trim());
    case 2:
      return isValidPhoneE164(draft.phone);
    case 3:
      return Object.keys(validateAddress(draft.address)).length === 0;
    default:
      return false;
  }
}

function isFullDraftReady(draft: IdentityInputs): boolean {
  return (
    isStepSatisfied(1, draft) &&
    isStepSatisfied(2, draft) &&
    isStepSatisfied(3, draft)
  );
}

export function VerificationPage() {
  const navigate = useNavigate();
  const { dispatch } = useVerification();
  const [step, setStep] = useState<Step>(1);
  const [draft, setDraft] = useState<IdentityInputs>(initialDraft);

  const goNext = () => {
    if (step < 3) {
      setStep((s) => (s + 1) as Step);
    }
  };

  const goBack = () => {
    if (step > 1) {
      setStep((s) => (s - 1) as Step);
    }
  };

  const runVerification = () => {
    if (!isFullDraftReady(draft)) {
      return;
    }
    const result = verifyIdentity(draft);
    dispatch({ type: VERIFICATION_ACTIONS.SET, payload: result });
    navigate(ROUTES.result);
  };

  return (
    <main className="demo-page">
      <h1 className="page-title">Identity verification</h1>
      <p className="page-subtitle">
        Step {step} of 3 — selfie, then phone, then address.
      </p>

      <section className="demo-card">
        {step === 1 ? (
          <>
            <h2>Selfie</h2>
            <p className="muted">
              Capture a photo. Continue when you have a valid capture.
            </p>
            <SelfieCapture
              value={draft.selfieUrl}
              onChange={(selfieUrl) =>
                setDraft((prevState) => ({ ...prevState, selfieUrl }))
              }
            />
          </>
        ) : null}

        {step === 2 ? (
          <>
            <h2>Phone</h2>
            <p className="muted">Enter a valid number</p>
            <PhoneInput
              value={draft.phone}
              onChange={(phone) =>
                setDraft((prevState) => ({ ...prevState, phone }))
              }
            />
          </>
        ) : null}

        {step === 3 ? (
          <>
            <h2>Address</h2>
            <p className="muted">All fields are required.</p>
            <AddressForm
              value={draft.address}
              onChange={(address) =>
                setDraft((prevState) => ({ ...prevState, address }))
              }
            />
          </>
        ) : null}

        <div className="button-row button-row--spaced">
          {step > 1 ? (
            <button type="button" onClick={goBack}>
              Back
            </button>
          ) : null}
          {step < 3 ? (
            <button
              type="button"
              onClick={goNext}
              disabled={!isStepSatisfied(step, draft)}
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={runVerification}
              disabled={!isFullDraftReady(draft)}
            >
              Run verification
            </button>
          )}
        </div>
      </section>
    </main>
  );
}
