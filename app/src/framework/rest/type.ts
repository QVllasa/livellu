import type {TypeQueryOptions} from '@/types';
import {TYPES} from "@/db/types";

export function useTypes(options?: Partial<TypeQueryOptions>) {
    const data: any= JSON.parse(TYPES);
    return {
        types: data
    };
}

export function useType() {
    const data = JSON.parse(TYPES)[0];
    return {
        type: data
    };
}
