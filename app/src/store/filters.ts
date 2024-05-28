// Atoms for static data
import {atom} from "jotai";
import {Brand, Category, Color, Material} from "@/types";
import {fetchAllCategories} from "@/framework/category.ssr";
import {fetchAllBrands} from "@/framework/brand.ssr";

import {fetchAllMaterials} from "@/framework/material.ssr";
import {fetchAllColors} from "@/framework/color.ssr";
import {atomWithDefault} from "jotai/utils";

export const allCategoriesAtom =
    atomWithDefault<null | any | Category[]>(() => fetchAllCategories());

export const allBrandsAtom =
    atomWithDefault<null | any | Brand[]>(async () => await fetchAllBrands());

export const allColorsAtom =
    atomWithDefault<null | any | Color[]>(async () => fetchAllColors())

export const allMaterialsAtom =
    atomWithDefault<null | any | Material[]>(async () => fetchAllMaterials());


// Atom for the current category
export const currentCategoryAtom = atom<null | any | Category>(null);
export const currentColorAtom = atom<null | any | Color>(null);
export const currentMaterialAtom = atom<null | any | Material>(null);
export const currentBrandAtom = atom<null | any | Brand>(null);


export const priceRangeAtom = atom([0, 10000]); // Example initial range
