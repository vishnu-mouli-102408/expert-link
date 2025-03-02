"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { motion, useAnimation, useInView } from "framer-motion";
import {
  Award,
  Calendar,
  MessageSquare,
  Mic,
  Sparkles,
  Users,
  Video,
} from "lucide-react";

import { ButtonCta } from "../ui/button-shiny";
import SectionBadge from "../ui/section-badge";

const features = [
  {
    icon: <Video className="w-10 h-10 text-[#9b87f5]" />,
    title: "HD Video Calls",
    description:
      "Connect face-to-face with industry experts in crystal clear video quality.",
    delay: 0.1,
  },
  {
    icon: <Mic className="w-10 h-10 text-[#9b87f5]" />,
    title: "Audio Consultations",
    description:
      "Have in-depth discussions with flexible audio-only options when you're on the go.",
    delay: 0.2,
  },
  {
    icon: <MessageSquare className="w-10 h-10 text-[#9b87f5]" />,
    title: "Instant Messaging",
    description:
      "Chat directly with experts, share files, and keep a record of your discussions.",
    delay: 0.3,
  },
  {
    icon: <Users className="w-10 h-10 text-[#9b87f5]" />,
    title: "Expert Network",
    description:
      "Access our carefully curated network of verified professionals across industries.",
    delay: 0.4,
  },
  {
    icon: <Calendar className="w-10 h-10 text-[#9b87f5]" />,
    title: "Flexible Scheduling",
    description:
      "Book sessions at your convenience with our smart scheduling system.",
    delay: 0.5,
  },
  {
    icon: <Award className="w-10 h-10 text-[#9b87f5]" />,
    title: "Verified Experts",
    description:
      "Every expert is thoroughly vetted to ensure quality consultations.",
    delay: 0.6,
  },
];

