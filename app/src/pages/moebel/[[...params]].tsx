import Link from "next/link"
import {CircleUser, Home, LineChart, Menu, Package, Package2, Search, ShoppingCart, Users,} from "lucide-react"

import {Badge} from "@/shadcn/components/ui/badge"
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/shadcn/components/ui/card"
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,} from "@/shadcn/components/ui/dropdown-menu"
import {Input} from "@/shadcn/components/ui/input"
import {Sheet, SheetContent, SheetTrigger} from "@/shadcn/components/ui/sheet"
import {getLayout} from "@/components/layouts/layout";
import {Button} from '@/shadcn/components/ui/button';
import {CategoryFilter} from "@/components/filters/category-filter";
import {useProducts} from "@/framework/product";
import ProductCard from "@/components/products/cards/product-card";
import {ArrowPathIcon, StarIcon} from "@heroicons/react/24/solid";
import {useCategories} from "@/framework/category";
import {Suspense, useEffect, useState} from "react";
import {useRouter} from "next/router";
import {currentCategoryAtom} from "@/store/category";
import {useAtom} from "jotai";
import {capitalize} from "lodash";
import {Breadcrumbs} from "@/components/breadcrumbs/breadcrumbs";



function MoebelPage() {
    const router = useRouter();
    const { params } = router.query;
    const [currentCategory] = useAtom(currentCategoryAtom);


    const productsFilter = {
        pagination: {
            page: 1,
            pageSize: 100 // This sets the limit to 10 objects
        }
    };

    useEffect(() => {
        // Handle any side-effects or updates when currentCategory changes
        console.log("Current Category updated: ", currentCategory);
    }, [currentCategory]);


    const {products} = useProducts(productsFilter);

    if (!products) {
        return <div>Loading...</div>;
    }

    console.log("products: ", products);

    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] relative">
            <div className="hidden border-r bg-muted/40 md:block">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-4">
                        <Link href="/" className="flex items-center gap-2 font-semibold">
                            <Package2 className="h-6 w-6"/>
                            <span className="">{capitalize(currentCategory?.name ?? 'Moebel')}</span>
                        </Link>
                    </div>
                    <div className="flex-1 h-full ">
                        <Suspense fallback={<div>Loading...</div>}>
                            <CategoryFilter/>
                        </Suspense>


                    </div>
                </div>
            </div>
            <div className="flex flex-col">
                <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                className="shrink-0 md:hidden"
                            >
                                <Menu className="h-5 w-5"/>
                                <span className="sr-only">Toggle navigation menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="flex flex-col">
                            <nav className="grid gap-2 text-lg font-medium">
                                <Link
                                    href="#"
                                    className="flex items-center gap-2 text-lg font-semibold"
                                >
                                    <Package2 className="h-6 w-6"/>
                                    <span className="sr-only">Acme Inc</span>
                                </Link>
                                <Link
                                    href="#"
                                    className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                                >
                                    <Home className="h-5 w-5"/>
                                    Dashboard
                                </Link>
                                <Link
                                    href="#"
                                    className="mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground"
                                >
                                    <ShoppingCart className="h-5 w-5"/>
                                    Orders
                                    <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                                        6
                                    </Badge>
                                </Link>
                                <Link
                                    href="#"
                                    className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                                >
                                    <Package className="h-5 w-5"/>
                                    Products
                                </Link>
                                <Link
                                    href="#"
                                    className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                                >
                                    <Users className="h-5 w-5"/>
                                    Customers
                                </Link>
                                <Link
                                    href="#"
                                    className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                                >
                                    <LineChart className="h-5 w-5"/>
                                    Analytics
                                </Link>
                            </nav>
                            <div className="mt-auto">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Upgrade to Pro</CardTitle>
                                        <CardDescription>
                                            Unlock all features and get unlimited access to our
                                            support team.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Button size="sm" className="w-full">
                                            Upgrade
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </SheetContent>
                    </Sheet>
                    <div className="w-full flex-1">
                        <form>
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
                                <Input
                                    type="search"
                                    placeholder="Search products..."
                                    className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                                />
                            </div>
                        </form>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="secondary" size="icon" className="rounded-full">
                                <CircleUser className="h-5 w-5"/>
                                <span className="sr-only">Toggle user menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem>Settings</DropdownMenuItem>
                            <DropdownMenuItem>Support</DropdownMenuItem>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem>Logout</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                    <div className="flex items-center">
                        <h1 className="text-lg font-semibold md:text-2xl">Inventory</h1>
                    </div>
                    <Suspense fallback={<ArrowPathIcon className="mr-2 h-12 w-12 animate-spin" />}>
                        <Breadcrumbs/>
                    </Suspense>

                    <div
                        className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm" x-chunk="dashboard-02-chunk-1"
                    >
                        <Suspense fallback={<ArrowPathIcon className="mr-2 h-12 w-12 animate-spin" />}>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {products.map((product, index) => (
                                    <ProductCard key={index} product={product}/>
                                ))}
                            </div>
                        </Suspense>

                    </div>
                </main>
            </div>
        </div>
    )
}

MoebelPage.getLayout = getLayout;
export default MoebelPage;

