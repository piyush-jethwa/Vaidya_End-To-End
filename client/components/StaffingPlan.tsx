import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlanResponse, StaffingResponse, AgentActivityResponse } from "@/types/plan";
import { RiskBadge } from "./RiskBadge";
import { Users } from "lucide-react";

interface StaffingPlanProps {
  data: PlanResponse | StaffingResponse | AgentActivityResponse;
}

export const StaffingPlan = ({ data }: StaffingPlanProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Staffing Plan
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Department</TableHead>
              <TableHead className="text-center">Current</TableHead>
              <TableHead className="text-center">Recommended</TableHead>
              <TableHead className="text-center">Additional</TableHead>
              <TableHead className="text-center">Priority</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.staffing_plan.map((plan, idx) => (
              <TableRow key={idx}>
                <TableCell className="font-medium uppercase">{plan.department}</TableCell>
                <TableCell className="text-center">{plan.current_staff}</TableCell>
                <TableCell className="text-center font-semibold">{plan.recommended_staff}</TableCell>
                <TableCell className="text-center">
                  <span className="font-bold text-primary">+{plan.additional_required}</span>
                </TableCell>
                <TableCell className="text-center">
                  <RiskBadge risk={plan.priority} size="sm" />
                </TableCell>
                <TableCell className="text-sm text-muted-foreground max-w-xs">
                  {plan.suggestion}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

