import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdvisoryResponse, PlanResponse, AgentActivityResponse } from "@/types/plan";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Users, User } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AdvisoriesDisplayProps {
  data: AdvisoryResponse | PlanResponse | AgentActivityResponse;
}

export const AdvisoriesDisplay = ({ data }: AdvisoriesDisplayProps) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return "bg-red-500 text-white";
      case "WARNING":
        return "bg-orange-500 text-white";
      case "INFO":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getLanguageName = (lang: string) => {
    switch (lang) {
      case "en":
        return "English";
      case "hi":
        return "हिंदी (Hindi)";
      default:
        return lang.toUpperCase();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          Advisories
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Patient Advisories */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <User className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Patient Advisories</h3>
          </div>
          {(!data.advisories || data.advisories.patients.length === 0) ? (
            <Alert>
              <AlertDescription>No patient advisories available.</AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {data.advisories?.patients.map((advisory, idx) => (
                <Card key={idx} className={
                  advisory.severity === "CRITICAL" ? "border-red-500 bg-red-50 dark:bg-red-950" :
                  advisory.severity === "WARNING" ? "border-orange-500 bg-orange-50 dark:bg-orange-950" :
                  "border-blue-500 bg-blue-50 dark:bg-blue-950"
                }>
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex items-center gap-2">
                        <Badge className={getSeverityColor(advisory.severity)}>
                          {advisory.severity}
                        </Badge>
                        <Badge variant="outline">
                          {getLanguageName(advisory.language)}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm whitespace-pre-line mt-2">
                      {advisory.message}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Staff Advisories */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold">Staff Advisories</h3>
          </div>
          {(!data.advisories || data.advisories.staff.length === 0) ? (
            <Alert>
              <AlertDescription>No staff advisories available.</AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {data.advisories?.staff.map((advisory, idx) => (
                <Card key={idx} className={
                  advisory.severity === "CRITICAL" ? "border-red-500 bg-red-50 dark:bg-red-950" :
                  advisory.severity === "WARNING" ? "border-orange-500 bg-orange-50 dark:bg-orange-950" :
                  "border-blue-500 bg-blue-50 dark:bg-blue-950"
                }>
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex items-center gap-2">
                        <Badge className={getSeverityColor(advisory.severity)}>
                          {advisory.severity}
                        </Badge>
                        <Badge variant="outline">
                          {getLanguageName(advisory.language)}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm whitespace-pre-line mt-2">
                      {advisory.message}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

