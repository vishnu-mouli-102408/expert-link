"use client";

import { Calendar, Clock, Phone, TrendingUp, Users, Video } from "lucide-react";
import { motion } from "motion/react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { fadeInUp, staggerContainer } from "@/lib/framer-animations";

import { User } from "../animations/user";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

// Mock data for the dashboard
const analyticsData = [
  {
    title: "Total Calls",
    value: "124",
    icon: Phone,
    change: "+12%",
    color: "bg-indigo-500",
  },
  {
    title: "Active Experts",
    value: "48",
    icon: Users,
    change: "+5%",
    color: "bg-emerald-500",
  },
  {
    title: "Avg. Call Duration",
    value: "24m",
    icon: Clock,
    change: "-3%",
    color: "bg-amber-500",
  },
  {
    title: "Upcoming Calls",
    value: "8",
    icon: Calendar,
    change: "+2%",
    color: "bg-rose-500",
  },
];

const recentCalls = [
  {
    id: 1,
    expert: "Dr. Sarah Johnson",
    type: "Video",
    date: "Today, 2:30 PM",
    duration: "45 min",
    status: "Completed",
  },
  {
    id: 2,
    expert: "Michael Chen",
    type: "Audio",
    date: "Today, 11:15 AM",
    duration: "30 min",
    status: "Completed",
  },
  {
    id: 3,
    expert: "Jessica Barnes",
    type: "Video",
    date: "Yesterday, 4:00 PM",
    duration: "60 min",
    status: "Completed",
  },
  {
    id: 4,
    expert: "Robert Kim",
    type: "Audio",
    date: "Yesterday, 10:30 AM",
    duration: "15 min",
    status: "Missed",
  },
  {
    id: 5,
    expert: "Emma Wilson",
    type: "Video",
    date: "May 12, 2:00 PM",
    duration: "30 min",
    status: "Cancelled",
  },
];

const upcomingCalls = [
  {
    id: 1,
    expert: "Olivia Rodriguez",
    type: "Video",
    date: "Tomorrow, 3:00 PM",
    duration: "45 min",
  },
  {
    id: 2,
    expert: "David Thomas",
    type: "Audio",
    date: "Tomorrow, 5:30 PM",
    duration: "30 min",
  },
  {
    id: 3,
    expert: "Dr. James Lee",
    type: "Video",
    date: "May 15, 10:00 AM",
    duration: "60 min",
  },
];

