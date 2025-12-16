/**
 * Supported calendar locales using BCP 47 language tags.
 * Use these values when configuring CalendarConfigProvider.
 *
 * @example
 * ```tsx
 * <CalendarConfigProvider
 *   locale={CalendarLocale.EN_US}
 *   methods={CalendarMethodsMoment}
 * >
 *   {children}
 * </CalendarConfigProvider>
 * ```
 */
export enum CalendarLocale {
  // English variants
  EN_US = 'en-US',
  EN_AU = 'en-AU',
  EN_CA = 'en-CA',
  EN_GB = 'en-GB',
  EN_IE = 'en-IE',
  EN_IN = 'en-IN',
  EN_NZ = 'en-NZ',
  EN_SG = 'en-SG',

  // Chinese variants
  ZH_CN = 'zh-CN',
  ZH_TW = 'zh-TW',
  ZH_HK = 'zh-HK',

  // Spanish variants
  ES_ES = 'es-ES',
  ES_MX = 'es-MX',
  ES_DO = 'es-DO',
  ES_PR = 'es-PR',
  ES_US = 'es-US',

  // Portuguese variants
  PT_PT = 'pt-PT',
  PT_BR = 'pt-BR',

  // French variants
  FR_FR = 'fr-FR',
  FR_CA = 'fr-CA',
  FR_CH = 'fr-CH',

  // German variants
  DE_DE = 'de-DE',
  DE_AT = 'de-AT',
  DE_CH = 'de-CH',

  // Italian variants
  IT_IT = 'it-IT',
  IT_CH = 'it-CH',

  // Dutch variants
  NL_NL = 'nl-NL',
  NL_BE = 'nl-BE',

  // Swedish variants
  SV_SE = 'sv-SE',
  SV_FI = 'sv-FI',

  // Norwegian
  NB_NO = 'nb-NO',

  // Other European languages
  PL_PL = 'pl-PL',
  CS_CZ = 'cs-CZ',
  SK_SK = 'sk-SK',
  HU_HU = 'hu-HU',
  RO_RO = 'ro-RO',
  DA_DK = 'da-DK',
  FI_FI = 'fi-FI',
  EL_GR = 'el-GR',
  TR_TR = 'tr-TR',
  UK_UA = 'uk-UA',
  RU_RU = 'ru-RU',
  BG_BG = 'bg-BG',
  HR_HR = 'hr-HR',
  SL_SI = 'sl-SI',
  ET_EE = 'et-EE',
  LV_LV = 'lv-LV',
  LT_LT = 'lt-LT',
  BE_BY = 'be-BY',

  // Asian languages
  JA_JP = 'ja-JP',
  KO_KR = 'ko-KR',
  VI_VN = 'vi-VN',
  TH_TH = 'th-TH',
  ID_ID = 'id-ID',
  MS_MY = 'ms-MY',
  BN_BD = 'bn-BD',
  BN_IN = 'bn-IN',
  HI_IN = 'hi-IN',
  TA_IN = 'ta-IN',
  TE_IN = 'te-IN',
  KN_IN = 'kn-IN',
  ML_IN = 'ml-IN',

  // Middle East
  AR_SA = 'ar-SA',
  AR_AE = 'ar-AE',
  HE_IL = 'he-IL',
  FA_IR = 'fa-IR',

  // Other regions
  AF_ZA = 'af-ZA',
  CA_ES = 'ca-ES',
  EU_ES = 'eu-ES',
  GL_ES = 'gl-ES',
  IS_IS = 'is-IS',
}

/**
 * Type for locale values - can be either the enum value or the string literal
 */
export type CalendarLocaleValue = CalendarLocale | `${CalendarLocale}`;

/**
 * Normalize locale to lowercase for internal use
 * @internal
 */
export function normalizeLocale(locale: CalendarLocaleValue): string {
  return locale.toLowerCase();
}
