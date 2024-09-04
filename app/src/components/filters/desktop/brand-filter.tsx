import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {ScrollArea} from "@/shadcn/components/ui/scroll-area";
import {Button} from "@/shadcn/components/ui/button";
import {Input} from "@/shadcn/components/ui/input";
import {capitalize} from "lodash";
import {useAtom} from "jotai";
import {allBrandsAtom, currentBrandAtom} from "@/store/filters";
import {findBrandBySlug} from "@/framework/utils/find-by-slug";
import {Brand} from "@/types";
import {fetchProducts} from "@/framework/product";
import {Popover, PopoverContent, PopoverTrigger} from "@/shadcn/components/ui/popover";

export const BrandFilter = ({ filters }) => {
    const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);
    const [allBrands] = useAtom(allBrandsAtom);
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const router = useRouter();
    const [currentBrands, setCurrentBrands] = useAtom(currentBrandAtom);

    useEffect(() => {
        if (!filters) return;

        console.log("filters brands", filters);

        fetchProducts(filters).then((response) => {
            const includedBrands = response.meta.facetDistribution['brandName'];
            const filtered = allBrands
                .filter((brand: Brand) => includedBrands.hasOwnProperty(brand.label))
                .map((brand: Brand) => ({
                    ...brand,
                    count: includedBrands[brand.label],
                }));
            setFilteredBrands(filtered);
        });
    }, [filters, allBrands]);

    useEffect(() => {
        if (!searchTerm) {
            setFilteredBrands(allBrands);
        } else {
            setFilteredBrands(allBrands.filter((brand: Brand) => brand.label.toLowerCase().includes(searchTerm.toLowerCase())));
        }
    }, [allBrands, searchTerm]);

    useEffect(() => {
        const pathSegments = router.asPath.split(/[/?]/).filter(segment => segment);
        const brandSegment = pathSegments.find(segment => segment.startsWith('marke:'));

        if (!brandSegment) {
            setFilteredBrands(allBrands);
            setCurrentBrands([]);
            setSearchTerm('');
            return;
        }

        const brandSlugs = brandSegment.replace('marke:', '').split('.');
        const selectedBrands = brandSlugs.map(slug => findBrandBySlug(allBrands, slug)).filter(Boolean);

        setCurrentBrands(selectedBrands);
    }, [router.asPath, router.query, allBrands]);

    const handleBrandClick = (brand: Brand) => {
        const [path, queryString] = router.asPath.split('?');
        const pathSegments = path.split('/').filter(seg => seg !== '');

        const brandSegmentIndex = pathSegments.findIndex(el => el.startsWith('marke:'));
        let newBrandSegment = '';

        if (brandSegmentIndex !== -1) {
            const currentBrandSlugs = pathSegments[brandSegmentIndex].replace('marke:', '').split('.');
            const isBrandSelected = currentBrandSlugs.includes(brand.slug);

            if (isBrandSelected) {
                newBrandSegment = currentBrandSlugs.filter(slug => slug !== brand.slug).join('.');
            } else {
                newBrandSegment = [...currentBrandSlugs, brand.slug].join('.');
            }

            if (newBrandSegment) {
                pathSegments[brandSegmentIndex] = `marke:${newBrandSegment}`;
            } else {
                pathSegments.splice(brandSegmentIndex, 1);
            }
        } else {
            newBrandSegment = brand.slug;
            pathSegments.push(`marke:${newBrandSegment}`);
        }

        const updatedPath = `/${pathSegments.filter(Boolean).join('/')}`.replace(/\/+/g, '/');
        const queryParams = queryString ? `?${queryString}` : '';

        router.replace(`${updatedPath}${queryParams}`, undefined, { scroll: true });
    };

    const handleSearchSelect = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        if (value === '') {
            setFilteredBrands(allBrands);
            return;
        }
        setFilteredBrands(allBrands.filter((item: Brand) => item.label.toLowerCase().includes(value.toLowerCase())));
    };

    return (
        <div className="w-auto">
            <Popover
                className="w-full"
                open={isOpen}
                onOpenChange={(open) => setIsOpen(open)}
            >
                <PopoverTrigger asChild>
                    <Button
                        size="sm"
                        variant={'outline'}
                        className={`relative w-full  ${(isOpen || (currentBrands && currentBrands.length > 0)) ? " bg-blue-500 text-white" : ""}`}
                    >
                        <span>Marken</span>
                        {currentBrands && currentBrands.length > 0 && (
                            <span className="ml-2 text-xs font-thin">({currentBrands.length})</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent>
                    <div className="w-full mb-4">
                        <Input
                            type="text"
                            placeholder="Search brands..."
                            value={searchTerm}
                            onChange={handleSearchSelect}
                        />
                    </div>

                    <ScrollArea className="h-72 w-full">
                        <ul>
                            {filteredBrands.map((item: Brand) => (
                                <li key={item.id} className="mb-1 relative w-56">
                                    <Button
                                        size="sm"
                                        variant={currentBrands.some(b => b.slug === item.slug) ? null : 'outline'}
                                        onClick={() => handleBrandClick(item)}
                                        className={`relative w-full ${currentBrands.some(b => b.slug === item.slug) ? 'bg-blue-500 text-white' : ''}`}
                                    >
                                        <span className="truncate"> {capitalize(item.label)}</span>
                                        <span className={`${currentBrands.some(b => b.slug === item.slug) ? 'text-white' : 'text-gray-700'} ml-2 font-light text-xs`}>
                                            {item.count}
                                        </span>
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    </ScrollArea>
                </PopoverContent>
            </Popover>
        </div>
    );
};
