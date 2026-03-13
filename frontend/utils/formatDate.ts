export const stringToDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(Number);
    // Il mese in JS parte da 0 (Gennaio = 0, Marzo = 2)
    return new Date(year, month - 1, day);
};