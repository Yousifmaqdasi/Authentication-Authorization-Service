export const getExpiry = (ms: number) => {
  return new Date(Date.now() + ms);
};
