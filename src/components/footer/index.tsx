import Link from "next/link";
import { HOME_ITEMS, PRODUCT_ITEMS } from "@/constants";
import * as motion from "motion/react-client";

import AnimationContainer from "../global/animation-container";
import Icons from "../global/icons";
import MaxWidthWrapper from "../global/max-width-wrapper";
import { GradientText } from "../ui/gradient-text";
import { HoverButton } from "../ui/hover-button";
import SocialButton from "./social-button";

const words = [
  { text: "Empower", className: "text-[#40ffaa]" },
  { text: "Your", className: "text-[#4079ff]" },
  { text: "Expertise", className: "text-[#40ffaa]" },
  { text: ".", className: "text-[#4079ff]" },
  { text: "Connect", className: "text-[#40ffaa]" },
  { text: "Seamlessly", className: "text-[#4079ff]" },
  { text: ".", className: "text-[#40ffaa]" },
];

const Footer = () => {
  return (
    <footer
      id="footer"
      className="relative flex w-full py-6 md:py-10 flex-col items-center justify-center overflow-clip border-t border-border bg-[radial-gradient(35%_128px_at_50%_0%,theme(backgroundColor.white/8%),transparent)] px-2 md:px-16"
    >
      <div className="absolute top-0 z-[-2] h-full w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      <MaxWidthWrapper className="lg:px-14">
        <div className="absolute left-1/2 right-1/2 top-0 h-1 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground"></div>
        <AnimationContainer animation="scaleUp">
          <div className="border backdrop-blur-[34px] mb-8 rounded-2xl md:p-10 p-6 shadow-[inset_0px_0px_55.5px_0px_#C5B9F626] bg-[#FFFFFF0D] border-[#C5B9F633]">
            <div className="bg-[#FFFFFF0A] mb-6 rounded-xl flex flex-col md:flex-row justify-between items-center w-full border border-[#FFFFFF1A] gap-6 py-6  md:p-6 p-3">
              <AnimationContainer
                className="flex flex-row gap-2 hover:scale-[1.1] transition-all duration-500 ease-in-out items-center"
                animation="fadeRight"
                delay={0.1}
              >
                <div className=" h-[50px] w-[50px] rounded-lg  inline-flex items-center justify-center">
                  <Link href="/">
                    <Icons.logo className="w-max h-10" />
                  </Link>
                </div>
                <GradientText
                  colors={["#40ffaa", "#4079ff", "#40ffaa"]}
                  animationSpeed={3}
                  className="text-2xl w-max bg-transparent  font-semibold"
                >
                  Expert Link
                </GradientText>
              </AnimationContainer>
              <Link
                href="#"
                className="w-full flex justify-center md:justify-end"
              >
                <HoverButton className="rounded-lg py-2 shadow-[0_1px_1px_rgba(0,0,0,0.05), 0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)]">
                  Get Started
                </HoverButton>
              </Link>
            </div>
            <div className="flex md:flex-row flex-col md:mb-16 mb-10 justify-between items-center">
              <div className="flex flex-col md:max-w-[40%]  mb-8 md:mb-0 max-w-full gap-2">
                <motion.h1
                  className="text-lg font-semibold text-center md:text-start text-[#F1F0E9]"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  viewport={{ amount: 0.5 }}
                >
                  Empower Your Expertise. Connect Seamlessly.
                </motion.h1>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  viewport={{ amount: 0.5 }}
                  className="text-[#FFFFFF66] text-center md:text-start text-base"
                >
                  Expert advice, anytime. Connect with professionals via video,
                  audio, and chat. Seamless bookings, secure payments, and
                  real-time support—all in one place.
                </motion.h1>
              </div>
              <div className="flex flex-row gap-16">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  viewport={{ amount: 0.5 }}
                  className="flex flex-col gap-2 transition-all duration-500 ease-in-out"
                >
                  {HOME_ITEMS?.map((item, index) => {
                    return (
                      <AnimationContainer
                        key={item?.name}
                        animation="fadeRight"
                        delay={0.8 + index * 0.1}
                      >
                        <Link
                          href={item?.link}
                          className={`flex  hover:scale-[1.1] ${index === 0 ? "font-semibold text-base text-white hover:text-[#d9e0e5]" : "text-[14px] text-[#d3c3c3] hover:text-[#7F8487]"}  flex-col gap-2`}
                        >
                          {item?.name}
                        </Link>
                      </AnimationContainer>
                    );
                  })}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  viewport={{ amount: 0.5 }}
                  className="flex flex-col gap-2 transition-all duration-500 ease-in-out"
                >
                  {PRODUCT_ITEMS?.map((item, index) => {
                    return (
                      <AnimationContainer
                        key={item?.name}
                        animation="fadeRight"
                        delay={0.8 + index * 0.1}
                        className={`flex transition-all duration-500 ease-in-out hover:scale-[1.1] ${index === 0 ? "font-semibold text-base text-white hover:text-[#d9e0e5]" : "text-[14px] text-[#d3c3c3] hover:text-[#7F8487]"}  flex-col gap-2`}
                      >
                        <Link href={item?.link} className="flex flex-col gap-2">
                          {item?.name}
                        </Link>
                      </AnimationContainer>
                    );
                  })}
                </motion.div>
              </div>
            </div>
            <div className="flex md:flex-row flex-col justify-between md:gap-6 gap-3 items-center">
              <motion.h1
                className="text-2xl font-semibold text-[#F1F0E9]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                viewport={{ amount: 0.5 }}
              >
                Get latest updates here
              </motion.h1>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                viewport={{ amount: 0.5 }}
                className="border-[0.5px] border-t flex-1 border-[#FFFFFF]/20"
              />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                viewport={{ amount: 0.5 }}
                className="flex flex-row gap-4"
              >
                <SocialButton
                  icon={<Icons.linkedin />}
                  buttonClassName="group flex cursor-pointer justify-center p-2 rounded-md drop-shadow-xl bg-[#0077b5] from-gray-800 text-white font-semibold hover:translate-y-3 hover:rounded-[50%] transition-all duration-500 hover:from-[#331029] hover:to-[#310413] relative"
                  name="LinkedIn"
                  href="https://www.linkedin.com/in/ganivada-mouli/"
                />
                <SocialButton
                  icon={<Icons.discord />}
                  buttonClassName="group flex justify-center cursor-pointer p-2 rounded-md drop-shadow-xl bg-[#7289da] from-gray-800 text-white font-semibold hover:translate-y-3 hover:rounded-[50%] transition-all duration-500 hover:from-[#331029] hover:to-[#310413]"
                  name="Discord"
                />
                <SocialButton
                  icon={<Icons.github />}
                  buttonClassName="group flex justify-center cursor-pointer p-2 rounded-md drop-shadow-xl bg-gradient-to-r from-gray-800 to-black text-white font-semibold hover:translate-y-3 hover:rounded-[50%] transition-all duration-500 hover:from-[#331029] hover:to-[#310413]"
                  name="Github"
                  href="https://github.com/vishnu-mouli-102408"
                />
                <SocialButton
                  icon={<Icons.youtube />}
                  buttonClassName="group flex justify-center cursor-pointer p-2 rounded-md drop-shadow-xl bg-[#CD201F] from-gray-800 text-white font-semibold hover:translate-y-3 hover:rounded-[50%] transition-all duration-500 hover:from-[#331029] hover:to-[#310413]"
                  name="Youtube"
                  href="https://www.youtube.com/"
                />
                <SocialButton
                  icon={<Icons.x />}
                  name="X"
                  href="https://x.com/iamVishnuMouli"
                  buttonClassName="group flex justify-center cursor-pointer p-2 rounded-md drop-shadow-xl bg-gradient-to-r from-gray-800 to-black text-white font-semibold hover:translate-y-3 hover:rounded-[50%] transition-all duration-500 hover:from-[#331029] hover:to-[#310413]"
                />
              </motion.div>
            </div>
          </div>
          <div className="flex md:flex-row flex-col gap-2 justify-between items-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              viewport={{ amount: 0.5 }}
              className="text-[#7f7f7d] text-base font-normal"
            >
              Made by Vishnu Mouli
            </motion.h1>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              viewport={{ amount: 0.5 }}
              className="text-[#7f7f7d] text-base font-normal"
            >
              {new Date().getFullYear()} © Expert Link. All rights reserved.
            </motion.h1>
          </div>
        </AnimationContainer>
      </MaxWidthWrapper>
    </footer>
  );
};

export default Footer;
