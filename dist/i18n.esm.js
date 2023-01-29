/// <reference path="../types/global.ts" />
/**
 * I18n class which loads all shopify locale files
 * and exposes a translate $t function
 */
class I18n {
    constructor(options) {
        this.locale = window.Shopify.locale || window.Shopify.Checkout?.normalizedLocale || options?.fallbackLocale || 'en';
        this.translations = this._loadTranslations();
        this.$t = this.$t.bind(this);
    }
    _loadTranslations() {
        const translations = {};
        const files = require.context('@shopify-directory/locales/', true, /(?<!schema)\.json$/);
        files.keys().forEach(key => {
            const locale = files(key);
            const name = key
                .replace(/^\.\//, '')
                .replace(/\.default/, '')
                .replace(/\.json$/, '');
            translations[name] = locale;
        });
        return translations;
    }
    $t(payload, replaces) {
        let result = this.translations[this.locale];
        let resultString;
        payload
            .split(/\.|\//g)
            .forEach(el => {
            if (typeof result !== 'string')
                result = result[el];
        });
        if (typeof result !== 'string')
            return undefined;
        resultString = result;
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

/// <reference path="../types/global.ts" />
const VuePlugin = {
    install(app, options) {
        console.log(options);
        const i18n = new I18n(options);
        app.config.globalProperties.$i18n = i18n;
        app.config.globalProperties.$t = i18n.$t;
    }
};

export { I18n, VuePlugin };
