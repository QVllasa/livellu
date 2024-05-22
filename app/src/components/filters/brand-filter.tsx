import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {ScrollArea} from "@/shadcn/components/ui/scroll-area";
import {Button} from "@/shadcn/components/ui/button";
import {Input} from "@/shadcn/components/ui/input";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/shadcn/components/ui/accordion";
import {capitalize} from "lodash";
import {useAtom} from "jotai";
import {Brand} from "@/types";
import {allBrandAtom, currentBrandAtom} from "@/store/brand";

// Helper function to find brand by slug in the nested structure
const findBrandBySlug = (brands, slug) => {
    for (const brand of brands) {
        if (brand.slug?.toLowerCase() === slug || brand.attributes?.slug?.toLowerCase() === slug) {
            return {id: brand.id, ...brand};
        }
    }
    return null;
};

export const BrandFilter = () => {
    const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
    const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);
    const [childBrands, setChildBrands] = useState<Brand[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [openItem, setOpenItem] = useState("item-1");

    const router = useRouter();
    const [allBrands] = useAtom(allBrandAtom);
    const [currentBrand, setCurrentBrand] = useAtom(currentBrandAtom);

    console.log("filteredBrands: ", filteredBrands);

    useEffect(() => {
        // Extract the current brand from the route
        const pathSegments = router.asPath.split('/').filter(segment => segment);
        const brandSlug = pathSegments.find(segment => findBrandBySlug(allBrands, segment.toLowerCase()));

        console.log("pathSegments: ", pathSegments);
        console.log("brandSlug: ", brandSlug);

        if (!brandSlug) {
            console.log("no brand slug found");
            setFilteredBrands(allBrands);

            setCurrentBrand(null);
            setSearchTerm(''); // Clear the input
            return;
        }

        // Find the current brand using the original nested structure
        const currentBrand = findBrandBySlug(allBrands, brandSlug.toLowerCase());

        if (!currentBrand) {
            console.log("no current brand found");
            setFilteredBrands(allBrands);

            setCurrentBrand(null);
            setSearchTerm(''); // Clear the input
            return;
        }

        setCurrentBrand(currentBrand);
        setSelectedBrand(currentBrand);
    }, [router.asPath, router.query, allBrands]);

    const handleBrandClick = (brand: Brand) => {
        const pathSegments = router.asPath.split('/').filter(segment => !segment.includes('?') && segment !== "");

        console.log("pathSegments: ", pathSegments);
        console.log("brand: ", brand);

        const updatedPathSegments = pathSegments.filter(segment => !allBrands.some(cat => cat.slug.toLowerCase() === segment));
        const updatedPath = `/${[...updatedPathSegments, brand.slug.toLowerCase()].join('/')}`.replace(/\/+/g, '/');

        setCurrentBrand(brand);
        setSelectedBrand(brand);
        router.push(updatedPath);
    };

    const handleSearchSelect = (event) => {
        const value = event.target.value;
        if (value === '') {
            setFilteredBrands(childBrands);
            setSearchTerm('');
            return;
        }
        setSearchTerm(value);
        setFilteredBrands(childBrands.filter((item: Brand) => item.label.toLowerCase().includes(value.toLowerCase())));
    };

    return (
        <div className="w-64 p-4 relative">
            <Accordion type="single" collapsible className="w-full" value={openItem} onValueChange={setOpenItem}>
                <AccordionItem value="item-1">
                    <AccordionTrigger>
                        <h4 className="text-sm font-medium">Brand{': '}
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
                                            disabled={selectedBrand?.slug === item.slug} // Disable the button if it is the selected brand
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
