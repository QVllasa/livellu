// utils/fetchCategorys.js
import Client from "@/framework/client";
import {Category} from "@/types";


export async function fetchCategoryBySlug(slug: string): Promise<Category | null> {
    if (!slug) return Promise.resolve(null);
    const params = {
        filters: {
            slug: {
                $eq: slug
            }
        },
        populate: {
            child_categories: {
                populate:
                    {
                        child_categories: {
                            populate:
                                {
                                    child_categories: {populate: '*'},
                                    parent_categories: {populate: "*"},
                                }
                        },
                        parent_categories: {
                            populate:
                                {
                                    child_categories: {populate: '*'},
                                    parent_categories: {populate: "*"},
                                }
                        },
                    }
            },
            parent_categories: {
                populate:
                    {
                        child_categories: {
                            populate:
                                {
                                    child_categories: {populate: '*'},
                                    parent_categories: {populate: "*"},
                                }
                        },
                        parent_categories: {
                            populate:
                                {
                                    child_categories: {populate: '*'},
                                    parent_categories: {populate: "*"},
                                }
                        },
                    }
            },
        }
    };

    return await fetchCategory(params)
}

export async function fetchCategories(params: any) {

    const response = await Client.categories.all(params);
    const allCategories = response.data.map((entity) => {
        const id = entity.id;
        const modifiedItem = {
            ...entity.attributes,
            id: id,
        };
        return modifiedItem;
    });


    return allCategories;
}

export async function fetchAllCategories() {
    const params = {
        filters: {
            isCategory: {$eq: true},
        },
        populate: {
            child_categories: {
                populate:
                    {
                        child_categories: {
                            populate:
                                {
                                    child_categories: {populate: '*'},
                                    parent_categories: {populate: "*"},
                                }
                        },
                        parent_categories: {
                            populate:
                                {
                                    child_categories: {populate: '*'},
                                    parent_categories: {populate: "*"},
                                }
                        },
                    }
            },
            parent_categories: {
                populate:
                    {
                        child_categories: {
                            populate:
                                {
                                    child_categories: {populate: '*'},
                                    parent_categories: {populate: "*"},
                                }
                        },
                        parent_categories: {
                            populate:
                                {
                                    child_categories: {populate: '*'},
                                    parent_categories: {populate: "*"},
                                }
                        },
                    }
            },
        }
    };

    return fetchCategories(params);
}

export async function fetchCategory(params) {

    const response = await Client.categories.get(params);
    console.log("response category: ", response.data);
    const category = response.data.map((entity) => {
        const id = entity.id;
        const modifiedItem = {
            ...entity.attributes,
            id: id,
        };
        return modifiedItem;
    });


    return category[0];
}
