import {Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator} from "@/shadcn/components/ui/breadcrumb";
import {capitalize} from "lodash";
import {useRouter} from "next/router";
import {Category} from "@/types";
import React, {useEffect, useState} from "react";
import {Home} from "lucide-react";


export const Breadcrumbs = ({initialCategory}: {initialCategory: Category}) => {
    const [categoryPath, setCategoryPath] = useState<Category[]>([]);
    const router = useRouter();

    const {params}  = router.query;

    // Find the path to the current category
    useEffect(() => {
        if (params) {
            // const path = extractParentPath(currentCategory);
            const level0 = initialCategory;
            // @ts-ignore
            const level1 = level0?.child_categories.find(el => el.slug === params[1]);
            // @ts-ignore
            const level2 = level1?.child_categories.find(el => el.slug === params[2]);
            setCategoryPath([level0, level1, level2].filter(Boolean) as Category[]);
        }else {
            setCategoryPath([]);
        }
    }, [initialCategory,params]);


    const handleBreadcrumbClick = (category: Category) => {
        let pathSegments = [initialCategory?.slug];
        if (category.level === 0) {
            pathSegments = [category.slug];
        } else if (category.level === 1) {
            pathSegments = [initialCategory?.slug, category.slug];
        } else if (category.level === 2) {
            const level1Category = categoryPath.find(cat => cat.level === 1);
            pathSegments = [initialCategory?.slug, level1Category?.slug, category.slug];
        }

        const updatedPath = `/${pathSegments.filter(Boolean).join('/')}`;
        router.push(updatedPath);
    };



    return (
        <Breadcrumb >
            <BreadcrumbList>
                <BreadcrumbItem className={'text-[0.6rem] md:text-xs'}>
                    <BreadcrumbLink href="/"><Home className={'h-3 lg:h-4 w-3 lg:w-4 '} /></BreadcrumbLink>
                </BreadcrumbItem>
                {categoryPath.map((category, index) => {
                    const isLast = index === categoryPath.length - 1;
                    return (
                        <div className={'flex gap-0.5 md:gap-2'} key={category.id}>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem className={'text-[0.6rem] md:text-xs'}>
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
