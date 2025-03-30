import { Check } from "lucide-react";
import * as motion from "motion/react-client";

import { CircleProgress } from "../circle-progress";
import AnimationContainer from "../global/animation-container";
import { Button } from "../ui/button";

const Billing = async () => {
  //   const user = await currentUser();

  return (
    <div className="py-12 px-6 sm:px-8 md:px-12">
      <AnimationContainer className="max-w-4xl mx-auto">
        <header className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex items-center gap-3 mb-2"
          >
            <div className="h-1.5 w-12 bg-white/30 rounded-full" />
            <span className="text-sm font-medium text-zinc-400 uppercase tracking-wider">
              Payments
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
            className="text-4xl font-bold text-white mb-3"
          >
            Billing
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
            className="text-zinc-400 max-w-xl"
          >
            Manage your billing settings and preferences
          </motion.p>
        </header>

        <main className="neo-blur mb-8 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-medium text-white">Free</h3>
                <span className="bg-muted/80 text-accent-foreground px-2 py-0.5 rounded-sm text-xs border shadow-inner">
                  Current plan
                </span>
              </div>
              <p className="text-xs text-gray-300/80 mt-2">
                Perfect for trying out
              </p>
            </div>
            <div className="flex flex-col justify-between items-end space-y-3">
              <div className="flex items-center justify-between w-full gap-6">
                <div className="flex items-center">
                  <div className="w-5 mr-2">
                    <CircleProgress progress={2 / 5} />
                  </div>
                  <div className="text-sm text-foreground">Monthly Usage</div>
                </div>
                <div className="text-sm tabular-nums">2 / 5</div>
              </div>
              <div className="flex items-center justify-between w-full gap-6">
                <div className="flex items-center">
                  <div className="w-5 mr-2 flex justify-center items-center">
                    <div className="flex items-center justify-center h-6 w-6 p-1">
                      <span className="text-[22px] leading-none">∞</span>
                    </div>
                  </div>
                  <div className="text-sm text-foreground">
                    Chat with Experts
                  </div>
                </div>
                <span className="bg-muted/80 text-accent-foreground px-2 py-0.5 rounded-sm text-xs border shadow-inner">
                  unlimited
                </span>
              </div>
              <div className="flex items-center justify-between w-full gap-6">
                <div className="flex items-center">
                  <div className="w-5 mr-2 flex justify-center items-center">
                    <div className="flex items-center justify-center h-6 w-6 p-1">
                      <span className="text-[22px] leading-none">∞</span>
                    </div>
                  </div>
                  <div className="text-sm text-foreground">
                    Analytics & Insights
                  </div>
                </div>
                <span className="bg-muted/80 text-accent-foreground px-2 py-0.5 rounded-sm text-xs border shadow-inner">
                  unlimited
                </span>
              </div>
            </div>
          </div>
        </main>
        <h1 className="mb-2 font-semibold"> Upgrade to Pro</h1>
        <main className="neo-blur rounded-2xl ">
          <div className="flex flex-col md:flex-row gap-8 items-start justify-between p-6">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h4 className="text-md font-medium text-white">
                  $10 per month
                </h4>
              </div>
              <p className="text-xs text-gray-300/80 mt-2">
                For professional developers
              </p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="text-sm">
                  <strong>15 </strong> Calls per month
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="text-sm">
                  Unlimited <strong>Chat</strong> with Experts
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="text-sm">Priority Booking</span>
              </div>
            </div>
          </div>
          <div className="bg-[#18181B] p-4 border-t-white/10 border-t rounded-b-lg flex justify-end">
            <Button className="cursor-pointer" disabled={false}>
              Upgrade plan
            </Button>
          </div>
        </main>
      </AnimationContainer>
    </div>
  );
};

export default Billing;
