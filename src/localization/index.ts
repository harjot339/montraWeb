import LocalizedStrings from 'react-localization';
import * as EN_STRINGS from './langFiles/en.json';
import * as JP_STRINGS from './langFiles/jp.json';
import * as ES_STRINGS from './langFiles/es.json';
import * as HI_STRINGS from './langFiles/hi.json';

export const LocalisedStrings = new LocalizedStrings({
  'en-US': EN_STRINGS,
  'ja-JP': JP_STRINGS,
  'es-ES': ES_STRINGS,
  'hi-IN': HI_STRINGS,
});

export const convertCatLang = (
  STRING: typeof LocalisedStrings,
  category: string
) => {
  if (category === 'passive income') {
    return STRING.passiveIncome;
  }
  return (
    STRING?.[category] ?? category[0].toLocaleUpperCase() + category.slice(1)
  );
};

export const convertNotificationText = (
  STRING: typeof LocalisedStrings,
  category: string,
  type: 1 | 2,
  percentage?: number
) => {
  if (type === 1) {
    if (percentage) {
      if (LocalisedStrings.getLanguage() === 'ja-JP') {
        return `${convertCatLang(
          STRING,
          category.toLowerCase()
        )}予算の${percentage}%を超えました`;
      }
      if (LocalisedStrings.getLanguage() === 'es-ES') {
        return `Se ha superado el ${percentage}% del presupuesto de ${convertCatLang(
          STRING,
          category.toLowerCase()
        )}`;
      }
      if (LocalisedStrings.getLanguage() === 'hi-IN') {
        return `${convertCatLang(
          STRING,
          category.toLowerCase()
        )} के बजट का ${percentage}% पार कर गया`;
      }
      return `Exceeded ${percentage}% of ${convertCatLang(
        STRING,
        category.toLowerCase()
      )} budget`;
    }
    if (LocalisedStrings.getLanguage() === 'ja-JP') {
      return `${convertCatLang(
        STRING,
        category.toLowerCase()
      )}予算の制限を超えました`;
    }
    if (LocalisedStrings.getLanguage() === 'es-ES') {
      return `Límite del presupuesto de ${convertCatLang(
        STRING,
        category.toLowerCase()
      )} superado`;
    }
    if (LocalisedStrings.getLanguage() === 'hi-IN') {
      return `${convertCatLang(
        STRING,
        category.toLowerCase()
      )} बजट सीमा पार कर गई`;
    }
    return `${convertCatLang(
      STRING,
      category.toLowerCase()
    )} Budget Limit Exceeded`;
  }
  if (type === 2) {
    if (percentage) {
      if (LocalisedStrings.getLanguage() === 'ja-JP') {
        return `${convertCatLang(
          STRING,
          category.toLowerCase()
        )}予算の${percentage}%を超えました。軌道に乗るために対策を講じてください。`;
      }
      if (LocalisedStrings.getLanguage() === 'es-ES') {
        return `Has superado el ${percentage}% de tu presupuesto de ${convertCatLang(
          STRING,
          category.toLowerCase()
        )}. Toma medidas para mantenerte en el camino.`;
      }
      if (LocalisedStrings.getLanguage() === 'hi-IN') {
        return `${convertCatLang(
          STRING,
          category.toLowerCase()
        )} के बजट का ${percentage}% पार कर गया। ट्रैक पर बने रहने के लिए कार्रवाई करें।`;
      }
      return `You've exceeded ${percentage}% of your ${convertCatLang(
        STRING,
        category.toLowerCase()
      )} budget. Take action to stay on track.`;
    }
    if (LocalisedStrings.getLanguage() === 'ja-JP') {
      return `${convertCatLang(
        STRING,
        category.toLowerCase()
      )}予算が限度を超えました`;
    }
    if (LocalisedStrings.getLanguage() === 'es-ES') {
      return `Tu presupuesto de ${convertCatLang(
        STRING,
        category.toLowerCase()
      )} ha superado el límite`;
    }
    if (LocalisedStrings.getLanguage() === 'hi-IN') {
      return `${convertCatLang(
        STRING,
        category.toLowerCase()
      )} का बजट सीमा पार कर गया है`;
    }
    return `Your ${convertCatLang(
      STRING,
      category.toLowerCase()
    )} budget has exceeded the limit`;
  }
  return '';
};

export const convertLastNdaysText = (
  STRING: typeof LocalisedStrings,
  n: string | number
) => {
  return `${STRING.Last} ${n} ${STRING.Days}`;
};