const FeatureCard = ({
  feature,
  index,
}: {
  feature: (typeof features)[0];
  index: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.5,
            delay: feature.delay,
            ease: [0.22, 1, 0.36, 1],
          },
        },
      }}
      className="bg-gradient-card cursor-pointer backdrop-blur-sm bg-opacity-30 border-[#C5B9F666] rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.2)] relative overflow-hidden flex flex-col h-full transform hover:-translate-y-2 transition-all duration-300 ease-in-out group"
    >
      {/* Thinner border with hover animation - removed default glow */}
      <div className="absolute inset-0 border border-[#9b87f5]/10 rounded-2xl group-hover:border-[#9b87f5]/60 transition-colors duration-500"></div>

      {/* Moving border effect on hover only */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-[#9b87f5]/40 to-transparent bg-[length:200%_100%] group-hover:animate-border-scan"></div>
      </div>

      {/* Moving gradient background - reduced opacity and slowed down animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-100/30 via-[#9b87f5]/5 to-dark-100/30 rounded-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-700 bg-[length:200%_200%] group-hover:animate-move-gradient"></div>

      <div className="p-3 rounded-xl bg-dark-100/80 backdrop-blur-sm w-fit mb-5 z-10 border border-[#9b87f5]/20 group-hover:border-[#9b87f5]/50 transition-colors duration-500">
        {feature.icon}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-white z-10 relative">
        {feature.title}
      </h3>
      <p className="text-gray-300 flex-grow z-10 relative">
        {feature.description}
      </p>
    </motion.div>
  );
};

const FloatingElement = ({
  children,
  delay,
  duration,
  yOffset,
}: {
  children: React.ReactNode;
  delay: number;
  duration: number;
  yOffset: number;
}) => (
  <motion.div
    initial={{ y: 0 }}
    animate={{ y: yOffset }}
    transition={{
      repeat: Infinity,
      repeatType: "reverse",
      duration,
      delay,
      ease: "easeInOut",
    }}
  >
    {children}
  </motion.div>
);

const FeaturesSection = () => {
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });
  const heroControls = useAnimation();

  const { user } = useUser();

  useEffect(() => {
    if (isHeroInView) {
      heroControls.start("visible");
    }
  }, [isHeroInView, heroControls]);

  const connectRef = useRef(null);
  const isConnectInView = useInView(connectRef, { once: true, amount: 0.3 });
  const connectControls = useAnimation();

  useEffect(() => {
    if (isConnectInView) {
      connectControls.start("visible");
    }
  }, [isConnectInView, connectControls]);

  return (
    <div
      id="features"
      className="min-h-screen overflow-hidden bg-gray-900 relative"
    >
      {/* Darker radial background gradients */}
      <div className="absolute inset-0 bg-gradient-radial from-gray-700 to-gray-950 opacity-80"></div>
      <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-gradient-radial from-[#9b87f5]/10 to-transparent blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-1/2 h-1/2 bg-gradient-radial from-[#9b87f5]/5 to-transparent blur-3xl"></div>

      {/* Noise overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIwLjA1Ii8+PC9zdmc+')]"></div>

      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-28 pb-16 relative z-10">
        <div
          ref={heroRef}
          className="max-w-5xl mx-auto text-center relative z-10"
        >
          <motion.div
            initial="hidden"
            animate={heroControls}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                },
              },
            }}
          >
            <div className="w-full mb-6 flex justify-center">
              <div className="w-max">
                <SectionBadge title="Expert Knowledge on Demand" />
              </div>
            </div>
            {/* <span className="bg-gradient-dark-purple text-[#9b87f5] font-medium py-1 px-3 rounded-full text-sm mb-6 inline-block border border-[#9b87f5]/30">

            </span> */}
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white leading-tight">
              Connect with <span className="text-[#9b87f5]">Experts</span> in
              Real-Time
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
              Get personalized consultation from verified professionals through
              high-quality video calls, audio sessions, and instant messaging.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href={
                  user?.publicMetadata?.role === "user" ? "/user" : "/expert"
                }
              >
                <ButtonCta
                  label="Find an Expert"
                  className="w-fit cursor-pointer hover:scale-[1.05] font-bold py-3 px-8 rounded-xl shadow-lg shadow-[#9b87f5]/30 text-sm"
                />
              </Link>
              <Link href={"#faq"}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-[#FFFFFF0D] hover:bg-[#FFFFFF1A] hover-shadow-[box-shadow:inset_0px_0px_30px_0px_#FFFFFF4D] text-white hover:border-[#FFFFFF26] font-medium cursor-pointer py-3 px-8 rounded-xl border border-gray-700 shadow-sm"
                >
                  How It Works
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-20 right-10 opacity-60">
          <FloatingElement delay={0} duration={3} yOffset={15}>
            <div className="bg-[#9b87f5]/20 w-16 h-16 rounded-full backdrop-blur-md"></div>
          </FloatingElement>
        </div>
        <div className="absolute bottom-10 left-10 opacity-60">
          <FloatingElement delay={1} duration={4} yOffset={20}>
            <div className="bg-[#9b87f5]/30 w-20 h-20 rounded-full backdrop-blur-md"></div>
          </FloatingElement>
        </div>
        <div className="absolute top-40 left-20 opacity-40">
          <FloatingElement delay={0.5} duration={5} yOffset={10}>
            <div className="bg-[#9b87f5]/10 w-14 h-14 rounded-full backdrop-blur-md"></div>
          </FloatingElement>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-16 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
          >
            <div className="w-full mb-6 flex justify-center">
              <div className="w-max">
                <SectionBadge title="Platform Features" />
              </div>
            </div>

            <h2 className="text-4xl font-bold mb-4  bg-gradient-to-r from-[#a89ed7] to-[#6f62c6] bg-clip-text text-transparent">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our platform provides all the tools necessary for meaningful and
              productive consultations.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </section>

      {/* Connection Showcase Section */}
      <section
        id="connect"
        className="container mx-auto px-6 py-16 relative z-10"
      >
        <div
          ref={connectRef}
          className="max-w-7xl mx-auto bg-gradient-dark  rounded-3xl p-12 backdrop-blur-[34px] shadow-[inset_0px_0px_55.5px_0px_#C5B9F626,inset_0px_0px_14px_0px_#FFFFFF33] relative overflow-hidden border border-[#C5B9F666]"
        >
          <motion.div
            className="relative z-10"
            initial="hidden"
            animate={connectControls}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  duration: 0.8,
                  staggerChildren: 0.2,
                },
              },
            }}
          >
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <motion.div
                  variants={{
                    hidden: { opacity: 0, x: -30 },
                    visible: {
                      opacity: 1,
                      x: 0,
                      transition: { duration: 0.6 },
                    },
                  }}
                >
                  <span className="bg-dark-100 text-[#9b87f5] font-medium py-1 px-3 rounded-full text-sm mb-4 inline-block border border-[#9b87f5]/30">
                    Seamless Communication
                  </span>
                  <h2 className="text-4xl font-bold mb-6  bg-gradient-to-r from-[#b3abd4] to-[#605895] bg-clip-text text-transparent">
                    Connect Your Way
                  </h2>
                  <p className="text-lg text-gray-300 mb-8">
                    Whether you prefer video for face-to-face interaction, audio
                    for on-the-go consultations, or text for quick questions,
                    our platform adapts to your communication style.
                  </p>

                  <div className="space-y-4">
                    {[
                      {
                        icon: <Video className="h-5 w-5" />,
                        text: "Crystal clear HD video calls",
                      },
                      {
                        icon: <Mic className="h-5 w-5" />,
                        text: "Premium audio quality",
                      },
                      {
                        icon: <MessageSquare className="h-5 w-5" />,
                        text: "Persistent chat history",
                      },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        variants={{
                          hidden: { opacity: 0, x: -20 },
                          visible: {
                            opacity: 1,
                            x: 0,
                            transition: {
                              delay: 0.3 + i * 0.1,
                              duration: 0.5,
                            },
                          },
                        }}
                        className="flex items-center space-x-3"
                      >
                        <div className="bg-[#9b87f5] p-2 rounded-full text-white">
                          {item.icon}
                        </div>
                        <span className="text-gray-300">{item.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              <motion.div
                variants={{
                  hidden: { opacity: 0, scale: 0.9 },
                  visible: {
                    opacity: 1,
                    scale: 1,
                    transition: {
                      delay: 0.2,
                      duration: 0.7,
                      ease: [0.22, 1, 0.36, 1],
                    },
                  },
                }}
                className="relative"
              >
                <div className="bg-dark-100/80 rounded-2xl shadow-xl p-6 z-10 relative border border-[#9b87f5]/20">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full bg-dark-200 flex items-center justify-center border border-[#9b87f5]/30">
                        <Users className="w-6 h-6 text-[#9b87f5]" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">
                          Dr. Sarah Johnson
                        </h4>
                        <p className="text-sm text-gray-400">
                          Financial Advisor
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 bg-dark-200 rounded-full border border-[#9b87f5]/30">
                        <Mic className="w-5 h-5 text-[#9b87f5]" />
                      </button>
                      <button className="p-2 bg-dark-200 rounded-full border border-[#9b87f5]/30">
                        <Video className="w-5 h-5 text-[#9b87f5]" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="bg-dark-200 p-3 rounded-2xl rounded-tl-none max-w-[80%] border border-[#9b87f5]/10">
                      <p className="text-gray-300">
                        Hi there! I've reviewed your financial portfolio and
                        have some recommendations.
                      </p>
                    </div>
                    <div className="bg-[#9b87f5]/20 p-3 rounded-2xl rounded-tr-none max-w-[80%] ml-auto border border-[#9b87f5]/20">
                      <p className="text-gray-300">
                        That's great! I'd love to hear your thoughts on
                        diversifying my investments.
                      </p>
                    </div>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      className="w-full py-3 px-4 bg-dark-200 text-white rounded-xl pr-12 border border-[#9b87f5]/20 focus:border-[#9b87f5]/50 focus:outline-none"
                    />
                    <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-[#9b87f5] rounded-lg">
                      <Sparkles className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-[#9b87f5]/10 rounded-full blur-3xl"></div>
                <div className="absolute -top-6 -left-6 w-64 h-64 bg-[#9b87f5]/5 rounded-full blur-3xl"></div>
              </motion.div>
            </div>
          </motion.div>

          {/* Background decorations */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-[#9b87f5]/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#9b87f5]/5 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
        </div>
      </section>

      {/* Call-to-action Section */}
      <section className="container mx-auto px-6 py-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl font-bold mb-6  bg-gradient-to-r from-[#a89ed7] to-[#6f62c6] bg-clip-text text-transparent">
            Ready to Connect with Experts?
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
            Join thousands of professionals who are leveraging expert knowledge
            to solve problems and drive growth.
          </p>

          <Link
            href={user?.publicMetadata?.role === "user" ? "/user" : "/expert"}
          >
            <ButtonCta
              label="Get Started Today"
              className="w-fit cursor-pointer hover:scale-[1.05] font-bold py-4 px-10 rounded-xl shadow-lg shadow-[#9b87f5]/30 text-lg"
            />
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default FeaturesSection;
