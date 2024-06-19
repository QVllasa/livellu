import {Search} from "lucide-react";
import {Input} from "@/shadcn/components/ui/input";
import {debounce} from "lodash";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";

export const SearchFilter = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchQuery, setSearchQuery] = useState([]);
    const router = useRouter();

    const handleSearch = (terms) => {
        const query = {
            ...router.query,
            search: terms.join(' '),
        };
        router.replace({
            pathname: router.pathname,
            query,
        });
    };

    const handleSearchChange = (e) => {
        console.log(e.target.value)
        setSearchTerm(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        console.log("submitted: ", e)
        if (searchTerm.trim()) {
            const newSearchTerms = [...searchQuery, searchTerm.trim()];
            setSearchQuery(newSearchTerms);
            setSearchTerm('');
            handleSearch(newSearchTerms);
        }
    };

    const handleChipRemove = (term) => {
        const newSearchTerms = searchQuery.filter((t) => t !== term);
        setSearchQuery(newSearchTerms);
        handleSearch(newSearchTerms);
    };



    useEffect(() => {
        if (router.query.search) {
            setSearchQuery(router.query.search?.split(' '));
        }
    }, [router.query.search]);

    return <div className="w-full flex-1">
        <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
            <Input
                type="search"
                placeholder="Search products..."
                className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                value={searchTerm}
                onChange={handleSearchChange}
            />
        </form>
        <div className="flex gap-2 flex-wrap">
            {searchQuery.map((term) => (
                <div
                    key={term}
                    className="flex mt-2 items-center bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700"
                >
                    {term}
                    <button
                        type="button"
                        className="ml-2 text-gray-500 hover:text-gray-700"
                        onClick={() => handleChipRemove(term)}
                    >
                        &times;
                    </button>
                </div>
            ))}
        </div>
    </div>
}
