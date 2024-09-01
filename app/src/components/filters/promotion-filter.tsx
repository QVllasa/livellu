import {useRouter} from "next/router";
import {Button} from "@/shadcn/components/ui/button";
import {useEffect, useState} from "react";

const PromotionFilter = () => {
    const router = useRouter();
    const [isPromotionActive, setIsPromotionActive] = useState(false);

    useEffect(() => {
        // Initialize the button state based on the URL query
        setIsPromotionActive(router.query.promotion === "true");
    }, [router.query.promotion]);

    const handlePromotionToggle = () => {
        setIsPromotionActive(!isPromotionActive);
    };

    useEffect(() => {
        const pathSegments = router.query.params
            ? Array.isArray(router.query.params)
                ? router.query.params
                : [router.query.params]
            : [];

        // Build the base path with current segments
        const basePath = `/${pathSegments.join('/')}`;

        // Update the query params
        const updatedQuery = { ...router.query };

        // Conditionally include the promotion parameter
        if (isPromotionActive) {
            updatedQuery.promotion = 'true';
        } else {
            delete updatedQuery.promotion;
        }

        delete updatedQuery.params; // Remove 'params' key if present

        // Construct the new URL path with query
        const newUrl = `${basePath}${Object.keys(updatedQuery).length ? `?${new URLSearchParams(updatedQuery).toString()}` : ''}`;

        // Navigate to the updated URL
        router.push(newUrl);
    }, [isPromotionActive]);

    return (
            <Button
                size="sm"
                variant={isPromotionActive ? null : "outline"} // Change variant based on active state
                className={`flex  ${isPromotionActive ? "bg-blue-500 text-white" : ""}`}
                onClick={handlePromotionToggle}
            >
                Im Sale %
            </Button>
    );
};

export default PromotionFilter;
