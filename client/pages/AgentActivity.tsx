import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { AgentActivityForm } from "@/components/AgentActivityForm";
import { AgentActivity } from "@/components/AgentActivity";
import { SurgeForecast } from "@/components/SurgeForecast";
import { StaffingPlan } from "@/components/StaffingPlan";
import { SupplyAlerts } from "@/components/SupplyAlerts";
import { AdvisoriesDisplay } from "@/components/AdvisoriesDisplay";
import { RiskBadge } from "@/components/RiskBadge";
import { AgentActivityResponse } from "@/types/plan";
import { Search, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const AgentActivityPage = () => {
  const [activityResponse, setActivityResponse] = useState<AgentActivityResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateActivity = async (data: any) => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/v1/agent-activity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const result: AgentActivityResponse = await response.json();
      setActivityResponse(result);
      toast({
        title: "Agent Activity Generated Successfully",
        description: `${result.agent_logs.length} agent activities logged`,
      });
    } catch (error) {
      console.error("Error generating agent activity:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate agent activity. Make sure the backend is running at http://localhost:8000",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 mb-2">
              <Search className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold text-foreground">🔍 Agent Activity</h1>
                <p className="text-lg text-muted-foreground">
                  View activity logs from all AI agents during plan generation
                </p>
              </div>
            </div>
            <Link to="/hospital-command-center">
              <Button variant="outline">
                <Heart className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <AgentActivityForm onSubmit={handleGenerateActivity} isLoading={isLoading} />
          </div>

          <div className="lg:col-span-2 space-y-6">
            {activityResponse ? (
              <>
                <Alert className={
                  activityResponse.overall_risk === "HIGH" ? "border-red-500 bg-red-50 dark:bg-red-950" :
                  activityResponse.overall_risk === "MEDIUM" ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-950" :
                  "border-green-500 bg-green-50 dark:bg-green-950"
                }>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="flex items-center justify-between">
                    <span className="font-semibold">Overall Risk Assessment:</span>
                    <RiskBadge risk={activityResponse.overall_risk} size="lg" />
                  </AlertDescription>
                </Alert>

                <AgentActivity data={activityResponse} />

                <Card>
                  <CardContent className="pt-6">
                    <SurgeForecast data={activityResponse} />
                  </CardContent>
                </Card>

                <StaffingPlan data={activityResponse} />

                <SupplyAlerts data={activityResponse} />

                <AdvisoriesDisplay data={activityResponse} />

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>AI Analysis:</strong> {activityResponse.explanation}
                  </AlertDescription>
                </Alert>
              </>
            ) : (
              <div className="flex items-center justify-center min-h-[400px] text-center">
                <div>
                  <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">No Agent Activity Generated Yet</h3>
                  <p className="text-muted-foreground">
                    Fill in the parameters and click "Generate Agent Activity" to see agent logs.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AgentActivityPage;

