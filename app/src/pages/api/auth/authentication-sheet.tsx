import {Sheet, SheetContent, SheetTrigger} from "@/shadcn/components/ui/sheet";
import Link from "next/link";
import {CheckCircle, Facebook, LogOut, SquareUserRound} from "lucide-react";
import {Button} from "@/shadcn/components/ui/button";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {signIn, signOut, useSession} from "next-auth/react";
import {cn} from "@/lib/utils";
import {Label} from "@radix-ui/react-label";
import {Input} from "@/shadcn/components/ui/input";
import {DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger} from "@/shadcn/components/ui/dropdown-menu";
import {CloudArrowUpIcon} from "@heroicons/react/16/solid";
import {motion} from "framer-motion";

import {GoogleIcon} from "@/components/icons/google";
import {ChevronLeft} from "@/components/icons/chevron-left";
import {ChevronRight} from "@/components/icons/chevron-right";


const features = [
    {
        name: 'Verwalte Wunschlisten',
        description: 'This is a dummy description for the feature.',
        icon: CloudArrowUpIcon,
    },
    {
        name: 'Verwalte Wunschlisten 2',
        description: 'This is a dummy description for the feature.',
        icon: CloudArrowUpIcon,
    },
    {
        name: 'Verwalte Wunschlisten 3',
        description: 'This is a dummy description for the feature.',
        icon: CloudArrowUpIcon,
    }
];

export default function AuthenticationSheet() {
    const {data: session, status} = useSession(); // Access session and status
    const [email, setEmail] = useState(""); // Email state for registration and login
    const [password, setPassword] = useState(""); // Password for login (not used in registration)
    const [isLogin, setIsLogin] = useState(false); // Toggle between login and register
    const [error, setError] = useState<string | null>(null); // General error state
    const [formError, setFormError] = useState<string | null>(null); // API error state
    const [open, setOpen] = useState<boolean>(false); // Control sheet visibility
    const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state
    const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);

    // Automatically cycle through features
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentFeatureIndex((prevIndex) => (prevIndex + 1) % features.length);
        }, 5000); // Change every 3 seconds

        return () => clearInterval(interval);
    }, []);


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
    // <span>Hi, {session.user.name ?? 'XY'}</span>
    // If the user is already logged in, display a "Log out" button
    if (status === "authenticated") {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button size={"sm"} variant={"ghost"} className={'focus:ring-0'}>
                        <SquareUserRound className={"h-5 w-5 3xl:mr-2"}/>
                        <span className={"hidden 3xl:flex"}><span>Hi, {session?.user?.name ?? 'XY'}</span></span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuGroup>
                        <DropdownMenuItem>
                            <span>Profil</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <span>Wunschliste</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <span>Einstellungen</span>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem onClick={signOut}>
                        <LogOut className={'h-4 w-4 mr-2'}/>
                        <span>Log out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }

    return (
        <Sheet open={open} >
            <SheetTrigger asChild>
                <Button size={"sm"} variant={"ghost"} onClick={() => setOpen(true)}>
                    <SquareUserRound className={"h-5 w-5 3xl:mr-2"}/>
                    <span className={"hidden 3xl:flex"}>Anmelden</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-gray-100 h-full overflow-y-auto w-full sm:max-w-xl">
                <div className={'flex justify-between'}>
                    <Button size={'sm'} variant={'link'} onClick={() => setOpen(false)} className="">
                        <ChevronLeft className={'h-4 w-4 mr-2'}/>
                        Zurück
                    </Button>
                    {!isLogin ? <Button size={'sm'} variant={'link'} onClick={() => setIsLogin(true)} className="">
                        Login
                        <ChevronRight className={'h-4 w-4 ml-2'}/>
                    </Button> :
                        <Button size={'sm'} variant={'link'} onClick={() => setIsLogin(false)} className="">
                            Registrieren
                            <ChevronRight className={'h-4 w-4 ml-2'}/>
                        </Button>
                    }

                </div>


                {/* Features Section */}
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] mt-8">

                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            {isLogin ? "Log in" : "Deine Premium Möbel für zuhause"}
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


                                <div className={'flex flex-col w-full justify-stretch gap-2'}>
                                    <Button className={'w-full'} variant="outline" onClick={(e) => {
                                        e.preventDefault();
                                        signIn('google')
                                    }} disabled={isLoading}>
                                        <GoogleIcon className={'text-2xl mr-2 h-5 w-5'}/>
                                        Mit Google anmelden
                                    </Button>
                                    <Button className={'w-full'} variant="outline" onClick={(e) => {
                                        e.preventDefault();
                                        signIn('facebook')
                                    }} disabled={isLoading}>
                                        <Facebook className={'text-2xl mr-2 h-5 w-5'}/>
                                        Mit facebook anmelden
                                    </Button>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t"/>
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className=" px-2 text-muted-foreground bg-gray-100">Oder mit E-Mail und Passwort anmelden</span>
                                    </div>
                                </div>
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
                                    <Button type="submit" size={'sm'} variant={'outline'} className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white" disabled={isLoading}>
                                        {isLogin ? "Anmelden" : "Konto erstellen"}
                                    </Button>
                                </div>


                            </div>
                            {formError && <p className="text-red-500">{formError}</p>} {/* Error from API */}
                            {error && <p className="text-red-500">{error}</p>} {/* General error */}
                        </div>
                    </form>
                    <p className="px-8 text-center text-sm text-muted-foreground">
                        {isLogin ? (
                            <>
                                <div>
                                    Du hast bereits einen Account?
                                    <Button size={'sm'} variant={'link'} onClick={() => setIsLogin(false)} className="">
                                        Registrieren
                                    </Button>
                                </div>

                            </>
                        ) : (
                            <>
                                <div>
                                    Du hast bereits einen Account?
                                    <Button size={'sm'} variant={'link'} onClick={() => setIsLogin(true)} className="">
                                        Login
                                    </Button>
                                </div>

                            </>
                        )}
                    </p>

                </div>
                {/* Feature Slider Section */}
                <div className="w-full max-w-md mx-auto mt-12">
                    <motion.div
                        key={features[currentFeatureIndex].name} // Key for each feature to handle animations
                        initial={{opacity: 0, y: 100}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 40, y: 100}}
                        transition={{duration: 0.5}}
                        className="p-6"
                    >
                        <div className="flow-root rounded-lg bg-gray-50 px-6 pb-8">
                            <div className="-mt-6">
                                <div>
                                    <span className="inline-flex items-center justify-center rounded-md  p-3 ">
                                        <CheckCircle className="h-8 w-8 text-teal-500"/>
                                    </span>
                                </div>
                                <h3 className="mt-8 text-lg font-semibold leading-8 tracking-tight text-gray-900">
                                    {features[currentFeatureIndex].name}
                                </h3>
                                <p className="mt-5 text-base leading-7 text-gray-600">
                                    {features[currentFeatureIndex].description}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
                <p className="mx-auto w-full  absolute bottom-4 right-0 left-0 px-8 text-center text-sm text-muted-foreground">
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
            </SheetContent>
        </Sheet>
    );
}
