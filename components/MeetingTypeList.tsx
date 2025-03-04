"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import HomeCard from "./HomeCard";
import MeetingModal from "./MeetingModal";
import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { toast } from "sonner";
import { Textarea } from "./ui/textarea";
import ReactDatePicker from "react-datepicker";

type ValuesType = {
  dateTime: Date;
  description: string;
  link: string;
};

export default function MeetingTypeList() {
  const [meetingState, setMeetingState] = useState<
    "ScheduleMeeting" | "JoiningMeeting" | "InstantMeeting" | undefined
  >();
  const [values, setValues] = useState<ValuesType>({
    dateTime: new Date(),
    description: "",
    link: "",
  });
  const [callDetails, setCallDetails] = useState<Call>();

  const router = useRouter();

  const { user } = useUser();
  const client = useStreamVideoClient();

  const createMeeting = async () => {
    if (!user || !client) return;

    try {
      if (!values.dateTime) {
        toast("Please select a date and a time");
        return;
      }

      const id = crypto.randomUUID();
      const call = client.call("default", id);

      if (!call) throw new Error("Failed to create call");

      const startsAt =
        values.dateTime.toISOString() || new Date(Date.now()).toISOString();
      const description = values.description || "Instant meeting";

      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description,
          },
        },
      });

      setCallDetails(call);

      if (!values.description) {
        router.push(`/meeting/${call.id}`);
      }

      toast("Meeting Created");
    } catch (error) {
      console.log(error);
      toast("Failed to create meeting");
    }
  };

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`;

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
        description="Plan your meeting"
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

      {!callDetails ? (
        <MeetingModal
          isOpen={meetingState === "ScheduleMeeting"}
          onClose={() => setMeetingState(undefined)}
          title="Create Meeting"
          handleClick={createMeeting}
        >
          <div className="flex flex-col gap-2.5">
            <label className="text-base text-normal leading-[22px] text-sky-2">
              Add a description
            </label>
            <Textarea
              className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
              onChange={(e) =>
                setValues({ ...values, description: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col gap-2.5 w-full">
            <label className="text-base text-normal leading-[22px] text-sky-2">
              Add a description
            </label>
            <ReactDatePicker
              selected={values.dateTime}
              onChange={(date) => setValues({ ...values, dateTime: date! })}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="MMMM d, yyyy h:mm aa"
              className="w-full rounded bg-dark-3 p-2 focus:outline-none"
            />
          </div>
        </MeetingModal>
      ) : (
        <MeetingModal
          isOpen={meetingState === "ScheduleMeeting"}
          onClose={() => setMeetingState(undefined)}
          title="Meeting Created"
          className="text-center"
          handleClick={() => {
            navigator.clipboard.writeText(meetingLink);
            toast("Link Copied");
          }}
          image="/icons/checked.svg"
          buttonIcon="/icons/copy.svg"
          buttonText="Copy Meeting Link"
        />
      )}

      <MeetingModal
        isOpen={meetingState === "InstantMeeting"}
        onClose={() => setMeetingState(undefined)}
        title="Start an Instant Meeting"
        className="text-center"
        buttonText="Start Meeting"
        handleClick={createMeeting}
      />
    </section>
  );
}
