interface Window {
  Shopify: {
    locale: string
  }
}

interface I18nOptions {
  fallbackLocale?: string
}

interface Translations {
  [key: string]: {} | string
}

interface AllTranslations {
  [key: string]: Translations
}

interface TranslationReplaces {
  [key: string]: string
}