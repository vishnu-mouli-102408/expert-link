"use client";

import { useDbUser } from "@/hooks";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Award, Info, Lock, Phone, Save, User } from "lucide-react";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { client } from "@/lib/client";
import { getQueryClient } from "@/lib/get-query-client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import ProfileImageUpload from "./profile-image-upload";
import ProfileSection from "./profile-section";

const baseSchema = {
  profilePic: z.string().optional(),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username cannot exceed 30 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z
    .string()
    .refine(
      (value) =>
        value === "" ||
        /^(\+\d{1,3})?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(value),
      { message: "Please enter a valid phone number" }
    )
    .optional(),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  bio: z.string().optional(),
  //   expertise: z.string().optional(),
  gender: z.string().optional(),
};

const expertSchema = {
  ...baseSchema,
  expertise: z.string().optional(),
  certifications: z.string().optional(),
  yearsOfExperience: z.string().optional(),
  availability: z.string().optional(),
  hourlyRate: z.string().optional(),
};

const userSchema = {
  ...baseSchema,
  interests: z.string().optional(),
  preferences: z.string().optional(),
};

// Create Zod objects from the schema definitions
const expertSchemaObject = z.object(expertSchema);
const userSchemaObject = z.object(userSchema);

type ExpertFormValues = z.infer<typeof expertSchemaObject>;
type UserFormValues = z.infer<typeof userSchemaObject>;
type FormValues = ExpertFormValues | UserFormValues;

// Define the form schema with Zod
// const formSchema = z.object({
//   profilePic: z.string().optional(),
//   username: z
//     .string()
//     .min(3, "Username must be at least 3 characters")
//     .max(30, "Username cannot exceed 30 characters"),
//   firstName: z.string().min(1, "First name is required"),
//   lastName: z.string().min(1, "Last name is required"),
//   phone: z
//     .string()
//     .refine(
//       (value) =>
//         value === "" ||
//         /^(\+\d{1,3})?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(value),
//       { message: "Please enter a valid phone number" }
//     )
//     .optional(),
//   email: z.string().email("Invalid email address").min(1, "Email is required"),
//   bio: z.string().optional(),
//   expertise: z.string().optional(),
//   gender: z.string().optional(),
// });

// TypeScript type for our form values
// type FormValues = z.infer<typeof formSchema>;

