import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="flex h-screen w-full justify-center items-center">
      <SignUp />
    </main>
  );
}
