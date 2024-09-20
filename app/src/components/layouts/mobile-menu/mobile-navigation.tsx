import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {AnimatePresence, motion} from 'framer-motion';
import {Button} from '@/shadcn/components/ui/button';
import {ChevronLeft, ChevronRight} from 'lucide-react';
import {useAtom} from 'jotai';
import {allNavigation} from '@/store/navigation';
import {capitalize} from 'lodash';
import {NavigationItem} from "@/types";

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

export default function MobileNavigation() {
    const router = useRouter();
    const [navigationData] = useAtom(allNavigation);
    const [currentLevel, setCurrentLevel] = useState<number>(0);
    const [navigationPath, setNavigationPath] = useState<NavigationItem[][]>([]);
    const [navigationNamePath, setNavigationNamePath] = useState<string[]>([]);
    const [direction, setDirection] = useState<number>(0);


    useEffect(() => {
        if (navigationData.length > 0) {
            setNavigationPath([navigationData]);
            setNavigationNamePath([]);
        }
    }, [navigationData]);

    const handleNavigationClick = (navigation: NavigationItem) => {
        if (navigation.child_navigations?.length) {
            setCurrentLevel((prevLevel) => prevLevel + 1);
            setNavigationPath((prevPath) => [...prevPath, navigation.child_navigations]);
            setNavigationNamePath((prevNames) => [...prevNames, navigation.title]);
            setDirection(1); // Move right
        } else {
            handleClick(navigation.url);
        }
    };

    const handleBackClick = () => {
        if (currentLevel > 0) {
            setCurrentLevel((prevLevel) => prevLevel - 1);
            setNavigationPath((prevPath) => prevPath.slice(0, -1));
            setNavigationNamePath((prevNames) => prevNames.slice(0, -1));
            setDirection(-1); // Move left
        }
    };

    function handleClick(path: string) {
        router.push(path);
    }

    const navigationToShow = navigationPath[currentLevel] || []; // Fallback to empty array if undefined

    return (
        <div className="w-full relative divide-y">
            {currentLevel !== 0 && (
                <Button variant={'link'} className={'text-lg font-normal w-full justify-start'}  onClick={handleBackClick}>
                    <ChevronLeft className="w-4 h-4 mr-2"/> <span>Zurück</span>
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
                        x: { type: 'spring', stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 },
                    }}
                >
                    <nav className="" aria-label="Sidebar">
                        <ul role="list" className="divide-y">
                            {navigationToShow.map((navigation) => (
                                <li key={navigation.id} className="flex items-center justify-between cursor-pointer">
                                    {navigation.child_navigations?.length ? (
                                        <Button
                                            variant="link"
                                            className="text-lg font-normal w-full justify-between"
                                            onClick={() => handleNavigationClick(navigation)}
                                        >
                                            <span>{capitalize(navigation.title)}</span>
                                            <ChevronRight className="w-4 h-4 ml-2"/>
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="link"
                                            className="text-lg font-normal w-full justify-between"
                                            onClick={() => handleClick(navigation.url)}
                                        >
                                            <span>{capitalize(navigation.title)}</span>
                                        </Button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </nav>
                </motion.div>
            </AnimatePresence>
        </div>
    );

}
