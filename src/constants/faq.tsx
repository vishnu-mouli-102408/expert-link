export type FAQItem = {
  question: string;
  answer: string;
};

export const FAQS: FAQItem[] = [
  {
    question: "How does the expert consultation process work?",
    answer:
      "Simply browse our list of experts, select the one that fits your needs, and schedule a session. You can connect via video, audio, or chat for real-time consultation. Payments are handled securely through our platform.",
  },
  {
    question: "Can I chat with an expert before booking a session?",
    answer:
      "Yes! Some experts offer free initial chats to help you understand how they can assist you. Look for the 'Free Chat' option on the expert’s profile.",
  },
  {
    question: "How do payments work for consultations?",
    answer:
      "Payments are securely processed through our platform. You can choose a pay-per-session model or subscribe to a plan for discounted rates on multiple consultations.",
  },
  {
    question: "Are consultations recorded for later access?",
    answer:
      "No, as of now consultations are not recorded. However, you can take notes during the session or request a summary from the expert afterward.",
  },
  {
    question: "What if I need to reschedule or cancel a session?",
    answer:
      "You can reschedule or cancel up to 24 hours before the session without any extra charge. Last-minute cancellations may be subject to a fee as per the expert's policy.",
  },
  {
    question: "What kind of support do you provide?",
    answer:
      "We offer 24/7 customer support via live chat, email, and phone to help with technical issues, billing inquiries, and platform navigation.",
  },
];
