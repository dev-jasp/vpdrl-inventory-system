"use client";

import { useEffect, useRef, useState } from "react";

import { isDataUrl, photoUrl } from "@/lib/inventory/photos";

/** The design caps a captured frame's long edge, then encodes it as JPEG. */
const CAPTURE_MAX_EDGE = 900;
const CAPTURE_QUALITY = 0.82;

const NO_CAMERA =
  "This browser can't open a camera here — attach a photo file instead.";
const CAMERA_BLOCKED =
  "Camera blocked or unavailable — attach a photo file instead.";

const buttonClass =
  "flex h-[34px] items-center rounded-[9px] border border-border-strong bg-surface px-3.5 text-[12.5px] font-semibold text-text hover:bg-muted";

/**
 * The item photo: attach a file, or take one with the device camera.
 *
 * The photo travels with the form as a `data:` URL in a hidden input, which is
 * how the design carries it too. That keeps the whole thing a plain form post
 * with no upload endpoint behind it — the right trade while `data/` is still
 * standing in for an API, and the thing to revisit when there is somewhere to
 * PUT a file.
 */
export function PhotoField({ initial }: { initial?: string }) {
  const [photo, setPhoto] = useState(initial ?? "");
  const [cameraOn, setCameraOn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  function stopStream() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }

  // A live camera outlives the dialog that opened it unless it is told not to,
  // so the stream is stopped on the way out however the form is left.
  useEffect(() => stopStream, []);

  function readFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    // Cleared so picking the same file twice still fires a change.
    event.target.value = "";
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPhoto(String(reader.result));
      setError(null);
    };
    reader.onerror = () => setError("That file could not be read.");
    reader.readAsDataURL(file);
  }

  async function openCamera() {
    // Absent outside a secure context, and on browsers that withhold it.
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraOn(false);
      setError(NO_CAMERA);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        // The back camera on a phone, which is the one pointed at a shelf.
        video: { facingMode: "environment", width: { ideal: 1280 } },
        audio: false,
      });
      streamRef.current = stream;
      setCameraOn(true);
      setError(null);
    } catch {
      setCameraOn(false);
      setError(CAMERA_BLOCKED);
    }
  }

  // Attach the stream once the <video> the state change created is on screen.
  useEffect(() => {
    const video = videoRef.current;
    if (!cameraOn || !video || !streamRef.current) return;
    video.srcObject = streamRef.current;
    video.play().catch(() => {});
  }, [cameraOn]);

  function capture() {
    const video = videoRef.current;
    // `videoWidth` is 0 until the first frame has arrived.
    if (!video?.videoWidth) return;

    const scale = Math.min(
      1,
      CAPTURE_MAX_EDGE / Math.max(video.videoWidth, video.videoHeight),
    );
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(video.videoWidth * scale);
    canvas.height = Math.round(video.videoHeight * scale);
    canvas
      .getContext("2d")
      ?.drawImage(video, 0, 0, canvas.width, canvas.height);

    setPhoto(canvas.toDataURL("image/jpeg", CAPTURE_QUALITY));
    stopStream();
    setCameraOn(false);
  }

  function closeCamera() {
    stopStream();
    setCameraOn(false);
  }

  return (
    <div className="mb-5 flex items-start gap-4 border-b border-border-soft pb-5">
      <input type="hidden" name="photo" value={photo} />

      <div className="relative grid size-[88px] flex-none place-items-center overflow-hidden rounded-xl border border-dashed border-border-strong bg-bg">
        {photo ? (
          // Not `next/image`: a freshly captured photo is a data URL with no
          // intrinsic size to optimise, and this is a fixed 88px preview.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoUrl(photo)}
            alt="Item photo"
            className="absolute inset-0 size-full object-cover"
          />
        ) : (
          <span className="px-2 text-center text-[10.5px] leading-tight font-semibold text-text-4">
            No photo yet
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[12.5px] font-semibold">Item photo</p>
        <p className="mt-[3px] max-w-[420px] text-[11.5px] font-normal text-text-3">
          Attach a file or take a photo so technicians can recognise the
          container on the shelf.
        </p>

        {cameraOn ? (
          <div className="mt-3">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="block h-[162px] w-[248px] rounded-[11px] bg-[#0b0d14] object-cover"
            />
            <div className="mt-2.5 flex gap-2">
              <button
                type="button"
                onClick={capture}
                className="flex h-[34px] items-center rounded-md bg-accent px-4 text-[12.5px] font-medium text-white hover:bg-accent-hover"
              >
                Capture
              </button>
              <button
                type="button"
                onClick={closeCamera}
                className={buttonClass}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <label className="flex h-[34px] cursor-pointer items-center rounded-[9px] border border-tint-blue bg-tint-blue px-3.5 text-[12.5px] font-semibold text-accent-fg">
              Attach photo
              <input
                type="file"
                accept="image/*"
                onChange={readFile}
                className="sr-only"
              />
            </label>
            <button type="button" onClick={openCamera} className={buttonClass}>
              Take photo
            </button>
            {photo ? (
              <button
                type="button"
                onClick={() => setPhoto("")}
                className="flex h-[34px] items-center rounded-[9px] px-3 text-[12.5px] font-semibold text-[#dc2626] hover:bg-badge-red-bg"
              >
                Remove
              </button>
            ) : null}
          </div>
        )}

        {error ? (
          <p
            role="status"
            className="mt-2.5 text-[11.5px] font-medium text-[#dc2626]"
          >
            {error}
          </p>
        ) : null}

        {/* An item that came with a vendored asset keeps it until it is
            replaced; only then does the field carry a data URL. */}
        {photo && !isDataUrl(photo) ? (
          <p className="mt-2.5 text-[11.5px] font-normal text-text-3">
            Using the photo already on file.
          </p>
        ) : null}
      </div>
    </div>
  );
}
