import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SelfieCapture } from "./SelfieCapture";

describe("SelfieCapture", () => {
  const originalMediaDevices = navigator.mediaDevices;

  // Restore the original media devices after each test.
  afterEach(() => {
    vi.restoreAllMocks();
    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: originalMediaDevices,
    });
  });

  it("shows an error when getUserMedia is not available", async () => {
    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: undefined,
    });

    render(<SelfieCapture onChange={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /start camera/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Camera is not available in this browser.",
    );
  });

  it("shows actionable guidance when camera permission is denied", async () => {
    const getUserMedia = vi.fn(() =>
      Promise.reject(new DOMException("Permission denied", "NotAllowedError")),
    );
    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: { getUserMedia },
    });

    render(<SelfieCapture onChange={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /start camera/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Camera access is blocked. Allow camera access in your browser site settings, then try again.",
    );
  });

  it("renders the face guide when the camera stream is active", async () => {
    const getUserMedia = vi.fn(() =>
      Promise.resolve({
        getTracks: () => [{ stop: vi.fn() }],
      } as unknown as MediaStream),
    );
    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: { getUserMedia },
    });

    render(<SelfieCapture onChange={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /start camera/i }));

    await waitFor(() => {
      expect(screen.getByTestId("selfie-face-guide")).toBeInTheDocument();
    });
    expect(screen.getByLabelText("Camera preview")).toBeInTheDocument();
  });

  it("applies custom root className", () => {
    render(<SelfieCapture onChange={vi.fn()} className="host-selfie" />);
    expect(document.querySelector(".host-selfie")).toBeInTheDocument();
  });

  describe("capture", () => {
    beforeEach(() => {
      Object.defineProperty(HTMLVideoElement.prototype, "videoWidth", {
        configurable: true,
        get: () => 640,
      });
      Object.defineProperty(HTMLVideoElement.prototype, "videoHeight", {
        configurable: true,
        get: () => 480,
      });
    });

    afterEach(() => {
      Reflect.deleteProperty(HTMLVideoElement.prototype, "videoWidth");
      Reflect.deleteProperty(HTMLVideoElement.prototype, "videoHeight");
    });

    it("calls onChange with a JPEG data URL when Capture is pressed", async () => {
      const onChange = vi.fn();
      const getUserMedia = vi.fn(() =>
        Promise.resolve({
          getTracks: () => [{ stop: vi.fn() }],
        } as unknown as MediaStream),
      );
      Object.defineProperty(navigator, "mediaDevices", {
        configurable: true,
        value: { getUserMedia },
      });

      const drawImage = vi.fn();
      vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
        drawImage,
      } as unknown as CanvasRenderingContext2D);
      vi.spyOn(HTMLCanvasElement.prototype, "toDataURL").mockReturnValue(
        "data:image/jpeg;base64,testpayload",
      );

      render(<SelfieCapture onChange={onChange} />);
      fireEvent.click(screen.getByRole("button", { name: /start camera/i }));

      await waitFor(() => {
        expect(screen.getByTestId("selfie-face-guide")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole("button", { name: /capture photo/i }));

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith(
          "data:image/jpeg;base64,testpayload",
        );
      });
    });
  });
});
