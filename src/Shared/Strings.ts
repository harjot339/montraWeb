import { LocalisedStrings } from '../localization';
import { COLORS } from './commonStyles';

export const initialExpenseCategories = [
  { name: 'add', color: '' },
  { name: 'food', color: COLORS.RED[100] },
  { name: 'bills', color: COLORS.VIOLET[100] },
  { name: 'shopping', color: COLORS.YELLOW[100] },
  { name: 'subscription', color: '#fc803d' },
  { name: 'transportation', color: COLORS.BLUE[100] },
];
export const initialIncomeCategories = [
  { name: 'add', color: '' },
  { name: 'salary', color: COLORS.GREEN[100] },
  { name: 'passive income', color: '#f531d7' },
];

export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const nameRegex = /^[a-zA-Z ]*$/;
export const passRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d\s])[A-Za-z\d\W\s]{8,}$/;

export const STRINGS = LocalisedStrings;

export const OnboardData = (STRING: typeof STRINGS) => [
  {
    icon: '../../assets/images/onboarding1.png',
    text1: STRING.OnboardText1,
    text2: STRING.OnboardSubText1,
  },
  {
    icon: '../../assets/images/onboarding2.png',
    text1: STRING.OnboardText2,
    text2: STRING.OnboardSubText2,
  },
  {
    icon: '../../assets/images/onboarding3.png',
    text1: STRING.OnboardText3,
    text2: STRING.OnboardSubText3,
  },
];

export const monthData = (STRING: typeof LocalisedStrings) => [
  { label: STRING.January, value: 1 },
  { label: STRING.February, value: 2 },
  { label: STRING.March, value: 3 },
  { label: STRING.April, value: 4 },
  { label: STRING.May, value: 5 },
  { label: STRING.June, value: 6 },
  { label: STRING.July, value: 7 },
  { label: STRING.August, value: 8 },
  { label: STRING.September, value: 9 },
  { label: STRING.October, value: 10 },
  { label: STRING.November, value: 11 },
  { label: STRING.December, value: 12 },
];
export const weekData = (STRING: typeof LocalisedStrings) => [
  { label: STRING.Sunday, value: 0 },
  { label: STRING.Monday, value: 1 },
  { label: STRING.Tuesday, value: 2 },
  { label: STRING.Wednesday, value: 3 },
  { label: STRING.Thursday, value: 4 },
  { label: STRING.Friday, value: 5 },
  { label: STRING.Saturday, value: 6 },
];

export const FreqDropdownData = (STRING: typeof LocalisedStrings) => [
  { label: STRING.Yearly, value: 'yearly' },
  { label: STRING.Monthly, value: 'monthly' },
  { label: STRING.Weekly, value: 'weekly' },
  { label: STRING.Daily, value: 'daily' },
];
export const EndDropdownData = (STRING: typeof LocalisedStrings) => [
  { label: STRING?.never ?? 'Never', value: 'never' },
  { label: STRING?.date ?? 'Date', value: 'date' },
];

export const currencies: {
  [key: string]: { name: string; symbol: string; code: string };
} = {
  USD: { name: 'United States Dollar', symbol: '$', code: 'USD' },
  EUR: { name: 'Euro', symbol: '€', code: 'EUR' },
  GBP: { name: 'British Pound Sterling', symbol: '£', code: 'GBP' },
  JPY: { name: 'Japanese Yen', symbol: '¥', code: 'JPY' },
  CHF: { name: 'Swiss Franc', symbol: 'CHF', code: 'CHF' },
  CAD: { name: 'Canadian Dollar', symbol: 'C$', code: 'CAD' },
  AUD: { name: 'Australian Dollar', symbol: 'A$', code: 'AUD' },
  NZD: { name: 'New Zealand Dollar', symbol: 'NZ$', code: 'NZD' },
  CNY: { name: 'Chinese Yuan', symbol: '¥', code: 'CNY' },
  INR: { name: 'Indian Rupee', symbol: '₹', code: 'INR' },
  RUB: { name: 'Russian Ruble', symbol: '₽', code: 'RUB' },
  BRL: { name: 'Brazilian Real', symbol: 'R$', code: 'BRL' },
  ZAR: { name: 'South African Rand', symbol: 'R', code: 'ZAR' },
  MXN: { name: 'Mexican Peso', symbol: 'Mex$', code: 'MXN' },
  SGD: { name: 'Singapore Dollar', symbol: 'S$', code: 'SGD' },
  HKD: { name: 'Hong Kong Dollar', symbol: 'HK$', code: 'HKD' },
  SEK: { name: 'Swedish Krona', symbol: 'kr', code: 'SEK' },
  NOK: { name: 'Norwegian Krone', symbol: 'kr', code: 'NOK' },
  DKK: { name: 'Danish Krone', symbol: 'kr', code: 'DKK' },
  KRW: { name: 'South Korean Won', symbol: '₩', code: 'KRW' },
};

export const languages = {
  'en-US': { locale: 'en-US', language: 'English (United States)' },
  'es-ES': { locale: 'es-ES', language: 'Español (España)' },
  // 'fr-FR': {locale: 'fr-FR', language: 'Français (France)'},
  'ja-JP': { locale: 'ja-JP', language: '日本語 (日本)' },
  // 'ru-RU': {locale: 'ru-RU', language: 'Русский (Россия)'},
  'hi-IN': { locale: 'hi-IN', language: 'हिन्दी (भारत)' },
  // 'ar-SA': {locale: 'ar-SA', language: 'العربية (السعودية)'},
};
