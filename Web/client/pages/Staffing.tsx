import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { StaffingForm } from "@/components/StaffingForm";
import { StaffingPlan } from "@/components/StaffingPlan";
import { SurgeForecast } from "@/components/SurgeForecast";
import { StaffingResponse } from "@/types/plan";
import { Users, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const StaffingPage = () => {
  const [staffingResponse, setStaffingResponse] = useState<StaffingResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateStaffing = async (data: any) => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/v1/staffing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const result: StaffingResponse = await response.json();
      setStaffingResponse(result);
      toast({
        title: "Staffing Plan Generated Successfully",
        description: "Staffing recommendations ready",
      });
    } catch (error) {
      console.error("Error generating staffing plan:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate staffing plan. Make sure the backend is running at http://localhost:8000",
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
              <Users className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold text-foreground">👥 Staffing Plan</h1>
                <p className="text-lg text-muted-foreground">
                  Get staffing recommendations based on predicted patient loads
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
            <StaffingForm onSubmit={handleGenerateStaffing} isLoading={isLoading} />
          </div>

          <div className="lg:col-span-2 space-y-6">
            {staffingResponse ? (
              <>
                <Card>
                  <CardContent className="pt-6">
                    <SurgeForecast data={staffingResponse} />
                  </CardContent>
                </Card>

                <StaffingPlan data={staffingResponse} />

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>AI Analysis:</strong> {staffingResponse.explanation}
                  </AlertDescription>
                </Alert>
              </>
            ) : (
              <div className="flex items-center justify-center min-h-[400px] text-center">
                <div>
                  <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">No Staffing Plan Generated Yet</h3>
                  <p className="text-muted-foreground">
                    Fill in the parameters and click "Generate Staffing Plan" to get started.
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

export default StaffingPage;

