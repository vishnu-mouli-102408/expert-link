import * as motion from "motion/react-client";

import AnimationContainer from "../global/animation-container";
import SettingsForm from "./settings-form";

const Settings = async () => {
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
              Account
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
            className="text-4xl font-bold text-white mb-3"
          >
            Settings
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
            className="text-zinc-400 max-w-xl"
          >
            Manage your account settings and preferences
          </motion.p>
        </header>

        <main className="neo-blur rounded-2xl p-8">
          <SettingsForm />
        </main>
      </AnimationContainer>
    </div>
  );
};

export default Settings;
