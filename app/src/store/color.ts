// store.js
import {atom} from 'jotai';
import Client from "@/framework/client";
import { Color, Entity} from "@/types";

// Atom für alle Kategorien
export const allColorAtom = atom(
    async (get) => {

        const params = {
            filters: {
                isColor: {
                    $eq: true
                }
            },
            populate: {
                child_colors: {populate: '*'},
                parent_colors: {populate: '*'},
            },
            pagination: {
                page: 1,
                pageSize: 1000 // This sets the limit to 10 objects
            }
        }

        const response = await Client.colors.all(params)
        return response.data.map((entity: Entity<Color>) => {
            const id = entity.id;
            const modifiedItem: Color = {
                ...entity.attributes,
                id: id
            };
            return modifiedItem;
        });
    }
);


export const currentColorAtom = atom<null | any | Color>(null);
