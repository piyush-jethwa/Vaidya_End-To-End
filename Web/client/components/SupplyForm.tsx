import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, Package } from "lucide-react";
import { InventoryItem } from "@/types/plan";

const formSchema = z.object({
  date: z.string(),
  city: z.string().min(1, "City is required"),
  is_festival: z.boolean(),
  aqi: z.coerce.number().min(0, "AQI must be positive"),
  recent_load_opd: z.coerce.number().min(0),
  recent_load_er: z.coerce.number().min(0),
  recent_load_icu: z.coerce.number().min(0),
  n95_masks_stock: z.coerce.number().min(0),
  n95_masks_min: z.coerce.number().min(0),
  n95_masks_reorder: z.coerce.number().min(0),
  oxygen_cylinders_stock: z.coerce.number().min(0),
  oxygen_cylinders_min: z.coerce.number().min(0),
  oxygen_cylinders_reorder: z.coerce.number().min(0),
  icu_beds_stock: z.coerce.number().min(0),
  icu_beds_min: z.coerce.number().min(0),
  icu_beds_reorder: z.coerce.number().min(0),
  paracetamol_stock: z.coerce.number().min(0),
  paracetamol_min: z.coerce.number().min(0),
  paracetamol_reorder: z.coerce.number().min(0),
});

interface SupplyFormProps {
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
}

export const SupplyForm = ({ onSubmit, isLoading }: SupplyFormProps) => {
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
      n95_masks_stock: 500,
      n95_masks_min: 800,
      n95_masks_reorder: 600,
      oxygen_cylinders_stock: 200,
      oxygen_cylinders_min: 300,
      oxygen_cylinders_reorder: 250,
      icu_beds_stock: 25,
      icu_beds_min: 30,
      icu_beds_reorder: 28,
      paracetamol_stock: 1000,
      paracetamol_min: 1500,
      paracetamol_reorder: 1200,
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    const inventory: InventoryItem[] = [
      {
        item_name: "N95_masks",
        current_stock: values.n95_masks_stock,
        min_required: values.n95_masks_min,
        reorder_level: values.n95_masks_reorder,
        unit: "pieces",
      },
      {
        item_name: "Oxygen_cylinders",
        current_stock: values.oxygen_cylinders_stock,
        min_required: values.oxygen_cylinders_min,
        reorder_level: values.oxygen_cylinders_reorder,
        unit: "cylinders",
      },
      {
        item_name: "ICU_beds",
        current_stock: values.icu_beds_stock,
        min_required: values.icu_beds_min,
        reorder_level: values.icu_beds_reorder,
        unit: "beds",
      },
      {
        item_name: "Paracetamol",
        current_stock: values.paracetamol_stock,
        min_required: values.paracetamol_min,
        reorder_level: values.paracetamol_reorder,
        unit: "tablets",
      },
    ];

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
      inventory,
    };

    await onSubmit(requestData);
  };

  return (
    <Card className="h-full overflow-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Supply Monitoring Parameters
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
              <h3 className="font-semibold">N95 Masks</h3>
              <div className="grid grid-cols-3 gap-3">
                <FormField
                  control={form.control}
                  name="n95_masks_stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="n95_masks_min"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Min Req</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="n95_masks_reorder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reorder</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Oxygen Cylinders</h3>
              <div className="grid grid-cols-3 gap-3">
                <FormField
                  control={form.control}
                  name="oxygen_cylinders_stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="oxygen_cylinders_min"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Min Req</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="oxygen_cylinders_reorder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reorder</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">ICU Beds</h3>
              <div className="grid grid-cols-3 gap-3">
                <FormField
                  control={form.control}
                  name="icu_beds_stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="icu_beds_min"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Min Req</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="icu_beds_reorder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reorder</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Paracetamol</h3>
              <div className="grid grid-cols-3 gap-3">
                <FormField
                  control={form.control}
                  name="paracetamol_stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="paracetamol_min"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Min Req</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="paracetamol_reorder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reorder</FormLabel>
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
                  Checking...
                </>
              ) : (
                "Check Supply Alerts"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

