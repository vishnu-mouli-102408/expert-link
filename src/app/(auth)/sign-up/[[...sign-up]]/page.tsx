import type { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Sign up for an account",
};

function Page() {
  return (
    <div className="w-full flex-1 mt-14 flex min-h-screen items-center justify-center">
      <SignUp
        fallbackRedirectUrl={"/onboarding"}
        forceRedirectUrl={"/onboarding"}
      />
    </div>
  );
}

export default Page;
