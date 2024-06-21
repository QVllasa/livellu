import {Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator} from "@/shadcn/components/ui/breadcrumb";
import {useAtom} from "jotai";
import {currentCategoryAtom} from "@/store/filters";
import {capitalize} from "lodash";
import {useRouter} from "next/router";
import {Category} from "@/types";
import {useEffect, useState} from "react";

// Helper function to extract path directly from current category
function extractParentPath(category: Category | null): Category[] {
    const path: Category[] = [];

    while (category) {
        path.unshift(category);
        if (category.parent_categories && category.parent_categories && category.parent_categories.length > 0) {
            category = category.parent_categories[0];
        } else {
            category = null;
        }
    }

    return path;
}



export const Breadcrumbs = () => {
    const [currentCategory, setCurrentCategory] = useAtom(currentCategoryAtom);
    const [categoryPath, setCategoryPath] = useState<Category[]>([]);

    const router = useRouter();

    // Find the path to the current category
    useEffect(() => {
        if (currentCategory) {
            const path = extractParentPath(currentCategory);
            setCategoryPath(path);
        }else {
            setCategoryPath([]);
        }
    }, [currentCategory]);


    const handleBreadcrumbClick = (category) => {
        const pathSegments = router.asPath.split('/').filter(segment => segment);
        const categorySlug = pathSegments.find(segment => segment.startsWith('category-'));


        if (categorySlug) {
            const updatedPathSegments = pathSegments.map(segment =>
                segment === categorySlug ? category.slug.toLowerCase() : segment
            );
            const updatedPath = `/${updatedPathSegments.join('/')}`.replace(/\/+/g, '/');
            setCurrentCategory(category);
            router.push(updatedPath);
        }
    };

    const handleMoebelClick = () => {
        const pathSegments = router.asPath.split('/').filter(segment => segment);
        const categorySlug = pathSegments.find(segment => segment.startsWith('category-'));

        if (categorySlug) {
            const updatedPathSegments = pathSegments.filter(segment => segment !== categorySlug);
            const updatedPath = `/${updatedPathSegments.join('/')}`.replace(/\/+/g, '/');
            setCurrentCategory(null);
            router.push(updatedPath);
        }
    };

    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbLink href="/moebel" onClick={(e) => {
                        e.preventDefault();
                        handleMoebelClick();
                    }}>Möbel</BreadcrumbLink>
                </BreadcrumbItem>
                {categoryPath.map((category, index) => {
                    const isLast = index === categoryPath.length - 1;
                    return (
                        <div className={'flex gap-2'} key={category.id}>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                {isLast ? (
                                    <BreadcrumbPage>{capitalize(category.name)}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink href="#" onClick={(e) => {
                                        e.preventDefault();
                                        handleBreadcrumbClick(category);
                                    }}>{capitalize(category.name)}</BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                        </div>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
};
