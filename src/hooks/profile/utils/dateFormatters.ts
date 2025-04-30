
/**
 * Format date from DB to UI (YYYY-MM-DD to YYYY-MM)
 */
export const formatDateForUI = (dbDate: string | null): string => {
  if (!dbDate) return '';
  // Extract year and month only (YYYY-MM)
  return dbDate.substring(0, 7);
};

/**
 * Format date from UI to DB (YYYY-MM to YYYY-MM-DD)
 */
export const formatDateForDB = (partialDate: string | null): string | null => {
  if (!partialDate) return null;
  
  // If the date is already in YYYY-MM-DD format, return it as is
  if (/^\d{4}-\d{2}-\d{2}$/.test(partialDate)) return partialDate;
  
  // If the date is in YYYY-MM format, add '-01' to make it the first day of the month
  if (/^\d{4}-\d{2}$/.test(partialDate)) return `${partialDate}-01`;
  
  // Return null for invalid formats
  return null;
};
