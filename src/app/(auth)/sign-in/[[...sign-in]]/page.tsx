"use client";

import { SignIn } from "@clerk/nextjs";

function Page() {
  return (
    <div className="w-full flex-1 min-h-screen flex items-center justify-center">
      <SignIn
        forceRedirectUrl={"/onboarding"}
        fallbackRedirectUrl={"/onboarding"}
        afterSignOutUrl={"/"}
      />
    </div>
  );
}

export default Page;
