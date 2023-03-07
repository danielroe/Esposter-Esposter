import { LanguageRegexSupportPatternMap } from "@/models/file/LanguageRegexSupportPatternMap";

export const getLanguageForFileUrl = (url: string) => {
  const filename = url.substring(url.lastIndexOf("/") + 1).toLowerCase();

  for (const [language, supportPattern] of Object.entries(LanguageRegexSupportPatternMap))
    if (filename.match(supportPattern)) return language;

  return null;
};
