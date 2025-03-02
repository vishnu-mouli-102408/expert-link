"use client";

import { useState } from "react";
import { PRICING_PLANS } from "@/constants";
import NumberFlow from "@number-flow/react";
import { Check, X } from "lucide-react";

import { cn } from "@/lib/utils";

import AnimationContainer from "../global/animation-container";
import MaxWidthWrapper from "../global/max-width-wrapper";
import SectionBadge from "../ui/section-badge";

const Pricing = () => {
  const [isYearly, setIsYearly] = useState<boolean>(false);

  return (
    <section
      id="pricing"
      className="bg-gradient-to-r from-[#00002a] to-[#000022]"
    >
      <MaxWidthWrapper className="py-20 lg:py-32 ">
        <div className="flex flex-col items-center text-center gap-4">
          <AnimationContainer animation="fadeUp" delay={0.2}>
            <SectionBadge title="Pricing" />
          </AnimationContainer>

          <AnimationContainer animation="fadeUp" delay={0.3}>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-medium !leading-tight text-transparent bg-clip-text bg-gradient-to-b from-foreground to-neutral-400">
              Choose your perfect plan
            </h2>
          </AnimationContainer>

          <AnimationContainer animation="fadeUp" delay={0.4}>
            <p className="text-sm md:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
              Select the plan that best suits your needs. If you need any
              assistance, feel free to contact us.
            </p>
          </AnimationContainer>
        </div>

        <AnimationContainer animation="fadeUp" delay={0.5}>
          <div className="flex items-center justify-center gap-4 pt-10">
            <button
              onClick={() => setIsYearly(false)}
              className={cn(
                "text-sm font-medium transition-colors",
                !isYearly ? "text-foreground" : "text-muted-foreground"
              )}
            >
              Monthly
            </button>
            <div
              onClick={() => setIsYearly(!isYearly)}
              className="h-6 w-11 rounded-full bg-neutral-800 p-1 cursor-pointer transition-colors duration-300"
            >
              <div
                className={cn(
                  "h-4 w-4 rounded-full bg-gradient-to-b from-primary to-[#C5B9F6] transition-transform duration-300",
                  isYearly && "translate-x-5"
                )}
              />
            </div>
            <button
              onClick={() => setIsYearly(true)}
              className={cn(
                "text-sm font-medium transition-colors",
                isYearly ? "text-foreground" : "text-muted-foreground"
              )}
            >
              Yearly
            </button>
          </div>
        </AnimationContainer>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-10">
          {PRICING_PLANS.map((plan, index) => (
            <AnimationContainer
              key={index}
              animation="fadeUp"
              delay={0.6 + index * 0.2}
            >
              <div
                className={cn(
                  "relative rounded-3xl hover:scale-[1.02] transiti duration-500 ease-in-out backdrop-blur-3xl p-8 flex cursor-pointer flex-col overflow-hidden",
                  plan.popular &&
                    "bg-[#C5B9F60D]  shadow-[inset_0px_0px_55.5px_0px_#C5B9F626] relative border border-[#C5B9F666]",
                  !plan.popular &&
                    "bg-[#FFFFFF03] border backdrop-blur-[34px] border-[#C5B9F633] shadow-[inset_0px_0px_55.5px_0px_#C5B9F626]"
                )}
              >
                <AnimationContainer
                  animation="fadeUp"
                  delay={0.7 + index * 0.2}
                >
                  <div className="mb-8">
                    <h3 className="text-xl font-medium mb-2">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {plan.description}
                    </p>
                  </div>
                </AnimationContainer>

                <AnimationContainer
                  animation="fadeUp"
                  delay={0.8 + index * 0.2}
                >
                  <div className="flex items-baseline gap-2 mb-8">
                    <span className="text-4xl font-medium">$</span>
                    <span className="text-5xl font-medium">
                      <NumberFlow
                        value={
                          isYearly ? plan.price.yearly : plan.price.monthly
                        }
                      />
                    </span>
                    <span className="text-muted-foreground">
                      /{isYearly ? "year" : "month"}
                    </span>
                  </div>
                </AnimationContainer>

                <div className="flex-1">
                  <AnimationContainer
                    animation="fadeUp"
                    delay={0.9 + index * 0.2}
                  >
                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className="flex items-center gap-3"
                        >
                          {feature.included ? (
                            <Check className="w-5 h-5 text-primary" />
                          ) : (
                            <X className="w-5 h-5 text-muted-foreground" />
                          )}
                          <span
                            className={cn(
                              "text-sm",
                              feature.included
                                ? "text-foreground"
                                : "text-muted-foreground"
                            )}
                          >
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </AnimationContainer>
                </div>

                <AnimationContainer animation="fadeUp" delay={1 + index * 0.2}>
                  <button
                    className={`w-full rounded-xl cursor-pointer transition-all duration-300 ease-in-out hover:scale-[1.02] p-2 ${plan.popular ? "bg-[#FFFFFF0D] border shadow-[inset_0px_0px_20px_0px_#FFFFFF33] border-[#FFFFFF26] hover:bg-[#FFFFFF1A] hover:border hover:border-[#FFFFFF66] hover:shadow-[inset_0px_0px_30px_0px_#FFFFFF4D]" : "hover:bg-[#FFFFFF0D] hover:border hover:shadow-[inset_0px_0px_20px_0px_#FFFFFF33] hover:border-[#FFFFFF26] border border-[#FFFFFF26] shadow-[inset_0px_0px_20px_0px_#FFFFFF33]"}`}
                  >
                    Get Started
                  </button>
                </AnimationContainer>
              </div>
            </AnimationContainer>
          ))}
        </div>
      </MaxWidthWrapper>
    </section>
  );
};

export default Pricing;
