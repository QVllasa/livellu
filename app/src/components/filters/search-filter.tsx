import {Search} from "lucide-react";
import {Input} from "@/shadcn/components/ui/input";
import {debounce} from "lodash";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";

export const SearchFilter = ({setLoading }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchTerms, setSearchTerms] = useState([]);
    const router = useRouter();

    const debouncedSearch = debounce((terms) => {
        setLoading(true);
        const query = {
            ...router.query,
            search: terms.join(' '),
        };
        router.push({
            pathname: router.pathname,
            query,
        });
    }, 500);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            const newSearchTerms = [...searchTerms, searchTerm.trim()];
            setSearchTerms(newSearchTerms);
            setSearchTerm('');
            debouncedSearch(newSearchTerms);
        }
    };

    const handleChipRemove = (term) => {
        const newSearchTerms = searchTerms.filter((t) => t !== term);
        setSearchTerms(newSearchTerms);
        debouncedSearch(newSearchTerms);
    };


    useEffect(() => {
        if (router.query.search) {
            setSearchTerms(router.query.search?.split(' '));
        }
        setLoading(false);
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
            {searchTerms.map((term) => (
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
