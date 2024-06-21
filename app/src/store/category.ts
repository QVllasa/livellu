// store.js
import {atom} from 'jotai';
import Client from "@/framework/client";
import {Category, Entity} from "@/types";

// Atom für alle Kategorien
export const allCategoriesAtom = atom(
    async (get) => {

        const params = {
            filters: {
                isCategory: {
                    $eq: true
                }
            },
            populate: {
                child_categories: {populate: '*'},
                parent_categories: {populate: '*'},
                article_categories: {populate: '*'},
                image: {
                    populate: '*'
                },
            },
            pagination: {
                page: 1,
                pageSize: 1000 // This sets the limit to 10 objects
            }
        }

        const response = await Client.categories.get(params)
        return response.data.map((entity: Entity<Category>) => {
            const id = entity.id;
            const modifiedItem: Category = {
                ...entity.attributes,
                id: id
            };
            return modifiedItem;
        });
    }
);


// Atome für die Filterzustände
// atom für null und string
export const currentCategoryAtom = atom<null | any | Category>(null);
