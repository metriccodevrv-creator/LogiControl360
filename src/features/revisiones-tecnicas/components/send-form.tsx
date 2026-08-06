"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const sendSchema = z.object({
  search: z.string().min(3, "Ingresa PPU, numero interno o identificador QR."),
  type: z.enum(["PRIMERA_REVISION", "REINSPECCION"]),
  sentAt: z.string().min(1, "La fecha y hora de salida es obligatoria."),
  plant: z.string().min(2, "Selecciona una planta revisora."),
  driverName: z.string().min(3, "Ingresa el nombre del conductor."),
  driverIdentifier: z.string().optional(),
  odometerOut: z.string().min(1, "Ingresa el kilometraje de salida."),
  terminal: z.string().min(2, "Selecciona el terminal de salida."),
  reason: z.string().min(5, "Describe el motivo del envio."),
  observations: z.string().optional(),
});

type SendValues = z.infer<typeof sendSchema>;

const defaultValues: SendValues = {
  search: "",
  type: "PRIMERA_REVISION",
  sentAt: "2026-08-06T09:00",
  plant: "Planta Quilicura Norte",
  driverName: "",
  driverIdentifier: "",
  odometerOut: "",
  terminal: "El Roble",
  reason: "",
  observations: "",
};

export function SendForm() {
  const [submitted, setSubmitted] = useState<SendValues | null>(null);
  const form = useForm<SendValues>({
    resolver: zodResolver(sendSchema),
    defaultValues,
  });

  const onSubmit = (values: SendValues) => {
    setSubmitted(values);
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <Card>
        <CardHeader>
          <CardTitle>Registro de envio</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium">Bus / QR / PPU</label>
              <Input
                {...form.register("search")}
                placeholder="Patente, numero interno o codigo QR"
              />
              <ErrorText message={form.formState.errors.search?.message} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Tipo de envio</label>
              <select
                {...form.register("type")}
                className="h-11 w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 text-sm"
              >
                <option value="PRIMERA_REVISION">Primera revision</option>
                <option value="REINSPECCION">Reinspeccion</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Fecha y hora de salida</label>
              <Input {...form.register("sentAt")} type="datetime-local" />
              <ErrorText message={form.formState.errors.sentAt?.message} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Planta revisora</label>
              <Input {...form.register("plant")} />
              <ErrorText message={form.formState.errors.plant?.message} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Terminal de salida</label>
              <Input {...form.register("terminal")} />
              <ErrorText message={form.formState.errors.terminal?.message} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Conductor</label>
              <Input {...form.register("driverName")} />
              <ErrorText message={form.formState.errors.driverName?.message} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Identificacion</label>
              <Input {...form.register("driverIdentifier")} placeholder="Opcional" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Kilometraje salida</label>
              <Input {...form.register("odometerOut")} />
              <ErrorText message={form.formState.errors.odometerOut?.message} />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium">Motivo</label>
              <Textarea {...form.register("reason")} rows={4} />
              <ErrorText message={form.formState.errors.reason?.message} />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium">Observaciones</label>
              <Textarea {...form.register("observations")} rows={4} />
            </div>

            <div className="md:col-span-2 flex flex-wrap gap-3">
              <Button type="submit">Registrar envio</Button>
              <Button type="button" variant="secondary" onClick={() => form.reset(defaultValues)}>
                Limpiar formulario
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Validaciones operacionales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-6 text-[var(--color-text-soft)]">
          <p>No se debe permitir mas de un envio abierto para el mismo bus.</p>
          <p>
            La reinspeccion debe enlazarse con un rechazo previo y dejar trazabilidad en
            historial.
          </p>
          <p>
            La evidencia de salida puede adjuntarse despues, pero la salida siempre debe
            registrar usuario, terminal y kilometraje.
          </p>

          {submitted ? (
            <div className="rounded-[24px] bg-emerald-50 p-4 text-emerald-800">
              Envio preparado para {submitted.search} con tipo {submitted.type}.
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
