"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useGetCalls } from "@/hooks/useGetCalls";
import { Call, CallRecording } from "@stream-io/video-react-sdk";
import MeetingCard from "./MeetingCard";
import Loader from "./Loader";
import { toast } from "sonner";

export default function CallList({
  type,
}: {
  type: "previous" | "upcoming" | "recordings";
}) {
  const router = useRouter();
  const { previousCalls, upcomingCalls, callRecordings, isLoading } =
    useGetCalls();
  const [recordings, setRecordings] = useState<CallRecording[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getCalls = () => {
    switch (type) {
      case "previous":
        return previousCalls;

      case "recordings":
        return recordings;

      case "upcoming":
        return upcomingCalls;

      default:
        return [];
    }
  };

  const getNoCallsMessage = () => {
    switch (type) {
      case "previous":
        return "No Previous Calls";

      case "recordings":
        return "No Recordings";

      case "upcoming":
        return "No Upcoming Calls";

      default:
        return "";
    }
  };

  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        setLoading(true);
        const callData = await Promise.all(
          callRecordings.map((meeting) => meeting.queryRecordings())
        );

        const recordings = callData
          .filter((call) => call.recordings.length > 0)
          .flatMap((call) => call.recordings);

        setRecordings(recordings);
        setLoading(false);
      } catch (error) {
        toast("Try again later");
      }
    };

    if (type === "recordings") fetchRecordings();
  }, [type, callRecordings]);

  const calls = getCalls();
  const noCallsMessage = getNoCallsMessage();

  if (isLoading || loading) return <Loader raisedHeight={true} />;

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {calls && calls.length > 0 ? (
        calls.map((meeting: Call | CallRecording) => (
          <MeetingCard
            key={
              type === "recordings"
                ? (meeting as CallRecording).filename
                : (meeting as Call).id
            }
            icon={
              type === "previous"
                ? "/icons/previous.svg"
                : type === "upcoming"
                ? "/icons/upcoming.svg"
                : "/icons/recordings.svg"
            }
            title={
              (type === "recordings"
                ? (meeting as CallRecording)?.filename?.substring(0, 20)
                : (meeting as Call).state?.custom?.description?.substring(
                    0,
                    30
                  )) || "Personal Meeting"
            }
            date={
              (meeting as Call).state?.startsAt?.toLocaleString() ||
              (meeting as CallRecording).start_time.toLocaleString()
            }
            isPreviousMeeting={type === "previous"}
            buttonIcon1={type === "recordings" ? "/icons/play.svg" : undefined}
            buttonText={type === "recordings" ? "Play" : "Start"}
            link={
              type === "recordings"
                ? (meeting as CallRecording).url
                : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${
                    (meeting as Call).id
                  }`
            }
            handleClick={
              type === "recordings"
                ? () => router.push(`${(meeting as CallRecording).url}`)
                : () => router.push(`/meeting/${(meeting as Call).id}`)
            }
          />
        ))
      ) : (
        <h1>{noCallsMessage}</h1>
      )}
    </div>
  );
}
