import { redirect } from "next/navigation";
import { UserProfile } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

import { LoadingSpinner } from "@/components/spinner/index";

const Profile = async () => {
  const { userId } = await auth();
  const isAuth = !!userId;

  if (!isAuth) {
    redirect("/sign-in");
  }

  return (
    <div className="flex flex-col items-center justify-center my-8">
      <UserProfile
        fallback={<LoadingSpinner />}
        appearance={{
          elements: {
            footer: {
              display: "none",
            },
          },
          layout: {
            unsafe_disableDevelopmentModeWarnings: true,
          },
        }}
      />
    </div>
  );
};

export default Profile;
