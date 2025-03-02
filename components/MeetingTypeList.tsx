"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import HomeCard from "./HomeCard";

export default function MeetingTypeList() {
  const [meetingState, setMeetingState] = useState<
    "ScheduleMeeting" | "JoiningMeeting" | "InstantMeeting" | undefined
  >();
  const router = useRouter();

  return (
    <section className="grid gird-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      <HomeCard
        imgSrc={"/icons/add-meeting.svg"}
        title="New Meeting"
        description="Start a new meeting"
        className="bg-orange-1"
        handleClick={() => setMeetingState("InstantMeeting")}
      />

      <HomeCard
        imgSrc={"/icons/schedule.svg"}
        title="Schedule Meeting"
        description="Plan you meeting"
        className="bg-blue-1"
        handleClick={() => setMeetingState("ScheduleMeeting")}
      />

      <HomeCard
        imgSrc={"/icons/recordings.svg"}
        title="View Recordings"
        description="Check out your recordings"
        className="bg-purple-1"
        handleClick={() => router.push("/recordings")}
      />

      <HomeCard
        imgSrc={"/icons/join-meeting.svg"}
        title="Join Meeting"
        description="via the invitation link"
        className="bg-yellow-1"
        handleClick={() => setMeetingState("JoiningMeeting")}
      />
    </section>
  );
}
