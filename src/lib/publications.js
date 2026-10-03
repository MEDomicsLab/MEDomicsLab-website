export const hasPublicationLink = (publication) => {
  const link = publication?.link?.trim();
  return Boolean(link) && link !== "#" && link.toUpperCase() !== "NA";
};
