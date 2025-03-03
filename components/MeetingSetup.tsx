"use client";

import { useEffect, useState } from "react";

import {
  DeviceSettings,
  useCall,
  useCallStateHooks,
  VideoPreview,
} from "@stream-io/video-react-sdk";
import { Button } from "./ui/button";

export default function MeetingSetup({
  setIsSetupComplete,
}: {
  setIsSetupComplete: (value: boolean) => void;
}) {
  const [isMicCamToggledOn, setIsMicCamToggledOn] = useState<boolean>(false);

  const { useCameraState, useMicrophoneState } = useCallStateHooks();
  const { camera } = useCameraState();
  const { microphone } = useMicrophoneState();

  const call = useCall();

  if (!call)
    throw new Error(
      "useCall hook must be used inside the Stream Call component"
    );

  useEffect(() => {
    if (isMicCamToggledOn) {
      call?.microphone.disable();
      call?.camera.disable();
    } else {
      call?.microphone.enable();
      call?.camera.enable();
    }
  }, [isMicCamToggledOn, call?.microphone, call?.camera]);

  return (
    <div className="flex flex-col h-screen w-full gap-3 items-center justify-center text-white">
      <h1 className="text-2xl font-bold">Setup</h1>
      <VideoPreview />
      <div className="flex h-16 items-center justify-center gap-3">
        <label className="flex items-center justify-center gap-2 font-medium">
          <input
            type="checkbox"
            checked={isMicCamToggledOn}
            onChange={async (e) => {
              setIsMicCamToggledOn(e.target.checked);
              if (!isMicCamToggledOn) {
                await camera.disable();
                await microphone.disable();
              }
            }}
          />
          Join with mic and camera off
        </label>
        <DeviceSettings />
      </div>
      <Button
        className="rounded-md bg-green-500 px-4 py-2.5"
        onClick={() => {
          call.join();
          setIsSetupComplete(true);
        }}
      >
        Join meeting
      </Button>
    </div>
  );
}
