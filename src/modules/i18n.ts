/// <reference path="../types/global.ts" />

/**
 * I18n class which loads all shopify locale files
 * and exposes a translate $t function
 */
export class I18n {
  readonly translations: AllTranslations
  readonly locale: string

  constructor (options?: I18nOptions) {
    this.locale = window.Shopify.locale || options?.fallbackLocale || 'en'
    this.translations = this._loadTranslations()
    this.$t = this.$t.bind(this)
  }

  private _loadTranslations () {
    const translations: AllTranslations = {}
    const files = require.context('@shopify-directory/locales/', true, /(?<!schema)\.json$/)

    files.keys().forEach(key => {
      const locale = files(key)

      const name = key
        .replace(/^\.\//, '')
        .replace(/\.default/, '')
        .replace(/\.json$/, '')

      translations[name] = locale
    })

    return translations
  }

  $t (payload: string, replaces: TranslationReplaces): string | undefined {
    let result: string | Translations = this.translations[this.locale]
    let resultString: string
  
    payload
      .split(/\.|\//g)
      .forEach(el => {
        if (typeof result !== 'string') result = result[el]
      })

    if (typeof result !== 'string') return undefined;
      
    resultString = result
    for (const find in replaces) {
      if (Object.hasOwnProperty.call(replaces, find)) {
        const replace = replaces[find];
        const findLiquid = `{{ ${find} }}`;

        resultString = resultString.replaceAll(findLiquid, replace);
      }
    }

    return resultString;
  }
}