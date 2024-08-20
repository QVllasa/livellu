import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"
import {HeightItem} from "@/components/filters/height-filter";
import {DepthItem} from "@/components/filters/depth-filter";
import {WidthItem} from "@/components/filters/width-filter";
import {capitalize} from "lodash";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const unslugify = (text: string) => {
  return text
      .split('-') // Split the string by hyphens
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
      .join(' '); // Join them back together with spaces
};


export const formatHeightLabel = (label: string): string => {
  // Remove the "cm-hoehe" or "cm hoehe" suffix
  label = label.replace(/cm-hoehe|cm hoehe|cm-hoehe/i, " cm");

  // Handle ranges separated by a dash
  const parts = label.split('-');
  if (parts.length === 2) {
    return `${parts[0].trim()} - ${parts[1].trim()}`;
  }

  // Default case if none of the above apply
  return label;
};

export const sortHeights = (heights: HeightItem[]): HeightItem[] => {
  return heights.sort((a, b) => {
    const getNumericValue = (label: string): number => {
      if (label.toLowerCase().includes('unter')) {
        return -1; // "unter" should be first
      }
      if (label.toLowerCase().includes('ueber')) {
        return Infinity; // "über" should be last
      }
      const matches = label.match(/(\d+)/);
      return matches ? parseInt(matches[0], 10) : 0;
    };

    return getNumericValue(a.label) - getNumericValue(b.label);
  });
};

// Utility function to format depth values
export const formatDepthLabel = (label: string): string => {
  // Remove the "cm-tiefe" or "cm tiefe" suffix
  label = label.replace(/cm-tiefe|cm tiefe|cm-tiefe/i, " cm");

  // Handle ranges separated by a dash
  const parts = label.split('-');
  if (parts.length === 2) {
    return `${parts[0].trim()} - ${parts[1].trim()} `;
  }

  // Default case if none of the above apply
  return label;
};

// Function to sort depth labels
export const sortDepths = (depths: DepthItem[]): DepthItem[] => {
  return depths.sort((a, b) => {
    const getNumericValue = (label: string): number => {
      if (label.toLowerCase().includes('unter')) {
        return -1; // "unter" should be first
      }
      if (label.toLowerCase().includes('ueber')) {
        return Infinity; // "über" should be last
      }
      const matches = label.match(/(\d+)/);
      return matches ? parseInt(matches[0], 10) : 0;
    };

    return getNumericValue(a.label) - getNumericValue(b.label);
  });
};


// Utility function to format width values
export const formatWidthLabel = (label: string): string => {

  if (label === 'einheitsgröße') return capitalize(label)

  // Remove the "cm-breite" or "cm breite" suffix
  label = label.replace(/cm-breite|cm breite|cm-breite/i, "cm");

  // Handle ranges separated by a dash
  const parts = label.split('-');
  if (parts.length === 2) {
    return `${parts[0].trim()} - ${parts[1].trim()} `;
  }

  // Default case if none of the above apply
  return label;
};

// Function to sort width labels
export const sortWidths = (widths: WidthItem[]): WidthItem[] => {
  return widths.sort((a, b) => {
    const getNumericValue = (label: string): number => {
      if (label.toLowerCase().includes('unter')) {
        return -1; // "unter" should be first
      }
      if (label.toLowerCase().includes('ueber')) {
        return Infinity; // "über" should be last
      }
      const matches = label.match(/(\d+)/);
      return matches ? parseInt(matches[0], 10) : 0;
    };

    return getNumericValue(a.label) - getNumericValue(b.label);
  });
};


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