const SettingsForm = () => {
  const queryClient = getQueryClient();

  const { data: userData } = useDbUser();

  const { user } = useUser();

  const isExpert = user?.publicMetadata?.role === "expert";

  console.log("IS EXPERT", isExpert);

  console.log("USER", userData);

  // Initialize the form with react-hook-form and zodResolver
  const form = useForm<FormValues>({
    resolver: zodResolver(isExpert ? expertSchemaObject : userSchemaObject),
    values: {
      profilePic: userData?.data?.profilePic || "",
      username: userData?.data?.username || "",
      firstName: userData?.data?.firstName || "",
      lastName: userData?.data?.lastName || "",
      phone: userData?.data?.phone || "",
      email: userData?.data?.email || "",
      bio: userData?.data?.bio || "",
      //   expertise: user?.data?.expertise || "",
      gender: userData?.data?.gender || "",
      ...(isExpert
        ? {
            certifications: userData?.data?.certifications || "",
            yearsOfExperience: userData?.data?.yearsOfExperience || "",
            availability: userData?.data?.availability || "",
            hourlyRate: userData?.data?.hourlyRate || "",
            expertise: userData?.data?.expertise || "",
          }
        : {
            interests: userData?.data?.interests || "",
            preferences: userData?.data?.preferences || "",
          }),
    },
  });

  // Form submission handler
  const onSubmit = async (data: FormValues) => {
    try {
      const updatedFields = Object.keys(form.formState.dirtyFields).reduce(
        (acc, key) => {
          acc[key as keyof FormValues] = data[key as keyof FormValues];
          return acc;
        },
        {} as Partial<FormValues>
      );
      console.log("Updated Fields:", updatedFields);
      onSubmitForm(updatedFields);
    } catch (error) {
      console.error("ERROR", error);
      toast.error("There was a problem.", {
        description:
          "Seems like there was an issue on our end. Please try again later.",
        duration: 3000,
        position: "bottom-center",
        closeButton: true,
      });
      return;
    }
  };

  const { mutateAsync: onSubmitForm, isPending } = useMutation({
    mutationFn: async (formData: Partial<FormValues>) => {
      const response = await client.auth.updateUserDetails.$post(formData);
      const result = await response.json();
      console.log("RESULT", result);
      return result;
    },
    onSuccess: (data) => {
      if (data?.success) {
        queryClient.invalidateQueries({ queryKey: ["user"] });
        toast.success("Settings Updated", {
          description: "Your Settings has been successfully updated.",
          duration: 3000,
          position: "bottom-center",
          closeButton: true,
        });
      } else {
        toast.error("There was a problem.", {
          description:
            "Seems like there was an issue on our end. Please try again later.",
          duration: 3000,
          position: "bottom-center",
          closeButton: true,
        });
      }
    },
    onError: (error) => {
      toast.error("There was a problem.", {
        description:
          "Seems like there was an issue on our end. Please try again later.",
        duration: 3000,
        position: "bottom-center",
        closeButton: true,
      });
    },
  });

  const inputVariants = {
    focus: { scale: 1.01, transition: { duration: 0.2 } },
    blur: { scale: 1, transition: { duration: 0.2 } },
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-2xl mx-auto"
      >
        <ProfileSection title="Profile Picture" index={0}>
          <FormField
            control={form.control}
            name="profilePic"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ProfileImageUpload
                    value={field.value || ""}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage className="text-red-400 text-xs mt-2 text-center" />
              </FormItem>
            )}
          />
        </ProfileSection>

        <ProfileSection title="Account Information" index={1}>
          <div className="grid grid-cols-1 gap-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium text-zinc-200">
                    Username
                  </FormLabel>
                  <div className="relative">
                    <motion.div
                      whileFocus="focus"
                      initial="blur"
                      animate="blur"
                    >
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-white/5 border-white/10 focus:border-white/20 transition-all duration-300 pl-9"
                        />
                      </FormControl>
                    </motion.div>
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <User size={16} className="text-zinc-500" />
                    </div>
                  </div>
                  <FormMessage className="text-red-400 text-xs" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-zinc-200">
                      First Name
                    </FormLabel>
                    <motion.div
                      whileFocus="focus"
                      initial="blur"
                      animate="blur"
                    >
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-white/5 border-white/10 focus:border-white/20 transition-all duration-300"
                        />
                      </FormControl>
                    </motion.div>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-zinc-200">
                      Last Name
                    </FormLabel>
                    <motion.div
                      whileFocus="focus"
                      initial="blur"
                      animate="blur"
                    >
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-white/5 border-white/10 focus:border-white/20 transition-all duration-300"
                        />
                      </FormControl>
                    </motion.div>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium text-zinc-200">
                    Phone Number
                  </FormLabel>
                  <div className="relative">
                    <motion.div
                      whileFocus="focus"
                      initial="blur"
                      animate="blur"
                    >
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="+1 (555) 555-5555"
                          className="bg-white/5 border-white/10 focus:border-white/20 transition-all duration-300 pl-9"
                        />
                      </FormControl>
                    </motion.div>
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <Phone size={16} className="text-zinc-500" />
                    </div>
                  </div>
                  <FormMessage className="text-red-400 text-xs" />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-zinc-200"
                >
                  Email Address
                </label>
                <div className="flex items-center text-xs text-zinc-400">
                  <Lock size={12} className="mr-1" />
                  <span>Cannot be changed</span>
                </div>
              </div>
              <div className="relative">
                <Input
                  id="email"
                  value={form.getValues("email")}
                  readOnly
                  className="bg-zinc-800/50 text-zinc-400 cursor-not-allowed border-white/5"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Info size={16} className="text-zinc-500" />
                </div>
              </div>
            </div>
          </div>
        </ProfileSection>

        <ProfileSection
          title="Profile Information"
          description="Tell us more about yourself"
          index={2}
        >
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium text-zinc-200">
                    Bio
                  </FormLabel>
                  <motion.div whileFocus="focus" initial="blur" animate="blur">
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Write a short bio about yourself..."
                        className="min-h-32 bg-white/5 border-white/10 focus:border-white/20 transition-all duration-300"
                      />
                    </FormControl>
                  </motion.div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem className="space-y-2 w-full">
                  <FormLabel className="text-sm font-medium text-zinc-200">
                    Gender
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    // defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white/5 cursor-pointer border-white/10 focus:border-white/20 transition-all duration-300">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="cursor-pointer bg-black">
                      <SelectItem
                        value="male"
                        className="hover:bg-gray-500/40  cursor-pointer transition-colors duration-300"
                      >
                        Male
                      </SelectItem>
                      <SelectItem
                        value="female"
                        className="hover:bg-gray-500/40  cursor-pointer transition-colors duration-300"
                      >
                        Female
                      </SelectItem>
                      <SelectItem
                        value="non-binary"
                        className="hover:bg-gray-500/40  cursor-pointer transition-colors duration-300"
                      >
                        Non-binary
                      </SelectItem>
                      <SelectItem
                        value="prefer-not-to-say"
                        className="hover:bg-gray-500/40 cursor-pointer transition-colors duration-300"
                      >
                        Prefer not to say
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* Expert-specific fields */}
            {isExpert && (
              <>
                <FormField
                  control={form.control}
                  name="expertise"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-zinc-200">
                        Areas of Expertise
                      </FormLabel>
                      <motion.div
                        whileFocus="focus"
                        initial="blur"
                        animate="blur"
                      >
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="e.g. Design, Development, Marketing"
                            className="bg-white/5 border-white/10 focus:border-white/20 transition-all duration-300"
                          />
                        </FormControl>
                      </motion.div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="certifications"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-zinc-200">
                        Certifications
                      </FormLabel>
                      <div className="relative">
                        <motion.div
                          whileFocus="focus"
                          initial="blur"
                          animate="blur"
                        >
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="e.g. AWS Certified, Google Analytics, PMP"
                              className="bg-white/5 border-white/10 focus:border-white/20 transition-all duration-300 pl-9"
                            />
                          </FormControl>
                        </motion.div>
                        <div className="absolute left-3 top-1/2 -translate-y-1/2">
                          <Award size={16} className="text-zinc-500" />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="yearsOfExperience"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-medium text-zinc-200">
                          Years of Experience
                        </FormLabel>
                        <motion.div
                          whileFocus="focus"
                          initial="blur"
                          animate="blur"
                        >
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              min="0"
                              placeholder="e.g. 5"
                              className="bg-white/5 border-white/10 focus:border-white/20 transition-all duration-300"
                            />
                          </FormControl>
                        </motion.div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="hourlyRate"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-medium text-zinc-200">
                          Hourly Rate ($)
                        </FormLabel>
                        <motion.div
                          whileFocus="focus"
                          initial="blur"
                          animate="blur"
                        >
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              min="0"
                              placeholder="e.g. 75"
                              className="bg-white/5 border-white/10 focus:border-white/20 transition-all duration-300"
                            />
                          </FormControl>
                        </motion.div>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="availability"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-zinc-200">
                        Availability
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        // defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-white/5 cursor-pointer border-white/10 focus:border-white/20 transition-all duration-300">
                            <SelectValue placeholder="Select availability" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="cursor-pointer bg-black">
                          <SelectItem
                            className="hover:bg-gray-500/40  cursor-pointer transition-colors duration-300"
                            value="full-time"
                          >
                            Full-time
                          </SelectItem>
                          <SelectItem
                            className="hover:bg-gray-500/40  cursor-pointer transition-colors duration-300"
                            value="part-time"
                          >
                            Part-time
                          </SelectItem>
                          <SelectItem
                            className="hover:bg-gray-500/40  cursor-pointer transition-colors duration-300"
                            value="weekends"
                          >
                            Weekends only
                          </SelectItem>
                          <SelectItem
                            className="hover:bg-gray-500/40  cursor-pointer transition-colors duration-300"
                            value="evenings"
                          >
                            Evenings only
                          </SelectItem>
                          <SelectItem
                            className="hover:bg-gray-500/40  cursor-pointer transition-colors duration-300"
                            value="custom"
                          >
                            Custom schedule
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </>
            )}

            {/* User-specific fields */}
            {!isExpert && (
              <>
                <FormField
                  control={form.control}
                  name="interests"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-zinc-200">
                        Interests
                      </FormLabel>
                      <motion.div
                        whileFocus="focus"
                        initial="blur"
                        animate="blur"
                      >
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="What topics are you interested in learning about?"
                            className="min-h-24 bg-white/5 border-white/10 focus:border-white/20 transition-all duration-300"
                          />
                        </FormControl>
                      </motion.div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="preferences"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-zinc-200">
                        Preferences
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        // defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-white/5 cursor-pointer border-white/10 focus:border-white/20 transition-all duration-300">
                            <SelectValue placeholder="Select preferred learning style" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="cursor-pointer bg-black">
                          <SelectItem
                            className="hover:bg-gray-500/40  cursor-pointer transition-colors duration-300"
                            value="audio"
                          >
                            Audio Call
                          </SelectItem>
                          <SelectItem
                            className="hover:bg-gray-500/40  cursor-pointer transition-colors duration-300"
                            value="video"
                          >
                            Video Call
                          </SelectItem>
                          <SelectItem
                            className="hover:bg-gray-500/40  cursor-pointer transition-colors duration-300"
                            value="chat"
                          >
                            Text-based chat
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
        </ProfileSection>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.3,
          }}
          className="flex justify-end"
        >
          <Button
            type="submit"
            disabled={isPending}
            className="px-8 glass-effect cursor-pointer hover:bg-white/10 text-white border-white/10"
          >
            {isPending ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="mr-2 h-4 w-4 border-2 border-zinc-400 border-t-white rounded-full"
              />
            ) : (
              <Save size={16} className="mr-2" />
            )}
            Save Changes
          </Button>
        </motion.div>
      </form>
    </Form>
  );
};

export default SettingsForm;
