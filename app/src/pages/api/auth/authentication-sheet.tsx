import {Sheet, SheetContent, SheetTrigger} from "@/shadcn/components/ui/sheet";
import Link from "next/link";
import {SquareUserRound} from "lucide-react";
import {Button} from "@/shadcn/components/ui/button";
import React, {useState} from "react";
import axios from "axios";
import {signIn, signOut, useSession} from "next-auth/react";
import {cn} from "@/lib/utils";
import {Label} from "@radix-ui/react-label";
import {Input} from "@/shadcn/components/ui/input";

export default function AuthenticationSheet() {
    const { data: session, status } = useSession(); // Access session and status
    const [email, setEmail] = useState(""); // Email state for registration and login
    const [password, setPassword] = useState(""); // Password for login (not used in registration)
    const [isLogin, setIsLogin] = useState(true); // Toggle between login and register
    const [error, setError] = useState<string | null>(null); // General error state
    const [formError, setFormError] = useState<string | null>(null); // API error state
    const [open, setOpen] = useState<boolean>(false); // Control sheet visibility
    const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        setError(null);

        if (!isLogin) {
            // Handle Registration: Create a user and send confirmation email
            try {
                setIsLoading(true);

                // Register the user with email and a temporary password
                const registerRes = await axios.post(`${process.env.NEXT_PUBLIC_STRAPI_REST_API_URL}/auth/local/register`, {
                    email,
                    password: "temporary-password", // Use a placeholder password
                    username: email, // Strapi requires a username, so we'll use the email as the username
                    confirmed: false,
                });

                console.log("User registered:", registerRes.data);

                // After registering, Strapi should send the confirmation email
                setIsLoading(false);
                setOpen(false); // Close sheet after successful registration and email confirmation
            } catch (error) {
                setIsLoading(false);
                const responseError = error.response?.data?.error;
                if (responseError?.message) {
                    setFormError(responseError.message);
                } else {
                    setFormError("Failed to register. Please try again.");
                }
            }
        } else {
            // Handle Login (with email and password)
            try {
                const result = await signIn("credentials", {
                    redirect: false,
                    email,
                    password,
                });

                if (result?.error) {
                    setError("Login failed. Check your credentials.");
                } else {
                    console.log("Login successful!");
                    setOpen(false); // Close sheet after successful login
                }
            } catch (error) {
                setError("An error occurred while logging in.");
            }
        }
    };

    // If the user is already logged in, display a "Log out" button
    if (status === "authenticated") {
        return (
            <div className="flex items-center space-x-2">
                <span>Welcome, {session.user.email}</span>
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => signOut()} // Log the user out
                >
                    Log out
                </Button>
            </div>
        );
    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button size={"sm"} variant={"ghost"} onClick={() => setOpen(true)}>
                    <SquareUserRound className={"h-5 w-5 3xl:mr-2"} />
                    <span className={"hidden 3xl:flex"}>Anmelden</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-gray-100 h-full overflow-y-auto sm:max-w-xl">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            {isLogin ? "Log in" : "Register"}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {isLogin
                                ? "Enter your email and password to log in to your account"
                                : "Enter your email to create an account. We'll send you a confirmation email."}
                        </p>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col space-y-4">
                            <div className={cn("grid gap-6")}>
                                <div className="grid gap-2">
                                    <div className="grid gap-1">
                                        <Label className="sr-only" htmlFor="email">
                                            Email
                                        </Label>
                                        <Input
                                            id="email"
                                            placeholder="name@example.com"
                                            type="email"
                                            value={email} // Bind the value to the email state
                                            onChange={(e) => setEmail(e.target.value)} // Update the email state on change
                                            autoCapitalize="none"
                                            autoComplete="email"
                                            autoCorrect="off"
                                            disabled={isLoading}
                                        />
                                    </div>
                                    {isLogin && (
                                        <div className="grid gap-1">
                                            <Label className="sr-only" htmlFor="password">
                                                Password
                                            </Label>
                                            <Input
                                                id="password"
                                                placeholder="Password"
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                autoComplete="current-password"
                                                disabled={isLoading}
                                            />
                                        </div>
                                    )}
                                    <Button type="submit" className="w-full" disabled={isLoading}>
                                        {isLogin ? "Sign In" : "Register"}
                                    </Button>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                                    </div>
                                </div>
                                <Button variant="outline" type="button" disabled={isLoading}>
                                    GitHub
                                </Button>
                            </div>
                            {formError && <p className="text-red-500">{formError}</p>} {/* Error from API */}
                            {error && <p className="text-red-500">{error}</p>} {/* General error */}
                        </div>
                    </form>
                    <p className="px-8 text-center text-sm text-muted-foreground">
                        {isLogin ? (
                            <>
                                Don't have an account?{" "}
                                <button onClick={() => setIsLogin(false)} className="underline underline-offset-4 hover:text-primary">
                                    Sign up
                                </button>
                            </>
                        ) : (
                            <>
                                Already have an account?{" "}
                                <button onClick={() => setIsLogin(true)} className="underline underline-offset-4 hover:text-primary">
                                    Log in
                                </button>
                            </>
                        )}
                    </p>
                    <p className="px-8 text-center text-sm text-muted-foreground">
                        By {isLogin ? "logging in" : "signing up"}, you agree to our{" "}
                        <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
                            Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
                            Privacy Policy
                        </Link>
                        .
                    </p>
                </div>
            </SheetContent>
        </Sheet>
    );
}
