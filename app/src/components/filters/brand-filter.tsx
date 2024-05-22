import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { ScrollArea } from "@/shadcn/components/ui/scroll-area";
import { Button } from "@/shadcn/components/ui/button";
import { Input } from "@/shadcn/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/shadcn/components/ui/accordion";
import { capitalize } from "lodash";
import { useAtom } from "jotai";
import { currentBrandAtom } from "@/store/brand";
import {findBrandBySlug} from "@/framework/utils/find-by-slug";



export const BrandFilter = ({ allBrands }) => {
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [filteredBrands, setFilteredBrands] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [openItem, setOpenItem] = useState("item-1");

    const router = useRouter();
    const [currentBrand, setCurrentBrand] = useAtom(currentBrandAtom);

    useEffect(() => {
        if (!searchTerm) {
            setFilteredBrands(allBrands);
        }
    }, [allBrands, searchTerm]);

    useEffect(() => {
        // Extract the current brand from the route
        const pathSegments = router.asPath.split('/').filter(segment => segment);
        const brandSlug = pathSegments.find(segment => findBrandBySlug(allBrands, segment.toLowerCase()));

        if (!brandSlug) {
            setFilteredBrands(allBrands);
            setCurrentBrand({});
            setSearchTerm(''); // Clear the input
            return;
        }

        // Find the current brand using the original nested structure
        const currentBrand = findBrandBySlug(allBrands, brandSlug.toLowerCase());

        if (!currentBrand) {
            setFilteredBrands(allBrands);
            setCurrentBrand({});
            setSearchTerm(''); // Clear the input
            return;
        }

        setCurrentBrand(currentBrand);
        setSelectedBrand(currentBrand);
    }, [router.asPath, router.query, allBrands]);

    const handleBrandClick = (brand) => {
        if (selectedBrand?.slug === brand.slug) {
            // Unselect the brand
            setCurrentBrand(null);
            setSelectedBrand(null);
            // Remove brand from the URL
            const pathSegments = router.asPath.split('/').filter(segment => !segment.includes('?') && segment !== "");
            const updatedPathSegments = pathSegments.filter(segment => segment.toLowerCase() !== brand.slug.toLowerCase());
            const updatedPath = `/${updatedPathSegments.join('/')}`.replace(/\/+/g, '/');
            router.push(updatedPath);
        } else {
            // Select the brand
            const pathSegments = router.asPath.split('/').filter(segment => !segment.includes('?') && segment !== "");
            const updatedPathSegments = pathSegments.filter(segment => !allBrands.some(cat => cat.slug.toLowerCase() === segment));
            const updatedPath = `/${[...updatedPathSegments, brand.slug.toLowerCase()].join('/')}`.replace(/\/+/g, '/');
            setCurrentBrand(brand);
            setSelectedBrand(brand);
            router.push(updatedPath);
        }
    };

    const handleSearchSelect = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        if (value === '') {
            setFilteredBrands(allBrands);
            return;
        }
        setFilteredBrands(allBrands.filter((item) => item.label.toLowerCase().includes(value.toLowerCase())));
    };

    return (
        <div className="w-64 p-4 relative">
            <Accordion type="single" collapsible className="w-full" value={openItem} onValueChange={setOpenItem}>
                <AccordionItem value="item-1">
                    <AccordionTrigger>
                        <h4 className="text-sm font-medium">Marke{': '}
                            <span className={'font-bold'}>
                                {capitalize(currentBrand?.label)}
                            </span>
                        </h4>
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
                                {filteredBrands.map((item) => (
                                    <li key={item.id} className="mb-1 relative w-56">
                                        <Button
                                            size={'sm'}
                                            variant={selectedBrand?.slug === item.slug ? 'solid' : 'outline'}
                                            onClick={() => handleBrandClick(item)}
                                            className={`relative w-full ${selectedBrand?.slug === item.slug ? 'bg-blue-500 text-white' : ''}`}

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
