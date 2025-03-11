import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Expert",
    template: "%s | Expert",
  },
  description: "This is the layout for the expert pages.",
  icons: [{ rel: "icon", url: "/favicon/favicon.ico" }],
};

function Page() {
  return <div>Expert Page</div>;
}

export default Page;
