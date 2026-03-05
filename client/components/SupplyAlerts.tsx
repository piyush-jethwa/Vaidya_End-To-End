import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlanResponse, SupplyResponse, AgentActivityResponse } from "@/types/plan";
import { RiskBadge } from "./RiskBadge";
import { Package, AlertCircle } from "lucide-react";

interface SupplyAlertsProps {
  data: PlanResponse | SupplyResponse | AgentActivityResponse;
}

export const SupplyAlerts = ({ data }: SupplyAlertsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" />
          Supply Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.supply_alerts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>All supplies are at adequate levels</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead className="text-center">Current Stock</TableHead>
                <TableHead className="text-center">Min Required</TableHead>
                <TableHead className="text-center">Reorder Level</TableHead>
                <TableHead className="text-center">Severity</TableHead>
                <TableHead>Alert Message</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.supply_alerts.map((alert, idx) => (
                <TableRow key={idx} className={alert.severity === "CRITICAL" ? "bg-red-50 dark:bg-red-950" : ""}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {alert.severity === "CRITICAL" && (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      )}
                      {alert.item_name.replace(/_/g, " ")}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {alert.current_stock} {alert.unit}
                  </TableCell>
                  <TableCell className="text-center">
                    {alert.min_required} {alert.unit}
                  </TableCell>
                  <TableCell className="text-center">
                    {alert.reorder_level} {alert.unit}
                  </TableCell>
                  <TableCell className="text-center">
                    <RiskBadge 
                      risk={alert.severity === "OK" ? "LOW" : alert.severity === "WARNING" ? "MEDIUM" : "HIGH"} 
                      size="sm" 
                    />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-sm">
                    {alert.message}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

