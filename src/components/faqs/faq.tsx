import { FAQS } from "@/constants";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import AnimationContainer from "../global/animation-container";
import MaxWidthWrapper from "../global/max-width-wrapper";
import SectionBadge from "../ui/section-badge";

const FAQ = () => {
  return (
    <section className="bg-gradient-to-r from-gray-900 to-slate-900 via-stone-950">
      <MaxWidthWrapper className="py-20 lg:py-32">
        <div className="flex flex-col items-center text-center gap-4">
          <AnimationContainer animation="fadeUp" delay={0.2}>
            <SectionBadge title="FAQ" />
          </AnimationContainer>

          <AnimationContainer animation="fadeUp" delay={0.3}>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-medium !leading-tight text-transparent bg-clip-text bg-gradient-to-b from-foreground to-neutral-500">
              Answers to All Your Questions
            </h2>
          </AnimationContainer>

          <AnimationContainer animation="fadeUp" delay={0.4}>
            <p className="text-sm md:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
              Get answers to the most common questions and learn how to make the
              most of our services.
            </p>
          </AnimationContainer>
        </div>

        <div className="max-w-3xl mx-auto pt-10">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {FAQS.map((item, index) => (
              <AnimationContainer
                key={index}
                animation="fadeUp"
                delay={0.5 + index * 0.1}
              >
                <AccordionItem
                  value={`item-${index}`}
                  className="border-none  bg-[#191919] rounded-2xl px-6"
                >
                  <AccordionTrigger className="hover:no-underline cursor-pointer py-6 text-base md:text-lg text-left font-normal">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-left transition-all duration-300 ease-in-out">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              </AnimationContainer>
            ))}
          </Accordion>
        </div>
      </MaxWidthWrapper>
    </section>
  );
};

export default FAQ;
