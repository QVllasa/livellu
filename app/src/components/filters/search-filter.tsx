import {Search, X} from "lucide-react"; // Import the 'X' icon for clear button
import {Input} from "@/shadcn/components/ui/input";
import {Button} from "@/shadcn/components/ui/button";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";

export const SearchFilter = () => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const router = useRouter();

    const handleSearch = (term: string) => {
        const pathSegments = router.query.params ? (Array.isArray(router.query.params) ? router.query.params : [router.query.params]) : [];
        const basePath = `/${pathSegments.join('/')}`;

        // Build the updated query
        const updatedQuery = { ...router.query };
        delete updatedQuery.params; // Remove 'params' to keep it in the path

        if (term.trim()) {
            updatedQuery.search = term.trim();
        } else {
            delete updatedQuery.search; // Remove search if term is empty
        }

        // Construct the new URL path with query
        const newUrl = `${basePath}${Object.keys(updatedQuery).length ? `?${new URLSearchParams(updatedQuery).toString()}` : ''}`;

        router.replace(newUrl);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSearch(searchTerm);
    };

    const handleClearSearch = () => {
        setSearchTerm('');
        handleSearch('');
    };

    useEffect(() => {
        // Initialize searchTerm from URL query on first render
        if (router.query.search) {
            setSearchTerm(router.query.search as string);
        } else {
            setSearchTerm(''); // Clear the input if there's no search query in the URL
        }
    }, [router.query.search]);

    return (
        <form onSubmit={handleSearchSubmit} className="flex w-full items-center space-x-2 relative">
            <Search className="absolute left-4 top-3 h-4 w-4 text-muted-foreground" />
            <Input
                type="text"
                placeholder="Durchsuche alle Produkte, Marken und Shops"
                className="w-full appearance-none bg-background pl-8 pr-12 shadow-none"
                value={searchTerm}
                onChange={handleSearchChange}
            />
            {searchTerm && (
                <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-12 top-2.5 h-5 w-5 text-muted-foreground hover:text-black transition"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
            <Button size={'icon'} type="submit" variant={'outline'}>
                <Search className="h-4 w-4 text-muted-foreground" />
            </Button>
        </form>
    );
};
