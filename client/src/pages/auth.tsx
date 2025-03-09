import { useEffect } from "react";
import { useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { z } from "zod";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function AuthPage() {
  const [_, setLocation] = useLocation();
  const { user, loginMutation } = useAuth();

  useEffect(() => {
    if (user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container grid gap-12 px-4 md:grid-cols-2">
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl font-bold">Welcome to Claimsutra</h1>
          <p className="mt-4 text-lg text-gray-600">
            Join our platform to manage your insurance claims and get expert
            assistance. We're here to help you navigate through the complexities of
            insurance claims.
          </p>
        </div>

        <div>
          <Card className="border border-gray-300 shadow-lg">
            <CardHeader className="space-y-1 border-b border-gray-200">
              <CardTitle className="text-2xl">Sign In</CardTitle>
              <CardDescription>
                Enter your credentials to sign in or create a new account
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit((data) =>
                    loginMutation.mutate(data),
                  )}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">Username</FormLabel>
                        <FormControl>
                          <Input {...field} className="border border-gray-300 rounded-lg h-12 text-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} className="border border-gray-300 rounded-lg h-12 text-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full border border-gray-300 rounded-lg h-12 text-lg font-semibold hover:bg-gray-100"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? "Signing in..." : "Sign In"}
                  </Button>
                  <p className="text-center text-sm text-gray-600">
                    Don't have an account? Just enter your desired username and password to create one automatically.
                  </p>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
