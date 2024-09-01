import React, {useEffect, useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {Button} from '@/shadcn/components/ui/button';
import {CardContent} from '@/shadcn/components/ui/card';
import {ChevronRight} from 'lucide-react'; // Chevron icon for indicating deeper levels
import Link from 'next/link'; // Import Link component for navigation
import {Category} from '@/types';
import {capitalize} from "lodash";
import {allCategoriesAtom} from "@/store/filters";
import {useAtom} from "jotai";

// Adjusted slide variants for a more subtle transition
const slideVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 50 : -50,  // Reduced slide distance for minimal effect
        opacity: 0,
    }),
    center: {
        x: 0,
        opacity: 1,
    },
    exit: (direction: number) => ({
        x: direction < 0 ? 50 : -50,  // Reduced slide distance for minimal effect
        opacity: 0,
    }),
};

const MobileCategoryMenu = ({closeDrawer}: { closeDrawer: () => void }) => {
    const [allCategories] = useAtom(allCategoriesAtom);
    const [currentLevel, setCurrentLevel] = useState<number>(0);
    const [categoryPath, setCategoryPath] = useState<Category[][]>([allCategories]); // Array of arrays to store categories at each level
    const [direction, setDirection] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [urlPath, setUrlPath] = useState<string>(''); // To store the URL path
    const [currentCategoryName, setCurrentCategoryName] = useState<string>(''); // To store the current category name

    useEffect(() => {
        setCategoryPath([allCategories]);
    }, [allCategories]);

    const handleCategoryClick = async (category: Category) => {
        if (category.child_categories?.length) {
            setCurrentLevel((prevLevel) => prevLevel + 1);
            setCategoryPath((prevPath) => [...prevPath, category.child_categories]);
            setDirection(1); // Move right
            setUrlPath((prevPath) => `${prevPath}/${category.slug}`); // Append the category slug to the URL path
            setCurrentCategoryName(category.name); // Update the current category name
        } else {
            // If there are no subcategories, reset or close the navigation
            alert('Reached the deepest level of this category.');
            handleBackClick();
        }
    };

    const handleBackClick = () => {
        if (currentLevel > 0) {
            setCurrentLevel((prevLevel) => prevLevel - 1);
            setCategoryPath((prevPath) => prevPath.slice(0, -1));
            setDirection(-1); // Move left
            setUrlPath((prevPath) => prevPath.split('/').slice(0, -1).join('/')); // Remove the last category from the URL path
            setCurrentCategoryName((prevName) => prevName.split(' > ').slice(0, -1).join(' > ')); // Update category name to previous level
        }
    };

    const categoriesToShow = categoryPath[currentLevel];

    return (
        <div className="w-full relative divide-y">
            {currentLevel !== 0 && (
                <Button variant={'link'} className={'text-lg font-semibold w-full justify-between'} onClick={handleBackClick}>
                    Zurück
                </Button>
            )}
            <AnimatePresence initial={false} custom={direction}>
                <motion.div
                    key={currentLevel}
                    className="absolute w-full"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: {type: 'spring', stiffness: 300, damping: 30},
                        opacity: {duration: 0.2},
                    }}
                >
                    <div className="divide-y">
                        {!loading ? (
                            <>
                                {currentLevel > 0 && (

                                        <Link href={urlPath} passHref>
                                            <Button
                                                onClick={closeDrawer}
                                                variant={'link'}
                                                className="text-lg font-semibold w-full justify-between"
                                            >
                                                Alles unter {capitalize(currentCategoryName)}
                                            </Button>
                                        </Link>


                                )}
                                {categoriesToShow.map((category) => (
                                    <CardContent
                                        key={category.id}
                                        className="flex items-center justify-between cursor-pointer w-full p-0"
                                    >
                                        {category.child_categories?.length > 0 ? (
                                            // If category has subcategories, handle click to show them
                                            <Button
                                                variant={'link'}
                                                className="text-lg font-semibold w-full justify-between"
                                                onClick={() => handleCategoryClick(category)}
                                            >
                                                <span>{capitalize(category.name)}</span>
                                                <ChevronRight className="w-4 h-4 ml-2"/>
                                            </Button>
                                        ) : (
                                            // If it's the deepest level, make it a link
                                            <Link href={`${urlPath}/${category.slug}`} passHref>
                                                <Button onClick={closeDrawer} variant={'link'} className="text-lg font-semibold w-full justify-between">
                                                    <span>{capitalize(category.name)}</span>
                                                </Button>
                                            </Link>
                                        )}
                                    </CardContent>
                                ))}
                            </>
                        ) : (
                            <p>Loading...</p> // Placeholder while loading categories
                        )}
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default MobileCategoryMenu;
