// store.js
import {atom} from 'jotai';
import Client from "@/framework/client";
import { Brand, Entity} from "@/types";

// Atom für alle Kategorien
export const allBrandAtom = atom(
    async (get) => {

        const params = {
            filters: {
                // isBrand: {
                //     $eq: true
                // }
            },
            populate: {
                child_brands: {populate: '*'},
                parent_brands: {populate: '*'},
            },
            pagination: {
                page: 1,
                pageSize: 1000 // This sets the limit to 10 objects
            }
        }

        const response = await Client.brands.all(params)
        return response.data.map((entity: Entity<Brand>) => {
            const id = entity.id;
            const modifiedItem: Brand = {
                ...entity.attributes,
                id: id
            };
            return modifiedItem;
        });
    }
);


export const currentBrandAtom = atom<null | Brand>(null);
