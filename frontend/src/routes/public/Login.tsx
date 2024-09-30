import { NavLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import loginSchema from '@/schemas/login';
import useAuth from '@/hooks/useAuth';
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel,
  FormMessage,
} from '@/components/ui/form';

export default function Login() {
  const { login } = useAuth();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (value: z.infer<typeof loginSchema>) => {
    login({ email: value.email, password: value.password });
    return 0;
  };

  return (
    <Card className="mx-auto w-96">
      <CardHeader>
        <CardTitle className="text-2xl">Inicio de sesión</CardTitle>
        <CardDescription>
          Ingresa tu correo electrónico para acceder a tu cuenta.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} id="userLogin">
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <div className="grid gap-2">
                    <FormItem>
                      <FormLabel>Correo Electrónico</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="email@domain.com"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Ingresa tu correo electrónico
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  </div>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <div className="grid gap-2">
                    <FormItem>
                      <div className="flex items-center">
                        <FormLabel>Contraseña</FormLabel>
                        <NavLink to="#" className="ml-auto inline-block text-sm underline">
                          ¿Olvidaste tu contraseña?
                        </NavLink>
                      </div>
                      <FormControl>
                        <Input
                          placeholder="****"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Ingresa tu correo electrónico
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  </div>
                )}
              />
              <Button type="submit" className="w-full">
                Iniciar sesión
              </Button>
              <Button asChild variant="outline" className="w-full">
                <NavLink to="/login/guest">
                  Continuar como invitado
                </NavLink>
              </Button>
            </div>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm">
          ¿No tienes una cuenta?
          {' '}
          <NavLink to="#" className="underline">
            Registrarse
          </NavLink>
        </div>
      </CardContent>
    </Card>
  );
}
