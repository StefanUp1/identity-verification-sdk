import { useCallback, useEffect, useRef, useState } from "react";

export type SelfieCaptureProps = {
  /** Data URL (`data:image/jpeg;base64,...`) or raw base64 string for `IdentityInputs.selfieUrl`. */
  value?: string;
  defaultValue?: string;
  onChange: (selfieUrl: string) => void;
  onBlur?: () => void;
  /**
   * When defined, the host controls the message under the control (e.g. submit validation).
   * Use `undefined` to show SDK messages such as permission failures.
   */
  error?: string;
  disabled?: boolean;
};

function getCameraErrorMessage(error: unknown): string {
  if (error instanceof DOMException) {
    if (
      error.name === "NotAllowedError" ||
      error.name === "PermissionDeniedError"
    ) {
      return "Camera access is blocked. Allow camera access in your browser site settings, then try again.";
    }
    if (
      error.name === "NotFoundError" ||
      error.name === "DevicesNotFoundError"
    ) {
      return "No camera was found on this device.";
    }
    if (error.name === "NotReadableError" || error.name === "TrackStartError") {
      return "The camera is already in use or could not be started.";
    }
  }
  return "Could not access the camera.";
}

export function SelfieCapture({
  value,
  defaultValue = "",
  onChange,
  onBlur,
  error: errorMessage,
  disabled = false,
}: SelfieCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [internalUrl, setInternalUrl] = useState(defaultValue);
  const isControlled = value !== undefined;
  const previewUrl = isControlled ? value! : internalUrl;

  const [sdkError, setSdkError] = useState("");
  const [streamActive, setStreamActive] = useState(false);
  // Prevent duplicate start requests and drive the button loading label.
  const [starting, setStarting] = useState(false);

  const displayError = errorMessage !== undefined ? errorMessage : sdkError;

  const stopStream = useCallback(() => {
    // Stop all tracks to fully release camera resources.
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setStreamActive(false);
  }, []);

  useEffect(() => {
    return () => {
      stopStream(); // Always release camera resources on unmount.
    };
  }, [stopStream]);

  /**
   * `<video>` only mounts after `streamActive` is true, so `srcObject` must be bound
   * after mount — otherwise `videoRef.current` was null and the preview stays black.
   */
  useEffect(() => {
    if (!streamActive) {
      return;
    }

    const video = videoRef.current;
    const stream = streamRef.current;
    if (!video || !stream) {
      return;
    }

    // The browser:
    //  - Takes video frames from the stream
    //  - Renders them continuously in <video>
    //  - The <video> element is updated continuously with new frames as they arrive
    video.srcObject = stream;
    video.muted = true;
  }, [streamActive]);

  const startCamera = async () => {
    if (disabled || starting) {
      return;
    }
    setSdkError("");
    if (!navigator.mediaDevices?.getUserMedia) {
      setSdkError("Camera is not available in this browser.");
      return;
    }

    setStarting(true);

    try {
      // Request access to the user-facing camera.
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" }, // front camera
        audio: false,
      });

      // "stream" is now a MediaStream, a live video feed. (not a file, not a snapshot, more like “continuous camera output”
      // It represents ongoing real-time data internally connected to hardware (camera/mic).
      // Updates continuously (frames, audio samples), we can use stream.getVideoTracks()[0].
      // Each track is a single video source (camera), and each track has its own settings and properties
      streamRef.current = stream;
      setStreamActive(true);
    } catch (e) {
      setSdkError(getCameraErrorMessage(e));
      stopStream();
    } finally {
      setStarting(false);
    }
  };

  const applyCapturedUrl = (url: string) => {
    if (!isControlled) {
      setInternalUrl(url);
    }
    onChange(url);
  };

  const capturePhoto = () => {
    setSdkError("");

    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) {
      return;
    }

    const w = video.videoWidth || 640;
    const h = video.videoHeight || 480;

    /**
     * We use an <canvas> to take a photo from the live <video> stream.
     *
     * <video> can display camera frames, but it cannot directly export the current
     * frame as an image file/string. Canvas is the bridge:
    
     *   1) drawImage(video, ...) copies the current frame pixels into canvas
     *   2) toDataURL("image/jpeg", quality) encodes those pixels as a JPEG data URL
     * This gives us a portable image value we can store and pass to onChange.
     * (Canvas is also more broadly supported than alternatives like ImageCapture.)
     */
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setSdkError("Could not read the camera image.");
      return;
    }
    ctx.drawImage(video, 0, 0, w, h);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    applyCapturedUrl(dataUrl);
  };

  const retake = () => {
    setSdkError("");
    applyCapturedUrl("");
    stopStream();
  };

  const hasPreview = Boolean(previewUrl);

  return (
    <div onBlur={onBlur}>
      {displayError ? <p role="alert">{displayError}</p> : null}

      {!hasPreview ? (
        <div>
          {!streamActive ? (
            // Idle state, camera not running
            <button
              type="button"
              disabled={disabled || starting}
              onClick={startCamera}
            >
              {starting ? "Starting camera…" : "Start camera"}
            </button>
          ) : (
            // Camera stream active state
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "stretch",
                gap: 8,
                width: "100%",
                maxWidth: 320,
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "3 / 4",
                  borderRadius: 8,
                  overflow: "hidden",
                  background: "#111",
                }}
              >
                <video
                  ref={videoRef}
                  muted
                  playsInline
                  autoPlay
                  aria-label="Camera preview"
                  style={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                {/* Face guide layout */}
                <div
                  data-testid="selfie-face-guide"
                  aria-hidden
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "45%",
                    transform: "translate(-50%, -50%)",
                    width: "58%",
                    height: "62%",
                    maxWidth: 208,
                    maxHeight: 256,
                    border: "3px dashed rgba(255,255,255,0.9)",
                    borderRadius: "50%",
                    boxSizing: "border-box",
                    pointerEvents: "none",
                  }}
                />
              </div>
              <button type="button" disabled={disabled} onClick={capturePhoto}>
                Capture photo
              </button>
            </div>
          )}
        </div>
      ) : (
        // Captured photo state
        <div>
          <img
            src={previewUrl}
            alt="Captured selfie preview"
            style={{
              display: "block",
              maxWidth: 320,
              width: "100%",
              borderRadius: 8,
            }}
          />
          <div style={{ marginTop: 8 }}>
            <button type="button" disabled={disabled} onClick={retake}>
              Retake photo
            </button>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} hidden />
    </div>
  );
}
