// store.js
import {atom} from 'jotai';
import Client from "@/framework/client";
import {Category, Colour, Entity} from "@/types";

// Atom für alle Kategorien
export const allColourAtom = atom(
    async (get) => {

        const params = {
            filters: {
                isColour: {
                    $eq: true
                }
            },
            populate: {
                child_categories: {populate: '*'},
                parent_categories: {populate: '*'},
            },
            pagination: {
                page: 1,
                pageSize: 1000 // This sets the limit to 10 objects
            }
        }

        const response = await Client.colours.all(params)
        return response.data.map((entity: Entity<Colour>) => {
            const id = entity.id;
            const modifiedItem: Colour = {
                ...entity.attributes,
                id: id
            };
            return modifiedItem;
        });
    }
);


export const currentColourAtom = atom<null | Colour>(null);
