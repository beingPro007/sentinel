"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Image from "next/image";
import GoogleIcon from "../../../public/GoogleIcon.png"; // Import as an image

export function SignIn() {
  // Initialize the form using react-hook-form
  const form = useForm({
    defaultValues: {
      username: "",
    },
  });

  // Define the onSubmit function
  const onSubmit = (data) => {
    console.log("Form data:", data);
    // Add your submission logic here
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section */}
      <div className="w-1/2 bg-gray-900 text-white flex flex-col justify-center items-center p-10">
        <div className="mb-10 text-lg font-semibold">💸 Sentinel 🤑</div>
        <blockquote className="italic text-gray-400 max-w-md text-center">
          “Money Buys Happiness”
        </blockquote>
        <p className="mt-4 text-gray-500">- Every Fuckin Millionaire</p>
      </div>

      {/* Right Section */}
      <div className="w-1/2 bg-gray-800 flex flex-col justify-center items-center p-10">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Create an account</CardTitle>
            <CardDescription>
              Enter your email below to create your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="name@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Sign In with Email
                </Button>
              </form>
            </Form>

            <div className="my-6 flex items-center">
              <span className="w-full border-t border-gray-600"></span>
              <span className="mx-2 text-gray-500 text-xs whitespace-nowrap">OR CONTINUE WITH</span>
              <span className="w-full border-t border-gray-600"></span>
            </div>

            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
            >
              <Image
                src={GoogleIcon}
                alt="Google icon"
                width={20}
                height={20}
              />
              Sign in with Google
            </Button>
          </CardContent>
          <CardFooter className="text-center text-xs text-gray-500 mt-6">
            By clicking continue, you agree to our{" "}
            <a href="#" className="underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline">
              Privacy Policy
            </a>
            .
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
