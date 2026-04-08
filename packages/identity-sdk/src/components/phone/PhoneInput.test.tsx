import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
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

  it("shows validation error on invalid blur", () => {
    const onChange = vi.fn();
    render(<PhoneInput onChange={onChange} />);
    const phoneInput = screen.getByLabelText("Phone number");

    fireEvent.change(phoneInput, {
      target: { value: "12" },
    });
    fireEvent.blur(phoneInput);

    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Please enter a valid phone number.",
    );
  });
});
