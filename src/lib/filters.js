import { normalizeName } from "./team";

export const toggleFilter = (selected, value, optionCount) => {
  const next = selected.includes(value)
    ? selected.filter((item) => item !== value)
    : [...selected, value];
  return next.length === optionCount ? [] : next;
};

export const searchTerms = (query) => normalizeName(query).split(" ").filter(Boolean);

export const matchesTerms = (text, terms) => {
  if (!terms.length) return true;
  const haystack = normalizeName(text);
  return terms.every((term) => haystack.includes(term));
};
