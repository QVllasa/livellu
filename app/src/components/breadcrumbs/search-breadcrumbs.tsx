import {Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator} from "@/shadcn/components/ui/breadcrumb";
import React from "react";
import Icon from "@/components/ui/icon";

export const SearchBreadcrumbs = () => {



    return (
        <Breadcrumb >
            <BreadcrumbList>
                <BreadcrumbItem className={'text-[0.6rem] md:text-xs'}>
                    <BreadcrumbLink href="/"><Icon name='Home' className={'h-3 w-3'} /></BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem className={'text-[0.6rem] md:text-xs'}>
                    <BreadcrumbLink href="/suche">Suche</BreadcrumbLink>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    )

}
