export const useTranslations = () => {
  const t = (_key, fallback) => fallback ?? _key;
  return { t };
};
