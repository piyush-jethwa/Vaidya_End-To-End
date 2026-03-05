import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlanResponse, AgentActivityResponse } from "@/types/plan";
import { Search, Clock, User } from "lucide-react";

interface AgentActivityProps {
  data: PlanResponse | AgentActivityResponse;
}

export const AgentActivity = ({ data }: AgentActivityProps) => {
  const getLevelColor = (level: string) => {
    switch (level) {
      case "ERROR":
        return "bg-red-500 text-white";
      case "WARNING":
        return "bg-orange-500 text-white";
      case "INFO":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch {
      return timestamp;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5 text-primary" />
          🔍 Agent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!data ? (
          <div className="text-center py-8 text-muted-foreground">
            <Search className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No data received</p>
          </div>
        ) : !data.agent_logs ? (
          <div className="text-center py-8 text-muted-foreground">
            <Search className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="font-semibold mb-2">⚠️ Agent logs field missing in response</p>
            <p className="text-xs text-muted-foreground mb-2">
              The backend may not be returning agent_logs. Please:
            </p>
            <ul className="text-xs text-left max-w-md mx-auto space-y-1 text-muted-foreground">
              <li>1. Restart the backend server</li>
              <li>2. Make sure you're using /api/v1/plan endpoint</li>
              <li>3. Check browser console for errors</li>
            </ul>
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950 rounded text-xs text-left max-w-md mx-auto">
              <strong>Debug Info:</strong><br/>
              Response keys: {Object.keys(data).join(", ")}
            </div>
          </div>
        ) : data.agent_logs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Search className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Agent logs array is empty</p>
            <p className="text-xs mt-2 text-muted-foreground">
              No agent activity was logged during plan generation.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {data.agent_logs.map((log, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-foreground">{log.agent}</span>
                      <Badge className={getLevelColor(log.level)}>
                        {log.level}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                      <Clock className="h-3 w-3" />
                      <span>{formatTimestamp(log.timestamp)}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{log.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

