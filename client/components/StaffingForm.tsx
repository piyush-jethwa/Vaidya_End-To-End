import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, Users } from "lucide-react";

const formSchema = z.object({
  date: z.string(),
  city: z.string().min(1, "City is required"),
  is_festival: z.boolean(),
  aqi: z.coerce.number().min(0, "AQI must be positive"),
  recent_load_opd: z.coerce.number().min(0),
  recent_load_er: z.coerce.number().min(0),
  recent_load_icu: z.coerce.number().min(0),
  current_staff_opd: z.coerce.number().min(0),
  current_staff_er: z.coerce.number().min(0),
  current_staff_icu: z.coerce.number().min(0),
});

interface StaffingFormProps {
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
}

export const StaffingForm = ({ onSubmit, isLoading }: StaffingFormProps) => {
  const today = new Date().toISOString().split("T")[0];
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: today,
      city: "Mumbai",
      is_festival: false,
      aqi: 100,
      recent_load_opd: 150,
      recent_load_er: 50,
      recent_load_icu: 20,
      current_staff_opd: 5,
      current_staff_er: 5,
      current_staff_icu: 4,
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    const requestData = {
      date: values.date,
      city: values.city,
      is_festival: values.is_festival,
      aqi: values.aqi,
      recent_load: {
        opd: values.recent_load_opd,
        er: values.recent_load_er,
        icu: values.recent_load_icu,
      },
      current_staff: {
        opd: values.current_staff_opd,
        er: values.current_staff_er,
        icu: values.current_staff_icu,
      },
    };

    await onSubmit(requestData);
  };

  return (
    <Card className="h-full overflow-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Staffing Parameters
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Basic Information</h3>
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="is_festival"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="!mt-0 cursor-pointer">Festival Day</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="aqi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Air Quality Index (AQI)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Recent Patient Load</h3>
              <div className="grid grid-cols-3 gap-3">
                <FormField
                  control={form.control}
                  name="recent_load_opd"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>OPD</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="recent_load_er"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ER</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="recent_load_icu"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ICU</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Current Staff</h3>
              <div className="grid grid-cols-3 gap-3">
                <FormField
                  control={form.control}
                  name="current_staff_opd"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>OPD</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="current_staff_er"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ER</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="current_staff_icu"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ICU</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Staffing Plan"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

