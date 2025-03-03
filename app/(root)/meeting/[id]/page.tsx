"use client";

import { useState } from "react";

import { useUser } from "@clerk/nextjs";
import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
import MeetingRoom from "@/components/MeetingRoom";
import MeetingSetup from "@/components/MeetingSetup";
import { useGetCallById } from "@/hooks/useGetCallById";
import Loader from "@/components/Loader";

export default async function MeetingPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const { user, isLoaded } = useUser();
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  const { call, isCallLoading } = useGetCallById(id);

  if (!isLoaded || isCallLoading) return <Loader />;

  return (
    <main>
      <StreamCall call={call}>
        <StreamTheme>
          {isSetupComplete ? <MeetingRoom /> : <MeetingSetup />}
        </StreamTheme>
      </StreamCall>
    </main>
  );
}
