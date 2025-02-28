import * as motion from "motion/react-client";

import Icons from "../global/icons";
import MaxWidthWrapper from "../global/max-width-wrapper";

const LogoTicker = () => {
  const companies = [
    Icons.comp1,
    Icons.comp2,
    Icons.comp3,
    Icons.comp4,
    Icons.comp5,
    Icons.comp6,
  ];
  return (
    <section className=" md:py-20 py-16 bg-gray-950/90">
      <MaxWidthWrapper className="lg:px-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          viewport={{ amount: 0.5 }}
        >
          <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_20%,black_0%,transparent)]">
            <motion.div
              animate={{ translateX: "-50%" }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
                repeatType: "loop",
              }}
              className="flex gap-14 flex-none"
            >
              {[...Array(20)].map((_, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center text-muted-foreground h-16"
                >
                  {companies?.[index % companies?.length]?.({
                    className: "w-auto h-6",
                  })}
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </MaxWidthWrapper>
    </section>
  );
};

export default LogoTicker;
