import i18n from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import { initReactI18next } from "react-i18next"
import en from "./en"
import km from "./km"

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { en: { translation: en }, km: { translation: km } },
    supportedLngs: ["km", "en"],
    fallbackLng: "km",
    detection: { order: ["localStorage"], lookupLocalStorage: "lang", caches: ["localStorage"] },
    interpolation: { escapeValue: false },
  })

const syncDocument = () => {
  document.documentElement.lang = i18n.resolvedLanguage ?? "km"
  document.title = i18n.t("meta.title")
}
i18n.on("languageChanged", syncDocument)
syncDocument()

export default i18n
