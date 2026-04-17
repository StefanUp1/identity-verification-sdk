import { createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { AddressForm, type AddressFormProps } from "../components/address/AddressForm.js";
import { PhoneInput, type PhoneInputProps } from "../components/phone/PhoneInput.js";
import { SelfieCapture } from "../components/selfie/SelfieCapture.js";
import type { IdentityAddress } from "../types.js";

/**
 * React -> Web Components bridge:
 * - keeps React components as implementation base
 * - exposes DOM custom elements for non-React hosts (Vue/Angular/plain HTML)
 */
/**
 * Host usage example:
 *
 *   import { defineIdentitySdkElements } from "@identity-verification/sdk/web-components";
 *   defineIdentitySdkElements();
 *
 *   <idsdk-phone-input id="phone"></idsdk-phone-input>
 *   document.getElementById("phone")?.addEventListener("idsdk-change", (event) => {
 *     const value = (event as CustomEvent<string>).detail;
 *     // store in host state
 *   });
 *
 * Integration model:
 * - Inbound data: attributes/properties -> React props
 * - Outbound data: React callbacks -> CustomEvents (`idsdk-change`, `idsdk-blur`)
 */
function parseBooleanAttribute(
  raw: string | null,
  defaultValue: boolean,
): boolean {
  if (raw === null) {
    return defaultValue;
  }
  if (raw === "" || raw.toLowerCase() === "true") {
    return true;
  }
  if (raw.toLowerCase() === "false") {
    return false;
  }
  return defaultValue;
}

function parseJsonAttribute<T>(raw: string | null): T | undefined {
  if (!raw) {
    return undefined;
  }
  try {
    return JSON.parse(raw) as T;
  } catch {
    return undefined;
  }
}

class ReactBridgeElement extends HTMLElement {
  private root: Root | null = null;
  private mountNode: HTMLDivElement | null = null;

  protected connectRoot() {
    if (this.root) {
      return;
    }
    // Each custom element owns a dedicated React root mounted in light DOM.
    this.mountNode = document.createElement("div");
    this.appendChild(this.mountNode);
    this.root = createRoot(this.mountNode);
  }

  protected disconnectRoot() {
    // Mirror custom-element lifecycle: tear down React tree when element leaves DOM.
    this.root?.unmount();
    this.root = null;
    this.mountNode?.remove();
    this.mountNode = null;
  }

  protected renderElement(element: ReturnType<typeof createElement>) {
    // Always render through one root so property/attribute updates are diffed by React.
    this.connectRoot();
    this.root?.render(element);
  }
}

class AddressFormElement extends ReactBridgeElement {
  private valueProp: IdentityAddress | undefined;
  private defaultValueProp: Partial<IdentityAddress> | undefined;
  private errorsProp: AddressFormProps["errors"] | undefined;

  static get observedAttributes() {
    // Attribute changes must trigger React re-render so non-React hosts stay in sync.
    return ["value", "default-value", "errors", "show-sdk-errors", "validate-on-blur", "class-name"];
  }

  set value(next: IdentityAddress | undefined) {
    // Property updates should be equivalent to attribute updates for host ergonomics.
    this.valueProp = next;
    this.render();
  }

  set defaultValue(next: Partial<IdentityAddress> | undefined) {
    this.defaultValueProp = next;
    this.render();
  }

  set errors(next: AddressFormProps["errors"] | undefined) {
    this.errorsProp = next;
    this.render();
  }

  connectedCallback() {
    this.render();
  }

  disconnectedCallback() {
    this.disconnectRoot();
  }

  attributeChangedCallback() {
    this.render();
  }

  private render() {
    if (!this.isConnected) {
      return;
    }

    // Resolution rule: explicit property value wins over attribute payload.
    const value =
      this.valueProp ?? parseJsonAttribute<IdentityAddress>(this.getAttribute("value"));
    const defaultValue =
      this.defaultValueProp ??
      parseJsonAttribute<Partial<IdentityAddress>>(this.getAttribute("default-value"));
    const errors =
      this.errorsProp ??
      parseJsonAttribute<AddressFormProps["errors"]>(this.getAttribute("errors"));

    const showSdkErrors = parseBooleanAttribute(
      this.getAttribute("show-sdk-errors"),
      true,
    );
    const validateOnBlur = parseBooleanAttribute(
      this.getAttribute("validate-on-blur"),
      true,
    );
    const className = this.getAttribute("class-name") ?? undefined;

    this.renderElement(
      createElement(AddressForm, {
        value,
        defaultValue,
        errors,
        showSdkErrors,
        validateOnBlur,
        className,
        onChange: (address) => {
          // Framework-neutral integration event for host listeners.
          this.dispatchEvent(
            new CustomEvent("idsdk-change", {
              detail: address,
              bubbles: true,
              composed: true,
            }),
          );
        },
        onBlur: () => {
          // Bubble + composed ensures listeners can catch events above framework boundaries.
          this.dispatchEvent(
            new CustomEvent("idsdk-blur", {
              bubbles: true,
              composed: true,
            }),
          );
        },
      }),
    );
  }
}

class PhoneInputElement extends ReactBridgeElement {
  private valueProp: string | undefined;
  private defaultValueProp: string | undefined;
  private errorProp: string | undefined;

  static get observedAttributes() {
    return ["value", "default-value", "default-country", "error", "show-sdk-errors", "validate-on-blur", "class-name"];
  }

  set value(next: string | undefined) {
    this.valueProp = next;
    this.render();
  }

  set defaultValue(next: string | undefined) {
    this.defaultValueProp = next;
    this.render();
  }

  set error(next: string | undefined) {
    this.errorProp = next;
    this.render();
  }

  connectedCallback() {
    this.render();
  }

  disconnectedCallback() {
    this.disconnectRoot();
  }

  attributeChangedCallback() {
    this.render();
  }

  private render() {
    if (!this.isConnected) {
      return;
    }

    // String-based fields can come directly from attributes without JSON parsing.
    const value = this.valueProp ?? this.getAttribute("value") ?? undefined;
    const defaultValue =
      this.defaultValueProp ?? this.getAttribute("default-value") ?? undefined;
    const defaultCountry = this.getAttribute("default-country") ?? undefined;
    const error = this.errorProp ?? this.getAttribute("error") ?? undefined;
    const showSdkErrors = parseBooleanAttribute(
      this.getAttribute("show-sdk-errors"),
      true,
    );
    const validateOnBlur = parseBooleanAttribute(
      this.getAttribute("validate-on-blur"),
      true,
    );
    const className = this.getAttribute("class-name") ?? undefined;

    this.renderElement(
      createElement(PhoneInput, {
        value,
        defaultValue,
        defaultCountry: defaultCountry as PhoneInputProps["defaultCountry"],
        error,
        showSdkErrors,
        validateOnBlur,
        className,
        onChange: (phoneE164) => {
          // Keep event contract consistent across all idsdk-* elements.
          this.dispatchEvent(
            new CustomEvent("idsdk-change", {
              detail: phoneE164,
              bubbles: true,
              composed: true,
            }),
          );
        },
        onBlur: () => {
          this.dispatchEvent(
            new CustomEvent("idsdk-blur", {
              bubbles: true,
              composed: true,
            }),
          );
        },
      }),
    );
  }
}

class SelfieCaptureElement extends ReactBridgeElement {
  private valueProp: string | undefined;
  private defaultValueProp: string | undefined;
  private errorProp: string | undefined;

  static get observedAttributes() {
    return ["value", "default-value", "error", "disabled", "class-name"];
  }

  set value(next: string | undefined) {
    this.valueProp = next;
    this.render();
  }

  set defaultValue(next: string | undefined) {
    this.defaultValueProp = next;
    this.render();
  }

  set error(next: string | undefined) {
    this.errorProp = next;
    this.render();
  }

  connectedCallback() {
    this.render();
  }

  disconnectedCallback() {
    this.disconnectRoot();
  }

  attributeChangedCallback() {
    this.render();
  }

  private render() {
    if (!this.isConnected) {
      return;
    }

    const value = this.valueProp ?? this.getAttribute("value") ?? undefined;
    const defaultValue =
      this.defaultValueProp ?? this.getAttribute("default-value") ?? undefined;
    const error = this.errorProp ?? this.getAttribute("error") ?? undefined;
    const disabled = parseBooleanAttribute(this.getAttribute("disabled"), false);
    const className = this.getAttribute("class-name") ?? undefined;

    this.renderElement(
      createElement(SelfieCapture, {
        value,
        defaultValue,
        error,
        disabled,
        className,
        onChange: (selfieUrl) => {
          // For selfies, detail is the captured data URL string.
          this.dispatchEvent(
            new CustomEvent("idsdk-change", {
              detail: selfieUrl,
              bubbles: true,
              composed: true,
            }),
          );
        },
        onBlur: () => {
          this.dispatchEvent(
            new CustomEvent("idsdk-blur", {
              bubbles: true,
              composed: true,
            }),
          );
        },
      }),
    );
  }
}

export type DefineIdentitySdkElementsOptions = {
  /** Prefix used for custom element tags. Default: `idsdk`. */
  prefix?: string;
};

export function defineIdentitySdkElements(
  options: DefineIdentitySdkElementsOptions = {},
) {
  const prefix = options.prefix ?? "idsdk";
  // Tag prefix keeps registrations isolated and avoids name collisions.
  const definitions: Array<[string, CustomElementConstructor]> = [
    [`${prefix}-address-form`, AddressFormElement],
    [`${prefix}-phone-input`, PhoneInputElement],
    [`${prefix}-selfie-capture`, SelfieCaptureElement],
  ];

  definitions.forEach(([tag, ctor]) => {
    // Idempotent registration so hosts can safely call this more than once.
    if (!customElements.get(tag)) {
      customElements.define(tag, ctor);
    }
  });
}

export type AddressFormChangeDetail = IdentityAddress;
export type PhoneInputChangeDetail = string;
export type SelfieCaptureChangeDetail = string;

declare global {
  interface HTMLElementTagNameMap {
    "idsdk-address-form": AddressFormElement;
    "idsdk-phone-input": PhoneInputElement;
    "idsdk-selfie-capture": SelfieCaptureElement;
  }
}
