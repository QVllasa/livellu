import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {ScrollArea} from "@/shadcn/components/ui/scroll-area";
import {Button} from "@/shadcn/components/ui/button";
import {Input} from "@/shadcn/components/ui/input";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/shadcn/components/ui/accordion";
import {capitalize} from "lodash";
import {useAtom} from "jotai";
import {allBrandsAtom, currentBrandAtom} from "@/store/filters";
import {findBrandBySlug} from "@/framework/utils/find-by-slug";
import {Brand} from "@/types";
import {arrangePathSegments} from "@/lib/utils";

export const BrandFilter = () => {
    const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);
    const [allBrands] = useAtom(allBrandsAtom);
    const [searchTerm, setSearchTerm] = useState('');
    const [openItem, setOpenItem] = useState("item-1");

    const router = useRouter();
    const [currentBrand, setCurrentBrand] = useAtom(currentBrandAtom);

    useEffect(() => {
        setFilteredBrands(allBrands);
    }, [allBrands]);

    useEffect(() => {
        if (!searchTerm) {
            setFilteredBrands(allBrands);
        } else {
            setFilteredBrands(allBrands.filter((brand: Brand) => brand.label.toLowerCase().includes(searchTerm.toLowerCase())));
        }
    }, [allBrands, searchTerm]);

    useEffect(() => {
        const pathSegments = router.asPath.split(/[/?]/).filter(segment => segment);
        const brandSlug = pathSegments.find(segment => segment.startsWith('brand-'));

        if (!brandSlug) {
            setFilteredBrands(allBrands);
            setCurrentBrand(null);
            setSearchTerm('');
            return;
        }

        const currentBrand = findBrandBySlug(allBrands, brandSlug);

        if (!currentBrand) {
            setFilteredBrands(allBrands);
            setCurrentBrand(null);
            setSearchTerm('');
            return;
        }

        setCurrentBrand(currentBrand);
    }, [router.asPath, router.query, allBrands]);

    const handleBrandClick = (brand: Brand) => {
        const [path, queryString] = router.asPath.split('?');
        const pathSegments = path.split('/').filter(seg => seg !== '' && seg !== 'moebel');

        const brandIndex = pathSegments.findIndex(el => el?.startsWith('brand-'));

        if (brandIndex !== -1) {
            if (currentBrand?.slug === brand.slug) {
                pathSegments.splice(brandIndex, 1); // Remove the brand if it is clicked again
                setCurrentBrand(null);
            } else {
                pathSegments[brandIndex] = `${brand.slug.toLowerCase()}`;
                setCurrentBrand(brand);
            }
        } else {
            pathSegments.push(`${brand.slug.toLowerCase()}`);
            setCurrentBrand(brand);
        }

        // Sort segments after
        const sortedPathSegments = arrangePathSegments(pathSegments);

        const updatedPath = `/moebel/${sortedPathSegments.filter(Boolean).join('/')}`.replace(/\/+/g, '/');
        const queryParams = queryString ? `?${queryString}` : '';

        router.replace(`${updatedPath}${queryParams}`, undefined, {scroll: false});
    };


    const handleSearchSelect = (event: { target: { value: string } }) => {
        const value = event.target.value;
        setSearchTerm(value);
        if (value === '') {
            setFilteredBrands(allBrands);
            return;
        }
        setFilteredBrands(allBrands.filter((item: Brand) => item.label.toLowerCase().includes(value.toLowerCase())));
    };

    return (
        <div className="w-64 p-4 relative">
            <Accordion type="single" collapsible className="w-full" value={openItem} onValueChange={setOpenItem}>
                <AccordionItem value="item-1">
                    <AccordionTrigger>
                        <h4 className="text-sm font-medium">Marke:</h4>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="w-full mb-4">
                            <Input
                                type="text"
                                placeholder="Search brands..."
                                value={searchTerm}
                                onChange={handleSearchSelect}
                            />
                        </div>
                        <ScrollArea className="max-h-64 overflow-y-scroll w-full">
                            <ul>
                                {filteredBrands.map((item: Brand) => (
                                    <li key={item.id} className="mb-1 relative w-56">
                                        <Button
                                            size={'sm'}
                                            variant={currentBrand?.slug === item.slug ? null : 'outline'}
                                            onClick={() => handleBrandClick(item)}
                                            className={`relative w-full ${currentBrand?.slug === item.slug ? 'bg-blue-500 text-white' : ''}`}
                                        >
                                            <span className={'truncate'}> {capitalize(item.label)}</span>
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        </ScrollArea>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
};
