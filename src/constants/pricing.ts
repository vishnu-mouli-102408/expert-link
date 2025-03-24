export type PlanFeature = {
  text: string;
  included: boolean;
};

export type Plan = {
  name: string;
  description: string;
  price: {
    monthly: number;
    yearly: number;
  };
  features: PlanFeature[];
  popular?: boolean;
};

export const PRICING_PLANS: Plan[] = [
  {
    name: "Starter",
    description: "Best for individuals seeking expert advice",
    price: {
      monthly: 10,
      yearly: 99,
    },
    features: [
      { text: "Book 5 Expert Calls per Month", included: true },
      { text: "Chat with Experts", included: true },
      { text: "Analytics", included: true },
      { text: "Email Support", included: true },
      { text: "Priority Booking", included: false },
      { text: "Dedicated Support", included: false },
    ],
  },
  {
    name: "Professional",
    description: "Ideal for professionals and small teams",
    price: {
      monthly: 20,
      yearly: 199,
    },
    popular: true,
    features: [
      { text: "Book 15 Expert Calls per Month", included: true },
      { text: "Unlimited Chat with Experts", included: true },
      { text: "Analytics", included: true },
      { text: "Priority Booking", included: true },
      { text: "Dedicated Support", included: true },
      { text: "Custom Consultation Workflows", included: false },
    ],
  },
  {
    name: "Enterprise",
    description: "For businesses and coaching platforms",
    price: {
      monthly: 49,
      yearly: 499,
    },
    features: [
      { text: "Unlimited Expert Calls", included: true },
      { text: "Priority Booking", included: true },
      { text: "Unlimited Chat with Experts", included: true },
      { text: "Custom Consultation Workflows", included: true },
      { text: "Admin Controls", included: true },
      { text: "24/7 Dedicated Support", included: true },
    ],
  },
];
