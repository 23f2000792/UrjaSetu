import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Award, Leaf, TrendingUp, Users } from "lucide-react";

const badges = [
    { icon: <Award className="w-8 h-8 text-yellow-400" />, title: "Green Pioneer", description: "Joined UrjaSetu in the first month of launch." },
    { icon: <TrendingUp className="w-8 h-8 text-blue-400" />, title: "Top Trader", description: "Achieved a trading volume of over $100,000." },
    { icon: <Leaf className="w-8 h-8 text-green-400" />, title: "Energy Saver", description: "Offset more than 10,000 kg of CO2." },
    { icon: <Users className="w-8 h-8 text-indigo-400" />, title: "Community Builder", description: "Successfully referred 5 new users." },
];

export function UserBadges() {
  return (
    <TooltipProvider>
        <div className="flex flex-wrap gap-6">
            {badges.map(badge => (
                 <Tooltip key={badge.title}>
                    <TooltipTrigger>
                        <div className="flex flex-col items-center gap-2 p-4 bg-card-foreground/5 rounded-lg border border-border w-32 h-32 justify-center">
                            {badge.icon}
                            <p className="text-xs font-medium text-center">{badge.title}</p>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{badge.description}</p>
                    </TooltipContent>
                </Tooltip>
            ))}
        </div>
    </TooltipProvider>
  );
}
