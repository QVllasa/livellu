// store.js
import {atom} from 'jotai';
import Client from "@/framework/client";
import {Entity, Material} from "@/types";

// Atom für alle Kategorien
export const allMaterialAtom = atom(
    async (get) => {

        const params = {
            filters: {
                // isMaterial: {
                //     $eq: true
                // }
            },
            populate: {
                child_materials: {populate: '*'},
                parent_materials: {populate: '*'},
            },
            pagination: {
                page: 1,
                pageSize: 1000 // This sets the limit to 10 objects
            }
        }

        const response = await Client.materials.all(params)
        return response.data.map((entity: Entity<Material>) => {
            const id = entity.id;
            const modifiedItem: Material = {
                ...entity.attributes,
                id: id
            };
            return modifiedItem;
        });
    }
);


export const currentMaterialAtom = atom<null | any | Material>(null);
