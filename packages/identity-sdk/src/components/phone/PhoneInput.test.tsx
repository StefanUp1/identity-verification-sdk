import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PhoneInput } from "./PhoneInput";

describe("PhoneInput", () => {
  it("emits E.164 value for default Serbia country", () => {
    const onChange = vi.fn();
    render(<PhoneInput onChange={onChange} />);
    const phoneInput = screen.getByLabelText("Phone number");

    fireEvent.change(phoneInput, {
      target: { value: "641234567" },
    });

    expect(onChange).toHaveBeenCalledWith("+381641234567");
  });

  it("shows SDK validation error on invalid input while typing", () => {
    const onChange = vi.fn();
    render(<PhoneInput onChange={onChange} />);
    const phoneInput = screen.getByLabelText("Phone number");

    fireEvent.change(phoneInput, {
      target: { value: "12" },
    });

    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Please enter a valid phone number.",
    );
  });

  it("shows required error on blur when validateOnBlur is enabled", () => {
    const onChange = vi.fn();
    render(<PhoneInput onChange={onChange} validateOnBlur />);
    const phoneInput = screen.getByLabelText("Phone number");

    fireEvent.blur(phoneInput);

    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Phone number is required.",
    );
  });

  it("shows host error when error prop is set", () => {
    const onChange = vi.fn();
    render(
      <PhoneInput
        onChange={onChange}
        error="Phone is required for verification."
      />,
    );
    const phoneInput = screen.getByLabelText("Phone number");

    fireEvent.change(phoneInput, {
      target: { value: "12" },
    });

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Phone is required for verification.",
    );
  });

  it("does not show SDK copy when showSdkErrors is false", () => {
    const onChange = vi.fn();
    render(<PhoneInput onChange={onChange} showSdkErrors={false} />);
    const phoneInput = screen.getByLabelText("Phone number");

    fireEvent.change(phoneInput, {
      target: { value: "12" },
    });

    expect(onChange).not.toHaveBeenCalled();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("calls onChange with empty string when the user clears a valid number", () => {
    const onChange = vi.fn();
    render(<PhoneInput onChange={onChange} defaultCountry="US" />);
    const phoneInput = screen.getByLabelText("Phone number");

    fireEvent.change(phoneInput, {
      target: { value: "4155552671" },
    });
    expect(onChange).toHaveBeenLastCalledWith("+14155552671");

    fireEvent.change(phoneInput, { target: { value: "" } });
    expect(onChange).toHaveBeenLastCalledWith("");
  });
});
