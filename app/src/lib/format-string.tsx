export function formatString(count: number | null | undefined, string: string) {
    if (!count) return `${count} ${string}`;
    return count > 1 ? `${count} ${string}s` : `${count} ${string}`;
}


export const capitalizeFirstLetter = (s: string) => {
    if (!s) return "";
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}
