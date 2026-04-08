import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AddressForm } from "./AddressForm";

describe("AddressForm", () => {
  it("shows required field error on blur when validateOnBlur is enabled", () => {
    const onChange = vi.fn();
    render(<AddressForm onChange={onChange} validateOnBlur />);

    fireEvent.blur(screen.getByLabelText("Street"));

    const alerts = screen.getAllByRole("alert");
    expect(alerts).toHaveLength(1);
    expect(alerts[0]).toHaveTextContent("Street is required.");
    expect(onChange).not.toHaveBeenCalled();
  });

  it("does not show SDK blur errors by default", () => {
    const onChange = vi.fn();
    render(<AddressForm onChange={onChange} />);

    fireEvent.blur(screen.getByLabelText("Street"));

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("prefers host errors over SDK blur errors", () => {
    const onChange = vi.fn();
    render(
      <AddressForm
        onChange={onChange}
        validateOnBlur
        errors={{ street: "Use your legal street line." }}
      />,
    );

    fireEvent.blur(screen.getByLabelText("Street"));

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Use your legal street line.",
    );
  });

  it("emits address payload when all required fields become valid", () => {
    const onChange = vi.fn();
    render(<AddressForm onChange={onChange} />);

    fireEvent.change(screen.getByLabelText("Street"), {
      target: { value: "Knez Mihailova 1" },
    });
    fireEvent.change(screen.getByLabelText("City"), {
      target: { value: "Belgrade" },
    });
    fireEvent.change(screen.getByLabelText("State"), {
      target: { value: "Belgrade" },
    });
    fireEvent.change(screen.getByLabelText("Country"), {
      target: { value: "Serbia" },
    });
    fireEvent.change(screen.getByLabelText("Postal code"), {
      target: { value: "11000" },
    });

    expect(onChange).toHaveBeenLastCalledWith({
      street: "Knez Mihailova 1",
      city: "Belgrade",
      state: "Belgrade",
      country: "Serbia",
      postalCode: "11000",
    });
  });
});
