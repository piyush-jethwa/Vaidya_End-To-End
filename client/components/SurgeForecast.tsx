import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlanResponse, SurgeForecastResponse, StaffingResponse, SupplyResponse, AdvisoryResponse, AgentActivityResponse } from "@/types/plan";
import { RiskBadge } from "./RiskBadge";
import { TrendingUp, Activity, AlertTriangle } from "lucide-react";

interface SurgeForecastProps {
  data: PlanResponse | SurgeForecastResponse | StaffingResponse | SupplyResponse | AdvisoryResponse | AgentActivityResponse;
}

export const SurgeForecast = ({ data }: SurgeForecastProps) => {
  const departments = [
    { key: "opd", label: "OPD (Outpatient)", icon: Activity },
    { key: "er", label: "ER (Emergency)", icon: AlertTriangle },
    { key: "icu", label: "ICU (Intensive Care)", icon: TrendingUp },
  ] as const;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Surge Forecast
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {departments.map(({ key, label, icon: Icon }) => {
          const forecast = data.forecast[key];
          return (
            <div
              key={key}
              className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{label}</p>
                  <p className="text-sm text-muted-foreground">
                    Baseline: {forecast.baseline} → Predicted: {forecast.predicted}
                  </p>
                </div>
              </div>
              <div className="text-right space-y-1">
                <RiskBadge risk={forecast.risk} />
                <p className="text-sm font-medium text-foreground">
                  +{forecast.delta} patients
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

