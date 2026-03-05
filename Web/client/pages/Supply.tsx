import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { SupplyForm } from "@/components/SupplyForm";
import { SupplyAlerts } from "@/components/SupplyAlerts";
import { SurgeForecast } from "@/components/SurgeForecast";
import { SupplyResponse } from "@/types/plan";
import { Package, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const SupplyPage = () => {
  const [supplyResponse, setSupplyResponse] = useState<SupplyResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCheckSupply = async (data: any) => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/v1/supply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const result: SupplyResponse = await response.json();
      setSupplyResponse(result);
      toast({
        title: "Supply Check Complete",
        description: "Inventory alerts generated",
      });
    } catch (error) {
      console.error("Error checking supply:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to check supply. Make sure the backend is running at http://localhost:8000",
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
              <Package className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold text-foreground">📦 Supply Alerts</h1>
                <p className="text-lg text-muted-foreground">
                  Monitor inventory levels and get alerts for critical supplies
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
            <SupplyForm onSubmit={handleCheckSupply} isLoading={isLoading} />
          </div>

          <div className="lg:col-span-2 space-y-6">
            {supplyResponse ? (
              <>
                <Card>
                  <CardContent className="pt-6">
                    <SurgeForecast data={supplyResponse} />
                  </CardContent>
                </Card>

                <SupplyAlerts data={supplyResponse} />

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>AI Analysis:</strong> {supplyResponse.explanation}
                  </AlertDescription>
                </Alert>
              </>
            ) : (
              <div className="flex items-center justify-center min-h-[400px] text-center">
                <div>
                  <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">No Supply Check Performed Yet</h3>
                  <p className="text-muted-foreground">
                    Fill in the inventory parameters and click "Check Supply Alerts" to get started.
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

export default SupplyPage;

