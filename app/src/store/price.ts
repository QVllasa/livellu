import { atom } from 'jotai';

export const minPriceAtom = atom(0);
export const maxPriceAtom = atom(1000);

export const currentMinPriceAtom = atom(
    (get) => get(minPriceAtom),
    (get, set, newMinPrice) => {
        set(minPriceAtom, newMinPrice);
    }
);

export const currentMaxPriceAtom = atom(
    (get) => get(maxPriceAtom),
    (get, set, newMaxPrice) => {
        set(maxPriceAtom, newMaxPrice);
    }
);
