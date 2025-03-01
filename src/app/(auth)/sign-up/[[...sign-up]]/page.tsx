import { SignUp } from "@clerk/nextjs";

function Page() {
  return (
    <div className="w-full flex-1 mt-14 flex min-h-screen items-center justify-center">
      <SignUp afterSignOutUrl={"/"} />
    </div>
  );
}

export default Page;
