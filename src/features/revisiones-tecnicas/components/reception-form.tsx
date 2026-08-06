"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const receptionSchema = z.object({
  openShipment: z.string().min(3, "Selecciona un envio abierto."),
  arrivedAt: z.string().min(1, "La fecha y hora de llegada es obligatoria."),
  terminal: z.string().min(2, "Ingresa el terminal de recepcion."),
  odometerIn: z.string().min(1, "Ingresa el kilometraje de llegada."),
  preliminaryResult: z.enum(["APROBADO", "RECHAZADO", "PENDIENTE"]),
  documentType: z.enum([
    "CERTIFICADO_APROBADO",
    "INFORME_RECHAZO",
    "CERTIFICADO_REINSPECCION",
    "OTRO_RESPALDO",
  ]),
  observations: z.string().optional(),
});

type ReceptionValues = z.infer<typeof receptionSchema>;

const defaultValues: ReceptionValues = {
  openShipment: "",
  arrivedAt: "2026-08-06T13:30",
  terminal: "Colo Colo",
  odometerIn: "",
  preliminaryResult: "PENDIENTE",
  documentType: "INFORME_RECHAZO",
  observations: "",
};

export function ReceptionForm() {
  const [submitted, setSubmitted] = useState<ReceptionValues | null>(null);
  const form = useForm<ReceptionValues>({
    resolver: zodResolver(receptionSchema),
    defaultValues,
  });

  const onSubmit = (values: ReceptionValues) => {
    setSubmitted(values);
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <Card>
        <CardHeader>
          <CardTitle>Registro de recepcion</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium">Envio abierto o bus</label>
              <Input {...form.register("openShipment")} placeholder="Ej. JXWK-17 / envio 81294" />
              <ErrorText message={form.formState.errors.openShipment?.message} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Fecha y hora llegada</label>
              <Input {...form.register("arrivedAt")} type="datetime-local" />
              <ErrorText message={form.formState.errors.arrivedAt?.message} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Terminal recepcion</label>
              <Input {...form.register("terminal")} />
              <ErrorText message={form.formState.errors.terminal?.message} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Kilometraje llegada</label>
              <Input {...form.register("odometerIn")} />
              <ErrorText message={form.formState.errors.odometerIn?.message} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Resultado preliminar</label>
              <select
                {...form.register("preliminaryResult")}
                className="h-11 w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 text-sm"
              >
                <option value="PENDIENTE">Pendiente</option>
                <option value="APROBADO">Aprobado</option>
                <option value="RECHAZADO">Rechazado</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium">Tipo de documento</label>
              <select
                {...form.register("documentType")}
                className="h-11 w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 text-sm"
              >
                <option value="CERTIFICADO_APROBADO">Certificado aprobado</option>
                <option value="INFORME_RECHAZO">Informe de rechazo</option>
                <option value="CERTIFICADO_REINSPECCION">Certificado de reinspeccion</option>
                <option value="OTRO_RESPALDO">Otro respaldo</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium">Archivo</label>
              <Input type="file" accept=".pdf,.jpg,.jpeg,.png" />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium">Observaciones</label>
              <Textarea {...form.register("observations")} rows={4} />
            </div>

            <div className="md:col-span-2 flex flex-wrap gap-3">
              <Button type="submit">Procesar y revisar OCR</Button>
              <Button type="button" variant="secondary" onClick={() => form.reset(defaultValues)}>
                Guardar borrador
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Chequeos antes del cierre</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-6 text-[var(--color-text-soft)]">
          <p>La recepcion exige envio abierto, llegada posterior a salida y documento no duplicado.</p>
          <p>Si el resultado es aprobado, la fecha de vencimiento es obligatoria.</p>
          <p>Si el resultado es rechazado, debe existir al menos un motivo documentado.</p>

          {submitted ? (
            <div className="rounded-[24px] bg-sky-50 p-4 text-sky-800">
              Recepcion lista para OCR: {submitted.openShipment} ({submitted.documentType}).
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

function ErrorText({ message }: { message: string | undefined }) {
  if (!message) {
    return null;
  }

  return <p className="mt-2 text-sm text-rose-700">{message}</p>;
}
