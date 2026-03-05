import { Link } from "react-router-dom";
import { Activity, TrendingUp, Users, Package, MessageSquare, Search, ArrowRight, Heart } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const HospitalCommandCenter = () => {
  const features = [
    {
      id: 1,
      title: "📈 Surge Forecast",
      description: "Predict next-day hospital surge for OPD, ER, and ICU departments based on festival days, AQI, and baseline loads.",
      icon: TrendingUp,
      route: "/surge-forecast",
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950",
    },
    {
      id: 2,
      title: "👥 Staffing Plan",
      description: "Get staffing recommendations based on predicted patient loads. Optimize staff allocation for each department.",
      icon: Users,
      route: "/staffing",
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-950",
    },
    {
      id: 3,
      title: "📦 Supply Alerts",
      description: "Monitor inventory levels and get context-aware supply alerts based on surge predictions.",
      icon: Package,
      route: "/supply",
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-950",
    },
    {
      id: 4,
      title: "🗣 Advisories",
      description: "Generate patient and staff advisories based on predicted hospital conditions, AQI, and risk levels.",
      icon: MessageSquare,
      route: "/advisories",
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-950",
    },
    {
      id: 5,
      title: "🔍 Agent Activity",
      description: "View activity logs from all AI agents (Surge Prediction, Staffing, Supply, Advisories) during plan generation.",
      icon: Search,
      route: "/agent-activity",
      color: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-50 dark:bg-indigo-950",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Activity className="h-10 w-10 text-primary" />
                <h1 className="text-4xl font-bold text-foreground">Vaidya AI</h1>
              </div>
              <p className="text-xl text-muted-foreground">
                Hospital Command Center
              </p>
              <p className="text-lg text-muted-foreground mt-2">
                Five Independent Features + Complete Dashboard for Hospital Operations Management
              </p>
            </div>
            <Link to="/">
              <Button variant="outline">
                <Heart className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Choose a Feature</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Each feature works independently. Select the one you need to get started.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.id} className="flex flex-col hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4`}>
                    <Icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-2xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base mt-2">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                  <Link to={feature.route}>
                    <Button className="w-full" variant="default">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer Info */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground">
            All features use AI-powered predictions based on hospital conditions, 
            festival days, air quality index, and historical patient loads.
          </p>
        </div>
      </main>
    </div>
  );
};

export default HospitalCommandCenter;