const UserOverview = () => {
  // Enhanced data for the chat activity chart
  const chatActivityData = [
    { day: "Mon", calls: 5, messages: 12, meetings: 2 },
    { day: "Tue", calls: 8, messages: 15, meetings: 3 },
    { day: "Wed", calls: 6, messages: 10, meetings: 1 },
    { day: "Thu", calls: 9, messages: 18, meetings: 4 },
    { day: "Fri", calls: 4, messages: 8, meetings: 2 },
    { day: "Sat", calls: 3, messages: 5, meetings: 1 },
    { day: "Sun", calls: 7, messages: 9, meetings: 3 },
  ];

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <motion.h1
          variants={fadeInUp}
          className="md:text-2xl text-xl font-bold text-white"
        >
          Dashboard Overview
        </motion.h1>
        <motion.div variants={fadeInUp}>
          <Select
          // onValueChange={field.onChange}
          // defaultValue={"7days"}
          // value={field.value}
          >
            <SelectTrigger className="bg-white/5 px-4 cursor-pointer rounded-xl text-gray-300 border-white/10  transition-all duration-300">
              <SelectValue placeholder="Select Filter" />
            </SelectTrigger>
            <SelectContent className="cursor-pointer bg-black">
              <SelectItem
                value="7days"
                className="hover:bg-gray-500/40  cursor-pointer transition-colors duration-300"
              >
                Last 7 days
              </SelectItem>
              <SelectItem
                value="30days"
                className="hover:bg-gray-500/40  cursor-pointer transition-colors duration-300"
              >
                Last 30 days
              </SelectItem>
              <SelectItem
                value="90days"
                className="hover:bg-gray-500/40  cursor-pointer transition-colors duration-300"
              >
                Last 90 days
              </SelectItem>
              <SelectItem
                value="thisyear"
                className="hover:bg-gray-500/40 cursor-pointer transition-colors duration-300"
              >
                This Year
              </SelectItem>
            </SelectContent>
          </Select>
        </motion.div>
      </div>

      {/* Analytics Cards */}
      <motion.div
        variants={fadeInUp}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {analyticsData.map((item, index) => (
          <div
            key={index}
            className="bg-gradient-to-br hover:scale-[1.01] transition-all duration-300 ease-in-out cursor-pointer hover:shadow-[inset_0px_0px_16px_0px_#FFFFFF20] backdrop-blur-[30px] from-[#222222] to-[#1A1F2C] rounded-xl border border-white/10 hover:border-white/20 p-5 shadow-lg"
          >
            <div className="flex justify-between md:items-start items-center">
              <div>
                <p className="text-gray-400 text-sm">{item.title}</p>
                <h3 className="text-2xl font-bold text-white mt-1">
                  {item.value}
                </h3>
                <div
                  className={`flex items-center mt-2 ${item.change.startsWith("+") ? "text-green-400" : "text-red-400"}`}
                >
                  <TrendingUp className="h-3.5 w-3.5 mr-1" />
                  <span className="text-xs">{item.change} from last week</span>
                </div>
              </div>
              <div className={`${item.color} p-2 rounded-lg bg-opacity-20`}>
                <item.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Updated Chat Activity Chart */}
        <motion.div
          variants={fadeInUp}
          className="bg-gradient-to-br hover:scale-[1.003] transition-all duration-300 ease-in-out cursor-pointer hover:shadow-[inset_0px_0px_16px_0px_#FFFFFF10] backdrop-blur-[30px] hover:border-white/20 from-[#171717] to-[#0e1118] rounded-xl border border-white/10 md:p-5 p-4 shadow-lg lg:col-span-2"
        >
          <div className="flex flex-col md:flex-row gap-2 items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">
              Communication Activity
            </h2>
            <div className="flex space-x-3">
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-indigo-500 mr-1.5"></span>
                <span className="text-xs text-gray-400">Calls</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-emerald-500 mr-1.5"></span>
                <span className="text-xs text-gray-400">Messages</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-amber-500 mr-1.5"></span>
                <span className="text-xs text-gray-400">Meetings</span>
              </div>
            </div>
          </div>
          <div className="h-64 -ml-8">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chatActivityData}
                margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient
                    id="colorMessages"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient
                    id="colorMeetings"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#333"
                  vertical={false}
                />
                <XAxis
                  dataKey="day"
                  stroke="#666"
                  tick={{ fill: "#888", fontSize: 12 }}
                />
                <YAxis stroke="#666" tick={{ fill: "#888", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2129",
                    borderColor: "#333",
                    color: "white",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                  }}
                  itemStyle={{ color: "white" }}
                  labelStyle={{ color: "gray" }}
                />
                <Area
                  type="monotone"
                  dataKey="calls"
                  stroke="#8B5CF6"
                  fillOpacity={1}
                  fill="url(#colorCalls)"
                />
                <Area
                  type="monotone"
                  dataKey="messages"
                  stroke="#10B981"
                  fillOpacity={0.8}
                  fill="url(#colorMessages)"
                />
                <Area
                  type="monotone"
                  dataKey="meetings"
                  stroke="#F59E0B"
                  fillOpacity={0.6}
                  fill="url(#colorMeetings)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Upcoming Calls */}
        <motion.div
          variants={fadeInUp}
          className="bg-gradient-to-br hover:scale-[1.004] transition-all duration-300 ease-in-out cursor-pointer hover:shadow-[inset_0px_0px_16px_0px_#FFFFFF10] backdrop-blur-[30px] hover:border-white/20 from-[#151414] to-[#0b0d13] rounded-xl border border-white/10 p-5 shadow-lg"
        >
          <h2 className="text-lg font-semibold text-white mb-4">
            Upcoming Calls
          </h2>
          <div className="space-y-4">
            {upcomingCalls.map((call) => (
              <div
                key={call.id}
                className="flex items-center space-x-3 p-3 rounded-lg bg-[#2A2F3C] border border-white/5"
              >
                <div className="w-10 h-10 rounded-full bg-[#403E43] flex items-center justify-center flex-shrink-0">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {call.expert}
                  </p>
                  <div className="flex items-center text-xs text-gray-400 mt-1">
                    <span className="mr-2">{call.date}</span>
                    <span className="mr-2">•</span>
                    <span>{call.duration}</span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  {call.type === "Video" ? (
                    <Video className="h-4 w-4 text-primary" />
                  ) : (
                    <Phone className="h-4 w-4 text-primary" />
                  )}
                </div>
              </div>
            ))}
            <button className="w-full text-sm text-center cursor-pointer text-primary hover:text-primary/80 mt-2">
              View All Upcoming Calls
            </button>
          </div>
        </motion.div>
      </div>

      {/* Recent Call History */}
      <motion.div
        variants={fadeInUp}
        className="bg-gradient-to-br hover:scale-[1.002] transition-all duration-300 ease-in-out cursor-pointer hover:shadow-[inset_0px_0px_16px_0px_#FFFFFF10] backdrop-blur-[30px] hover:border-white/20 from-[#191919] to-[#11151d] rounded-xl border border-white/10 p-5 shadow-lg"
      >
        <h2 className="text-lg font-semibold text-white mb-4">
          Recent Call History
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="text-left  text-gray-400 text-xs border-b border-white/10">
                <th className="pb-3 pr-2 font-medium">Expert</th>
                <th className="pb-3 px-2 font-medium">Type</th>
                <th className="pb-3 px-2 font-medium">Date & Time</th>
                <th className="pb-3 px-2 font-medium">Duration</th>
                <th className="pb-3 pl-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {recentCalls.map((call) => (
                <tr key={call.id} className="text-sm">
                  <td className="py-3 pr-2 text-white">{call.expert}</td>
                  <td className="py-3 px-2 text-gray-300">
                    {call.type === "Video" ? (
                      <div className="flex items-center">
                        <Video className="h-4 w-4 text-indigo-400 mr-1" />
                        <span>Video</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-emerald-400 mr-1" />
                        <span>Audio</span>
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-2 text-gray-300">{call.date}</td>
                  <td className="py-3 px-2 text-gray-300">{call.duration}</td>
                  <td className="py-3 pl-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        call.status === "Completed"
                          ? "bg-green-500/20 text-green-400"
                          : call.status === "Missed"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {call.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-center">
          <button className="text-sm text-primary cursor-pointer hover:text-primary/80">
            View Full Call History
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default UserOverview;
