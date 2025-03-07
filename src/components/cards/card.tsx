import Link from "next/link";
import { MessageCircle, Phone, Star, Video } from "lucide-react";
import * as motion from "motion/react-client";

import { Button } from "@/components/ui/button";

export interface ExpertProps {
  id: string;
  name: string;
  title: string;
  category: string;
  rating: number;
  reviews: number;
  hourlyRate: number;
  imageUrl: string;
  availability: string;
  specialties: string[];
}

const ExpertCard = ({ expert }: { expert: ExpertProps }) => {
  return (
    <motion.div
      className="bg-gradient-to-br from-[#222222] to-[#1A1F2C] rounded-xl border border-border/20 overflow-hidden shadow-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5, transition: { duration: 0.3 } }}
    >
      <div className="overflow-hidden h-48 relative">
        <motion.img
          src={expert.imageUrl}
          alt={expert.name}
          className="w-full h-full object-cover"
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4 }}
        />
        <div className="absolute top-3 left-3">
          <span className="chip bg-black/50 backdrop-blur-sm text-white shadow-sm border border-white/10">
            {expert.category}
          </span>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center mb-1">
          <div className="flex text-amber-400 mr-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(expert.rating) ? "fill-current" : "opacity-30"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-400">({expert.reviews})</span>
        </div>
        <h3 className="font-semibold text-lg text-white">{expert.name}</h3>
        <p className="text-gray-400 text-sm mb-3">{expert.title}</p>

        <div className="flex flex-wrap gap-1 mb-3">
          {expert.specialties.slice(0, 3).map((specialty, index) => (
            <span
              key={index}
              className="chip bg-[#403E43]/70 text-gray-200 text-xs border border-white/5"
            >
              {specialty}
            </span>
          ))}
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="text-sm">
            <span className="text-gray-400">Available: </span>
            <span className="font-medium text-gray-300">
              {expert.availability}
            </span>
          </div>
          <div className="font-medium text-primary-foreground bg-primary/80 px-2 py-1 rounded-md text-sm">
            ${expert.hourlyRate}/hr
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center justify-center bg-[#221F26] border-white/10 text-gray-300 hover:bg-[#403E43]/50 hover:text-white"
          >
            <MessageCircle className="h-4 w-4 mr-1" />
            <span className="text-xs">Chat</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center justify-center bg-[#221F26] border-white/10 text-gray-300 hover:bg-[#403E43]/50 hover:text-white"
          >
            <Phone className="h-4 w-4 mr-1" />
            <span className="text-xs">Call</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center justify-center bg-[#221F26] border-white/10 text-gray-300 hover:bg-[#403E43]/50 hover:text-white"
          >
            <Video className="h-4 w-4 mr-1" />
            <span className="text-xs">Video</span>
          </Button>
        </div>

        <div className="mt-3">
          <Button
            asChild
            className="w-full rounded-lg bg-gradient-to-r from-[#403E43] to-[#221F26] hover:opacity-90 text-white"
            variant="default"
          >
            <Link href={`/expert/${expert.id}`}>View Profile</Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ExpertCard;
