import { STRINGS } from '../Shared/Strings';
import { COLORS } from '../Shared/commonStyles';
import Car from '../assets/svgs/car.svg';
import Bill from '../assets/svgs/recurring bill.svg';
import Food from '../assets/svgs/restaurant.svg';
import Salary from '../assets/svgs/salary.svg';
import Shopping from '../assets/svgs/shopping bag.svg';

export const getMyColor = () => {
  const n = (Math.random() * 0xfffff * 1000000).toString(16);
  return `#${n.slice(0, 6)}`;
};

export function formatAMPM(date: Date) {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours %= 12;
  hours = hours || 12; // the hour '0' should be '12'
  return `${hours}:${minutes < 10 ? `0${minutes}` : minutes} ${ampm}`;
}

export const catIcons: {
  [key: string]: {
    icon: string;
    color: string;
  };
} = {
  food: { icon: Food, color: COLORS.RED[20] },
  salary: { icon: Salary, color: COLORS.GREEN[20] },
  transportation: { icon: Car, color: COLORS.BLUE[20] },
  shopping: { icon: Shopping, color: COLORS.YELLOW[20] },
  bill: { icon: Bill, color: COLORS.VIOLET[20] },
  subscription: { icon: Bill, color: COLORS.VIOLET[20] },
};

export const formatWithCommas = (num: string) => {
  const parts = num.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
};

export const MimeToExtension: { [key: string]: string } = {
  'application/pdf': 'pdf',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    'docx',
  'text/csv': 'csv',
  'application/vnd.ms-excel': 'xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'text/plain': 'txt',
};

export function FirebaseAuthErrorHandler(code: string) {
  if (code === 'auth/email-already-in-use') {
    return STRINGS.EmailAdressAlreadyUsed;
  }
  if (code === 'auth/invalid-credential') {
    return STRINGS.CredentialMalformed;
  }
  if (code === 'auth/network-request-failed') {
    return STRINGS.NetworkError;
  }
  if (code === 'auth/invalid-email') {
    return STRINGS.InvalidEmail;
  }
  return STRINGS.UnknownError;
}
