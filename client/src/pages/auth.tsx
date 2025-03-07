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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { insertUserSchema, type InsertUser } from "@shared/schema";

export default function AuthPage() {
  const [_, setLocation] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();

  useEffect(() => {
    if (user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  const loginForm = useForm<InsertUser>({
    resolver: zodResolver(
      insertUserSchema.pick({
        username: true,
        password: true,
      }),
    ),
  });

  const registerForm = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
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
          <Card className="border-2 border-primary/20 shadow-lg">
            <CardHeader className="space-y-1 border-b border-primary/10">
              <CardTitle className="text-2xl">Account Access</CardTitle>
              <CardDescription>
                Login to your account or create a new one
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Tabs defaultValue="login">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <Form {...loginForm}>
                    <form
                      onSubmit={loginForm.handleSubmit((data) =>
                        loginMutation.mutate(data),
                      )}
                      className="space-y-6"
                    >
                      <FormField
                        control={loginForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold">Username</FormLabel>
                            <FormControl>
                              <Input {...field} className="border-4 border-primary/30 rounded-lg h-12 text-lg focus:ring-4 focus:ring-primary/20 focus:border-primary" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold">Password</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} className="border-4 border-primary/30 rounded-lg h-12 text-lg focus:ring-4 focus:ring-primary/20 focus:border-primary" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        className="w-full border-4 border-primary/30 rounded-lg h-12 text-lg font-semibold hover:bg-primary/90"
                        disabled={loginMutation.isPending}
                      >
                        {loginMutation.isPending ? "Logging in..." : "Login"}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>

                <TabsContent value="register">
                  <Form {...registerForm}>
                    <form
                      onSubmit={registerForm.handleSubmit((data) =>
                        registerMutation.mutate(data),
                      )}
                      className="space-y-6"
                    >
                      <FormField
                        control={registerForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold">Username</FormLabel>
                            <FormControl>
                              <Input {...field} className="border-4 border-primary/30 rounded-lg h-12 text-lg focus:ring-4 focus:ring-primary/20 focus:border-primary" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold">First Name</FormLabel>
                            <FormControl>
                              <Input {...field} className="border-4 border-primary/30 rounded-lg h-12 text-lg focus:ring-4 focus:ring-primary/20 focus:border-primary" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold">Last Name</FormLabel>
                            <FormControl>
                              <Input {...field} className="border-4 border-primary/30 rounded-lg h-12 text-lg focus:ring-4 focus:ring-primary/20 focus:border-primary" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold">Email</FormLabel>
                            <FormControl>
                              <Input type="email" {...field} className="border-4 border-primary/30 rounded-lg h-12 text-lg focus:ring-4 focus:ring-primary/20 focus:border-primary" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold">Phone Number</FormLabel>
                            <FormControl>
                              <Input type="tel" placeholder="Enter your phone number" {...field} className="border-4 border-primary/30 rounded-lg h-12 text-lg focus:ring-4 focus:ring-primary/20 focus:border-primary" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold">Password</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} className="border-4 border-primary/30 rounded-lg h-12 text-lg focus:ring-4 focus:ring-primary/20 focus:border-primary" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        className="w-full border-4 border-primary/30 rounded-lg h-12 text-lg font-semibold hover:bg-primary/90"
                        disabled={registerMutation.isPending}
                      >
                        {registerMutation.isPending
                          ? "Creating account..."
                          : "Create Account"}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
