// Calculate global row number for table
export const getGlobalRowNumber = (
  displayPage: number,
  pageSize: number,
  index: number
): number => {
  return (displayPage - 1) * pageSize + index + 1;
};
