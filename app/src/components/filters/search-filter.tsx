import {Search, X} from "lucide-react"; // Import the 'X' icon for clear button
import {Input} from "@/shadcn/components/ui/input";
import {Button} from "@/shadcn/components/ui/button";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";

export const SearchFilter = () => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const router = useRouter();

    const handleSearch = (term: string) => {
        // If there's a search term, redirect to the new path with the search term as a query parameter
        if (term.trim()) {
            router.push({
                pathname: '/suche',
                query: { search: term.trim() },
            });
        } else {
            // If the search term is cleared, just navigate to the base search path
            router.push('/suche');
        }


    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSearch(searchTerm);
    };

    const handleClearSearch = (e) => {
        e.preventDefault();
        setSearchTerm('');
        if (router.pathname.includes('/suche')) {
            handleSearch('');
        }

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
        <form onSubmit={handleSearchSubmit} className="flex w-full items-center  relative">
            <Search className="absolute left-4 top-3 h-4 w-4 text-muted-foreground" />
            <Input
                type="text"
                placeholder="Durchsuche alle Produkte, Marken und Shops"
                className="w-full appearance-none bg-background pl-10 pr-12 shadow-none text-xs lg:text-sm"
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
            <Button className={'ml-2'} size={'icon'} type="submit" variant={'outline'}>
                <Search className="h-4 w-4 text-muted-foreground" />
            </Button>
        </form>
    );
};
