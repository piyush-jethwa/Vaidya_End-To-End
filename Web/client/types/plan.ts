export interface InventoryItem {
  item_name: string;
  current_stock: number;
  min_required: number;
  reorder_level: number;
  unit: string;
}

export interface PlanRequest {
  date: string;
  city: string;
  is_festival: boolean;
  aqi: number;
  recent_load: {
    opd: number;
    er: number;
    icu: number;
  };
  current_staff: {
    opd: number;
    er: number;
    icu: number;
  };
  inventory: InventoryItem[];
}

export interface DepartmentForecast {
  baseline: number;
  predicted: number;
  delta: number;
  risk: "LOW" | "MEDIUM" | "HIGH";
}

export interface StaffingPlan {
  department: string;
  current_staff: number;
  recommended_staff: number;
  additional_required: number;
  priority: "LOW" | "MEDIUM" | "HIGH";
  suggestion: string;
}

export interface SupplyAlert {
  item_name: string;
  current_stock: number;
  min_required: number;
  reorder_level: number;
  unit: string;
  severity: "OK" | "WARNING" | "CRITICAL";
  message: string;
}

export interface SurgeForecastResponse {
  date: string;
  city: string;
  overall_risk: "LOW" | "MEDIUM" | "HIGH";
  forecast: {
    opd: DepartmentForecast;
    er: DepartmentForecast;
    icu: DepartmentForecast;
  };
  explanation: string;
}

export interface AgentLogItem {
  timestamp: string;
  agent: string;
  level: "INFO" | "WARNING" | "ERROR";
  message: string;
}

export interface PlanResponse {
  date: string;
  city: string;
  overall_risk: "LOW" | "MEDIUM" | "HIGH";
  forecast: {
    opd: DepartmentForecast;
    er: DepartmentForecast;
    icu: DepartmentForecast;
  };
  staffing_plan: StaffingPlan[];
  supply_alerts: SupplyAlert[];
  advisories: Advisories;
  agent_logs: AgentLogItem[];
  explanation: string;
}

// Separate response types for individual features
export interface StaffingResponse {
  date: string;
  city: string;
  forecast: {
    opd: DepartmentForecast;
    er: DepartmentForecast;
    icu: DepartmentForecast;
  };
  staffing_plan: StaffingPlan[];
  explanation: string;
}

export interface SupplyResponse {
  date: string;
  city: string;
  forecast: {
    opd: DepartmentForecast;
    er: DepartmentForecast;
    icu: DepartmentForecast;
  };
  supply_alerts: SupplyAlert[];
  explanation: string;
}

// Feature 4: Advisories
export interface AdvisoryMessage {
  target: "patients" | "staff";
  language: string;
  severity: "INFO" | "WARNING" | "CRITICAL";
  message: string;
}

export interface Advisories {
  patients: AdvisoryMessage[];
  staff: AdvisoryMessage[];
}

export interface AdvisoryResponse {
  date: string;
  city: string;
  overall_risk: "LOW" | "MEDIUM" | "HIGH";
  forecast: {
    opd: DepartmentForecast;
    er: DepartmentForecast;
    icu: DepartmentForecast;
  };
  advisories: Advisories;
  explanation: string;
}

// Feature 5: Agent Activity
export interface AgentActivityResponse {
  date: string;
  city: string;
  overall_risk: "LOW" | "MEDIUM" | "HIGH";
  forecast: {
    opd: DepartmentForecast;
    er: DepartmentForecast;
    icu: DepartmentForecast;
  };
  staffing_plan: StaffingPlan[];
  supply_alerts: SupplyAlert[];
  advisories: Advisories;
  agent_logs: AgentLogItem[];
  explanation: string;
}

