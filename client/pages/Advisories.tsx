import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { AdvisoryForm } from "@/components/AdvisoryForm";
import { AdvisoriesDisplay } from "@/components/AdvisoriesDisplay";
import { SurgeForecast } from "@/components/SurgeForecast";
import { RiskBadge } from "@/components/RiskBadge";
import { AdvisoryResponse } from "@/types/plan";
import { MessageSquare, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const AdvisoriesPage = () => {
  const [advisoryResponse, setAdvisoryResponse] = useState<AdvisoryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateAdvisories = async (data: any) => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/v1/advisories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const result: AdvisoryResponse = await response.json();
      setAdvisoryResponse(result);
      toast({
        title: "Advisories Generated Successfully",
        description: "Patient and staff advisories ready",
      });
    } catch (error) {
      console.error("Error generating advisories:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate advisories. Make sure the backend is running at http://localhost:8000",
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
              <MessageSquare className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold text-foreground">🗣 Advisories</h1>
                <p className="text-lg text-muted-foreground">
                  Generate patient and staff advisories based on predicted hospital conditions
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
            <AdvisoryForm onSubmit={handleGenerateAdvisories} isLoading={isLoading} />
          </div>

          <div className="lg:col-span-2 space-y-6">
            {advisoryResponse ? (
              <>
                <Alert className={
                  advisoryResponse.overall_risk === "HIGH" ? "border-red-500 bg-red-50 dark:bg-red-950" :
                  advisoryResponse.overall_risk === "MEDIUM" ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-950" :
                  "border-green-500 bg-green-50 dark:bg-green-950"
                }>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="flex items-center justify-between">
                    <span className="font-semibold">Overall Risk Assessment:</span>
                    <RiskBadge risk={advisoryResponse.overall_risk} size="lg" />
                  </AlertDescription>
                </Alert>

                <Card>
                  <CardContent className="pt-6">
                    <SurgeForecast data={advisoryResponse} />
                  </CardContent>
                </Card>

                <AdvisoriesDisplay data={advisoryResponse} />

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>AI Analysis:</strong> {advisoryResponse.explanation}
                  </AlertDescription>
                </Alert>
              </>
            ) : (
              <div className="flex items-center justify-center min-h-[400px] text-center">
                <div>
                  <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">No Advisories Generated Yet</h3>
                  <p className="text-muted-foreground">
                    Fill in the parameters and click "Generate Advisories" to get started.
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

export default AdvisoriesPage;

