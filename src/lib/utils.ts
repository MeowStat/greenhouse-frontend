import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const displayComparison = (symbol: string) => {
  switch (symbol) {
    case '>': return '>';
    case '<': return '<';
    case '>=': return '≥';
    case '<=': return '≤';
    case '!=': return '≠';
    case '==': return '=';
    default: return symbol;
  }
};
