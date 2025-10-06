import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconColor?: string;
  iconBgColor?: string;
  className?: string;
}

export function FeatureCard({ 
  icon: Icon, 
  title, 
  description, 
  iconColor = "text-blue-600", 
  iconBgColor = "bg-blue-100",
  className = ""
}: FeatureCardProps) {
  return (
    <Card className={`text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${className}`}>
      <CardHeader className="pb-4">
        <div className={`w-16 h-16 ${iconBgColor} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
          <Icon className={`w-8 h-8 ${iconColor}`} />
        </div>
        <CardTitle className="text-xl font-bold text-gray-900 mb-2">{title}</CardTitle>
        <CardDescription className="text-gray-600 leading-relaxed">
          {description}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
