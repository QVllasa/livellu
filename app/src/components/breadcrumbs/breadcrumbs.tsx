import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
    BreadcrumbPage
} from "@/shadcn/components/ui/breadcrumb";
import { useAtom } from "jotai";
import { currentCategoryAtom, allCategoriesAtom } from "@/store/category";
import { capitalize } from "lodash";
import { useRouter } from "next/router";

// Helper function to find the path to the current category
const findCategoryPath = (categories, categoryId, path = []) => {
    for (const category of categories) {
        if (category.id === categoryId) {
            return [...path, category];
        }
        if (category.child_categories?.data?.length) {
            const result = findCategoryPath(category.child_categories.data, categoryId, [...path, category]);
            if (result) {
                return result;
            }
        }
    }
    return null;
};

const findCategoryBySlug = (categories, slug) => {
    for (const category of categories) {
        if (category.slug?.toLowerCase() === slug || category.attributes?.slug?.toLowerCase() === slug) {
            return { id: category.id, ...category };
        }
        if (category.child_categories?.data?.length) {
            const found = findCategoryBySlug(category.child_categories.data, slug);
            if (found) {
                return { id: found.id, ...found.attributes };
            }
        }
    }
    return null;
};

export const Breadcrumbs = () => {
    const [currentCategory, setCurrentCategory] = useAtom(currentCategoryAtom);
    const [allCategories] = useAtom(allCategoriesAtom);
    const router = useRouter();

    // Find the path to the current category
    const categoryPath = currentCategory ? findCategoryPath(allCategories, currentCategory.id) : [];

    const handleBreadcrumbClick = (category) => {
        const pathSegments = router.asPath.split('/').filter(segment => segment);
        const categorySlug = pathSegments.find(segment => findCategoryBySlug(allCategories, segment.toLowerCase()));

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
        const categorySlug = pathSegments.find(segment => findCategoryBySlug(allCategories, segment.toLowerCase()));

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
                {categoryPath?.map((category, index) => {
                    const isLast = index === categoryPath.length - 1;
                    return (
                        <BreadcrumbItem key={category.id}>
                            <BreadcrumbSeparator />
                            {isLast ? (
                                <BreadcrumbPage>{capitalize(currentCategory.name)}</BreadcrumbPage>
                            ) : (
                                <BreadcrumbLink href={`/${category.slug}`} onClick={(e) => {
                                    e.preventDefault();
                                    handleBreadcrumbClick(category);
                                }}>{capitalize(category.name)}</BreadcrumbLink>
                            )}
                        </BreadcrumbItem>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
};
