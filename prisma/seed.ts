import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const expertsData = [
    {
      externalId: "EX-001",
      email: "sarah.johnson@example.com",
      role: Role.EXPERT,
      firstName: "Sarah",
      lastName: "Johnson",
      gender: "Female",
      bio: "Software Engineering Lead with expertise in system architecture and cloud infrastructure.",
      expertise: "Software Engineering",
      profilePic:
        "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e",
      phone: "+1234567890",
      username: "sarahjohnson",
      certifications:
        "AWS Certified Solutions Architect, Google Cloud Professional Architect",
      yearsOfExperience: "12",
      availability: "Weekdays",
      hourlyRate: "120",
      interests: "Technology, AI, Leadership",
      preferences: "Remote Consulting",
    },
    {
      externalId: "EX-002",
      email: "michael.chen@example.com",
      role: Role.EXPERT,
      firstName: "Michael",
      lastName: "Chen",
      gender: "Male",
      bio: "Senior Frontend Developer with expertise in React, UI/UX, and performance optimization.",
      expertise: "Frontend Development",
      profilePic:
        "https://images.unsplash.com/photo-1568602471122-7832951cc4c5",
      phone: "+1987654321",
      username: "michaelchen",
      certifications: "Certified React Developer, Google UX Design Certificate",
      yearsOfExperience: "8",
      availability: "Evenings & Weekends",
      hourlyRate: "95",
      interests: "Web Technologies, Design, Open Source",
      preferences: "Remote & In-Person Consulting",
    },
    {
      externalId: "EX-003",
      email: "jessica.barnes@example.com",
      role: Role.EXPERT,
      firstName: "Jessica",
      lastName: "Barnes",
      gender: "Female",
      bio: "Corporate Attorney specializing in contracts, intellectual property, and business law.",
      expertise: "Legal",
      profilePic:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956",
      phone: "+1122334455",
      username: "jessicabarnes",
      certifications: "Juris Doctor (JD), Certified Corporate Law Expert",
      yearsOfExperience: "15",
      availability: "Mon, Wed, Fri",
      hourlyRate: "150",
      interests: "Law, Business Ethics, Intellectual Property",
      preferences: "Video Consultations",
    },
    {
      externalId: "EX-004",
      email: "robert.kim@example.com",
      role: Role.EXPERT,
      firstName: "Robert",
      lastName: "Kim",
      gender: "Male",
      bio: "Data Science Consultant with expertise in machine learning, big data, and analytics.",
      expertise: "Data Science",
      profilePic:
        "https://images.unsplash.com/photo-1531384441138-2736e62e0919",
      phone: "+1345678901",
      username: "robertkim",
      certifications: "Google Data Engineer, AWS Machine Learning Specialty",
      yearsOfExperience: "10",
      availability: "Flexible",
      hourlyRate: "135",
      interests: "AI, Big Data, Data Visualization",
      preferences: "Remote Consulting",
    },
    {
      externalId: "EX-005",
      email: "olivia.rodriguez@example.com",
      role: Role.EXPERT,
      firstName: "Olivia",
      lastName: "Rodriguez",
      gender: "Female",
      bio: "UX Research Specialist focused on user testing, prototyping, and information architecture.",
      expertise: "UX Research",
      profilePic:
        "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56",
      phone: "+1654321890",
      username: "oliviarodriguez",
      certifications:
        "Certified UX Researcher, Nielsen Norman Group UX Certificate",
      yearsOfExperience: "7",
      availability: "Tues, Thurs",
      hourlyRate: "85",
      interests: "Design Thinking, User Behavior, Usability Testing",
      preferences: "Remote Consulting",
    },
    {
      externalId: "EX-006",
      email: "david.thomas@example.com",
      role: Role.EXPERT,
      firstName: "David",
      lastName: "Thomas",
      gender: "Male",
      bio: "Financial Advisor specializing in investment planning, retirement, and tax strategy.",
      expertise: "Finance",
      profilePic:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      phone: "+1789561234",
      username: "davidthomas",
      certifications: "Certified Financial Planner (CFP), CFA Level 2",
      yearsOfExperience: "14",
      availability: "Weekdays",
      hourlyRate: "110",
      interests: "Stock Market, Wealth Management, Financial Planning",
      preferences: "In-Person & Remote Consulting",
    },
    {
      externalId: "EX-007",
      email: "emma.wilson@example.com",
      role: Role.EXPERT,
      firstName: "Emma",
      lastName: "Wilson",
      gender: "Female",
      bio: "Marketing Director specializing in digital strategy, brand development, and growth marketing.",
      expertise: "Marketing",
      profilePic:
        "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604",
      phone: "+1908765432",
      username: "emmawilson",
      certifications:
        "Google Digital Marketing Certification, HubSpot Content Marketing",
      yearsOfExperience: "11",
      availability: "Mon-Fri",
      hourlyRate: "130",
      interests: "Branding, Digital Advertising, Consumer Psychology",
      preferences: "Remote Consulting",
    },
    {
      externalId: "EX-008",
      email: "james.lee@example.com",
      role: Role.EXPERT,
      firstName: "James",
      lastName: "Lee",
      gender: "Male",
      bio: "Healthcare Consultant with expertise in hospital operations and medical technology.",
      expertise: "Healthcare",
      profilePic:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d",
      phone: "+1321654987",
      username: "jameslee",
      certifications: "MD, Certified Healthcare Consultant",
      yearsOfExperience: "18",
      availability: "By Appointment",
      hourlyRate: "175",
      interests: "Healthcare Innovation, Patient Experience, Telemedicine",
      preferences: "Video Consultations",
    },
    {
      externalId: "EX-009",
      email: "alex.morgan@example.com",
      role: Role.EXPERT,
      firstName: "Alex",
      lastName: "Morgan",
      gender: "Male",
      bio: "Education Specialist with experience in curriculum development and online learning.",
      expertise: "Education",
      profilePic:
        "https://images.unsplash.com/photo-1629425733761-caae3b5f2e50",
      phone: "+1456983210",
      username: "alexmorgan",
      certifications:
        "Certified Instructional Designer, Google Educator Level 2",
      yearsOfExperience: "9",
      availability: "Afternoons",
      hourlyRate: "80",
      interests: "E-learning, Pedagogy, Education Technology",
      preferences: "Remote Consulting",
    },
    {
      externalId: "EX-010",
      email: "sophia.patel@example.com",
      role: Role.EXPERT,
      firstName: "Sophia",
      lastName: "Patel",
      gender: "Female",
      bio: "UX/UI Designer with expertise in product design, interaction design, and design systems.",
      expertise: "UX/UI Design",
      profilePic:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      phone: "+1567894321",
      username: "sophiapatel",
      certifications:
        "Google UX Design Certificate, Interaction Design Foundation",
      yearsOfExperience: "10",
      availability: "Weekdays",
      hourlyRate: "105",
      interests: "Human-Centered Design, Prototyping, Design Thinking",
      preferences: "Remote Consulting",
    },
  ];

  await prisma.user.createMany({
    data: expertsData,
    skipDuplicates: true, // Avoid duplicate insertion errors
  });

  // Create Users (Experts & Regular Users)
  //   const user1 = await prisma.user.create({
  //     data: {
  //       email: "user2@example.com",
  //       firstName: "Chris",
  //       lastName: "Don",
  //       role: "USER",
  //       gender: "Male",
  //       bio: "Just a regular user.",
  //       phone: "+1234567890",
  //       username: "john_doe",
  //     },
  //   });

  //   const expert1 = await prisma.user.create({
  //     data: {
  //       email: "expert2@example.com",
  //       firstName: "Mark",
  //       lastName: "Wood",
  //       role: "EXPERT",
  //       gender: "Female",
  //       bio: "Marketing expert with 10+ years of experience.",
  //       expertise: "Marketing",
  //       phone: "+9876543210",
  //       username: "jane_smith",
  //       certifications: "MBA in Digital Marketing",
  //       yearsOfExperience: "10",
  //       availability: "Monday-Friday, 10 AM - 5 PM",
  //       hourlyRate: "50",
  //     },
  //   });

  // Create Mock Calls
  //   await prisma.call.createMany({
  //     data: [
  //       {
  //         userId: user1.id,
  //         expertId: expert1.id,
  //         callType: "VIDEO",
  //         duration: 30, // in minutes
  //         startedAt: new Date(),
  //         status: "COMPLETED",
  //       },
  //       {
  //         userId: user1.id,
  //         expertId: expert1.id,
  //         callType: "AUDIO",
  //         duration: 20,
  //         startedAt: new Date(),
  //         status: "COMPLETED",
  //       },
  //     ],
  //   });

  // Create Mock Messages
  //   await prisma.message.createMany({
  //     data: [
  //       {
  //         senderId: user1.id,
  //         receiverId: expert1.id,
  //         content: "Hello, I need help with marketing!",
  //         sentAt: new Date(),
  //         messageType: "TEXT",
  //       },
  //       {
  //         senderId: expert1.id,
  //         receiverId: user1.id,
  //         content: "Sure! What do you need help with?",
  //         sentAt: new Date(),
  //         messageType: "TEXT",
  //       },
  //     ],
  //   });

  // Create Scheduled Calls
  //   await prisma.scheduledCall.createMany({
  //     data: [
  //       {
  //         userId: user1.id,
  //         expertId: expert1.id,
  //         scheduledAt: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
  //         callType: "VIDEO",
  //       },
  //     ],
  //   });

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
