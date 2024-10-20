import {useRouter} from "next/router";
import {Sheet, SheetContent} from "@/shadcn/components/ui/sheet";
import {Button} from "@/shadcn/components/ui/button";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {cn} from "@/lib/utils";
import {Label} from "@radix-ui/react-label";
import {Input} from "@/shadcn/components/ui/input";
import {signIn} from "next-auth/react";

export default function ConfirmationSheet() {
    const [newPassword, setNewPassword] = useState(""); // Password state for new password
    const [confirmPassword, setConfirmPassword] = useState(""); // Confirm password state
    const [error, setError] = useState<string | null>(null); // General error state
    const [formError, setFormError] = useState<string | null>(null); // API error state
    const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state
    const [isConfirmed, setIsConfirmed] = useState<boolean>(false); // Track if email is confirmed
    const [open, setOpen] = useState<boolean>(false); // Control sheet visibility
    const [jwt, setJwt] = useState<any>(null); // User state
    const [user, setUser] = useState<any>(null); // User state

    const router = useRouter();
    const {code} = router.query; // Extract confirmation code from the URL

    // Automatically open the sheet and confirm the email if the confirmation code is present
    useEffect(() => {
        const confirmEmail = async () => {
            if (code) {
                setOpen(true); // Open the sheet

                try {
                    setIsLoading(true);
                    // Call the email confirmation API
                    const response = await axios.get(
                        `${process.env.NEXT_PUBLIC_STRAPI_REST_API_URL}/auth/email-confirmation`,
                        {
                            params: {confirmation: code},
                        }
                    );

                    setJwt(response.data.jwt); // Store the user data
                    setUser(response.data.user); // Store the user data
                    console.log("Email confirmed successfully:", response.data);
                    setIsConfirmed(true); // Email confirmed successfully
                } catch (error) {
                    setError("Failed to confirm email. Please try again.");
                } finally {
                    setIsLoading(false);
                }
            }
        };

        // Ensure confirmEmail is called once when the component is mounted
        if (!isConfirmed) {
            confirmEmail();
        }
    }, [code]);

    const handlePasswordChange = async (e: React.FormEvent) => {
        if (!jwt) {
            return;
        }
        e.preventDefault();
        setFormError(null);
        setError(null);

        // Validate if the passwords match
        if (newPassword !== confirmPassword) {
            setFormError("Passwords do not match.");
            return;
        }

        try {
            setIsLoading(true);

            try {
                // Call the Strapi API to change the password
                const res = await axios.post(
                    `${process.env.NEXT_PUBLIC_STRAPI_REST_API_URL}/auth/change-password`,
                    {
                        currentPassword: "temporary-password", // Use the placeholder password that was set during registration
                        password: newPassword,
                        passwordConfirmation: confirmPassword, // Required by Strapi for confirmation
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${jwt}`, // Add JWT bearer token
                        },
                    }
                );
            } catch (error) {
                const responseError = error.response?.data?.error;
                if (responseError?.message) {
                    setFormError(responseError.message);
                } else {
                    setFormError("Failed to change password. Please try again.");
                }
            } finally {
                setIsLoading(false);
            }



            try {
                const result = await signIn("credentials", {
                    redirect: false,
                    email: user.email,
                    password: confirmPassword,
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

            setOpen(false); // Close the sheet after successful password change
        } catch (error) {
            const responseError = error.response?.data?.error;
            if (responseError?.message) {
                setFormError(responseError.message);
            } else {
                setFormError("Failed to change password. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Sheet open={open}>
            <SheetContent side="right" className="bg-gray-100 h-full overflow-y-auto sm:max-w-xl">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            {isConfirmed ? "Set a New Password" : "Confirming your email..."}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {isConfirmed
                                ? "Enter your new password below to complete the confirmation process."
                                : "Please wait while we confirm your email."}
                        </p>
                    </div>

                    {isConfirmed && (
                        <form onSubmit={handlePasswordChange}>
                            <div className="flex flex-col space-y-4">
                                <div className={cn("grid gap-6")}>
                                    <div className="grid gap-2">
                                        <div className="grid gap-1">
                                            <Label className="sr-only" htmlFor="new-password">
                                                New Password
                                            </Label>
                                            <Input
                                                id="new-password"
                                                placeholder="New Password"
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)} // Update the password state on change
                                                autoComplete="new-password"
                                                disabled={isLoading}
                                            />
                                        </div>
                                        <div className="grid gap-1">
                                            <Label className="sr-only" htmlFor="confirm-password">
                                                Confirm Password
                                            </Label>
                                            <Input
                                                id="confirm-password"
                                                placeholder="Confirm Password"
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)} // Update the confirm password state on change
                                                autoComplete="new-password"
                                                disabled={isLoading}
                                            />
                                        </div>
                                        <Button type="submit" className="w-full" disabled={isLoading}>
                                            Set Password
                                        </Button>
                                    </div>
                                </div>
                                {formError && <p className="text-red-500">{formError}</p>} {/* Error from API */}
                                {!isConfirmed && error && <p className="text-red-500">{error}</p>} {/* General error */}
                            </div>
                        </form>
                    )}

                    {!isConfirmed && <p>We are confirming your email, please wait...</p>}

                    <p className="px-8 text-center text-sm text-muted-foreground">
                        By setting a new password, you confirm that your email is verified.
                    </p>
                </div>
            </SheetContent>
        </Sheet>
    );
}
