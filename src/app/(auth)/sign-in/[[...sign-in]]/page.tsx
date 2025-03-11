import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your account",
};

function Page() {
  return (
    <div className="w-full flex-1 min-h-screen flex items-center justify-center">
      <SignIn forceRedirectUrl={"/"} />
    </div>
  );
}

export default Page;
