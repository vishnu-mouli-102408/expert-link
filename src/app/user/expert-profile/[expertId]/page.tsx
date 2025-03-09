import { ExpertProfile } from "@/components";

const Page = async ({ params }: { params: Promise<{ expertId: string }> }) => {
  const { expertId } = await params;
  return (
    <div className="min-h-[calc(100vh-64px)] w-full bg-black/50 mx-auto p-6">
      <ExpertProfile />
    </div>
  );
};

export default Page;
