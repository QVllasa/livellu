import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const arrangePathSegments = (pathSegments: string[]) => {
  const categorySegment = pathSegments.find(el => el.includes('category-')) || null;
  const materialSegment = pathSegments.find(el => el.includes('material-')) || null;
  const colorSegment = pathSegments.find(el => el.includes('color-')) || null;
  const brandSegment = pathSegments.find(el => el.includes('brand-')) || null;

  //hardcoded order of filters for the static pages later
  const newSegments = [categorySegment, materialSegment, colorSegment, brandSegment];

  // Filter out null values and any existing segments that are not part of the predefined list
  const filteredSegments = newSegments.filter(Boolean).concat(pathSegments.filter(el => !newSegments.includes(el)));

  return filteredSegments
};
