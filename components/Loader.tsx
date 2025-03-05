import { cn } from "@/lib/utils";
import Image from "next/image";

export default function Loader({ raisedHeight }: { raisedHeight?: boolean }) {
  return (
    <div
      className={cn("flex-center h-screen w-full", raisedHeight && "h-[50vh]")}
    >
      <Image
        src="/icons/loading-circle.svg"
        alt="Loading"
        height={50}
        width={50}
      />
    </div>
  );
}
