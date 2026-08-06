"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

const loginSchema = z.object({
  email: z.string().email("Ingresa un correo valido."),
  password: z.string().min(6, "La contrasena debe tener al menos 6 caracteres."),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setIsBusy(true);
    setServerMessage(null);

    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setServerMessage(
        "Supabase no esta configurado. Completa las variables de entorno antes de iniciar sesion.",
      );
      setIsBusy(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (error) {
      setIsBusy(false);
      setServerMessage(error.message);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  });

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--color-primary)]" htmlFor="email">
          Correo corporativo
        </label>
        <Input id="email" placeholder="nombre@empresa.cl" {...form.register("email")} />
        <p className="text-sm text-rose-600">{form.formState.errors.email?.message}</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--color-primary)]" htmlFor="password">
          Contrasena
        </label>
        <Input
          id="password"
          placeholder="........"
          type="password"
          {...form.register("password")}
        />
        <p className="text-sm text-rose-600">{form.formState.errors.password?.message}</p>
      </div>

      {serverMessage ? (
        <div className="rounded-2xl bg-sky-50 px-4 py-3 text-sm text-sky-700">
          {serverMessage}
        </div>
      ) : null}

      <Button className="w-full gap-2" type="submit" disabled={isBusy}>
        <ShieldCheck className="h-4 w-4" />
        {isBusy ? "Ingresando..." : "Ingresar al control operativo"}
        <ArrowRight className="h-4 w-4" />
      </Button>
    </form>
  );
}
