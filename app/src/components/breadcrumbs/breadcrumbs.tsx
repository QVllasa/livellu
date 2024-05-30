import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
    BreadcrumbPage
} from "@/shadcn/components/ui/breadcrumb";
import { useAtom } from "jotai";
import { currentCategoryAtom, allCategoriesAtom } from "@/store/filters";
import { capitalize } from "lodash";
import { useRouter } from "next/router";
import { Category } from "@/types";
import { useEffect, useState } from "react";

// Helper function to extract path directly from current category
function extractParentPath(category: Category | null): Category[] {
    const path: Category[] = [];

    while (category) {
        path.unshift(category);
        if (category.parent_categories && category.parent_categories.data && category.parent_categories.data.length > 0) {
            const parent = category.parent_categories.data[0];
            category = { id: parent.id, ...parent.attributes };
        } else {
            category = null;
        }
    }

    return path;
}



export const Breadcrumbs = () => {
    const [currentCategory, setCurrentCategory] = useAtom(currentCategoryAtom);
    const [allCategories] = useAtom(allCategoriesAtom);
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

    useEffect(() => {
        console.log("categoryPath: ", categoryPath)
    }, [categoryPath]);

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
