"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MailCheck } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

const resetSchema = z.object({
  email: z.string().email("Ingresa un correo válido."),
});

type ResetValues = z.infer<typeof resetSchema>;

export function ForgotPasswordForm() {
  const [message, setMessage] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  const form = useForm<ResetValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setIsBusy(true);
    setMessage(null);

    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setMessage(
        "Configura Supabase para activar el flujo real de recuperación. La interfaz ya está preparada.",
      );
      setIsBusy(false);
      return;
    }

    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/login`
        : undefined;

    const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
      redirectTo,
    });

    setIsBusy(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Se envió un enlace de recuperación al correo indicado.");
  });

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--color-primary)]" htmlFor="reset-email">
          Correo asociado
        </label>
        <Input
          id="reset-email"
          placeholder="nombre@empresa.cl"
          {...form.register("email")}
        />
        <p className="text-sm text-rose-600">{form.formState.errors.email?.message}</p>
      </div>

      {message ? (
        <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
          {message}
        </div>
      ) : null}

      <Button className="w-full gap-2" type="submit" disabled={isBusy}>
        <MailCheck className="h-4 w-4" />
        {isBusy ? "Enviando..." : "Enviar recuperación"}
      </Button>
    </form>
  );
}
