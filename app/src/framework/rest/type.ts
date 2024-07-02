import type {TypeQueryOptions} from '@/types';

export function useTypes(options?: Partial<TypeQueryOptions>) {
    const data: any= [];
    return {
        types: data
    };
}

export function useType() {
    const data = [][0];
    return {
        type: data
    };
}
