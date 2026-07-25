export function pickTranslation(item, lang = "tr") {
  if (!item?.translations?.length) return {};
  return (
    item.translations.find((t) => t.languageCode === lang) ??
    item.translations[0]
  );
}
