export const stringToDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(Number);
    // Il mese in JS parte da 0 (Gennaio = 0, Marzo = 2)
    return new Date(year, month - 1, day);
};

export const dateToString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

/**
 * Formats a date string (YYYY-MM-DD) or Date object as "martedì 16 febbraio 2026"
 */
export const formatDateLong = (value: string | Date): string => {
    const date = typeof value === 'string' ? stringToDate(value.slice(0, 10)) : value;
    return date.toLocaleDateString('it-IT', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
};