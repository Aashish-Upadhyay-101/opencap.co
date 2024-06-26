import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

import { FieldTypeData } from "../field-type-data";

import { type TypeZodAddFieldMutationSchema } from "@/trpc/routers/template-field-router/schema";
import { useFormContext, useWatch } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { TemplateFieldContainer } from "./template-field-container";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type Field = TypeZodAddFieldMutationSchema["data"][number];

interface TemplateFieldProps {
  left: number;
  top: number;
  width: number;
  height: number;
  id: string;
  focusId: string;
  index: number;
  handleFocus: (id: string) => void;
  handleDelete: () => void;
  viewportWidth: number;
  viewportHeight: number;
  currentViewportWidth: number;
  currentViewportHeight: number;
}

export function TemplateField({
  height,
  left,
  top,
  width,
  id,
  focusId,
  handleFocus,
  index,
  handleDelete,
  currentViewportHeight,
  currentViewportWidth,
  viewportHeight,
  viewportWidth,
}: TemplateFieldProps) {
  const { control } = useFormContext<{ fields: Field[] }>();

  return (
    <TemplateFieldContainer
      className="overflow-visible"
      viewportWidth={viewportWidth}
      viewportHeight={viewportHeight}
      currentViewportWidth={currentViewportWidth}
      currentViewportHeight={currentViewportHeight}
      width={width}
      top={top}
      left={left}
      height={height}
      onClick={() => {
        handleFocus(id);
      }}
      role="button"
      tabIndex={0}
    >
      <div
        style={{ bottom: height }}
        className={cn(
          "absolute flex-col gap-y-2 border bg-white px-2 py-1",
          focusId === id ? "flex" : " hidden",
        )}
      >
        <div className="flex items-center gap-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              handleDelete();
            }}
          >
            X
          </Button>

          <FormField
            control={control}
            name={`fields.${index}.type`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Field type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="trigger group h-8">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {FieldTypeData.map((item) => (
                      <SelectItem key={item.label} value={item.value}>
                        <span className="flex items-center gap-x-2">
                          <item.icon className="h-4 w-4" aria-hidden />
                          <span className="group-[.trigger]:hidden">
                            {item.label}
                          </span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`fields.${index}.name`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Field Name</FormLabel>
                <FormControl>
                  <Input
                    className="h-8 min-w-16"
                    type="text"
                    required
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <FieldDefaultValue index={index} />
      </div>
    </TemplateFieldContainer>
  );
}

interface FieldDefaultValueProps {
  index: number;
}

function FieldDefaultValue({ index }: FieldDefaultValueProps) {
  const { control } = useFormContext<{ fields: Field[] }>();

  const type = useWatch({ control: control, name: `fields.${index}.type` });
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger className="text-sm">
          Additional Settings
        </AccordionTrigger>

        <AccordionContent>
          {type === "TEXT" ? (
            <div className="flex flex-col gap-y-2">
              <FormField
                control={control}
                name={`fields.${index}.defaultValue`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Value</FormLabel>
                    <FormControl>
                      <Input className="h-8 min-w-16" type="text" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`fields.${index}.readOnly`}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="leading-none">
                      <FormLabel>read-only</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          ) : null}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
