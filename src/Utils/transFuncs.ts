import { DocumentData } from 'firebase/firestore';
import { TransactionType } from '../Defs/transaction';
import { decrypt } from './encryption';

export default function TransFromJson(
  json: DocumentData,
  uid: string
): TransactionType {
  return {
    amount: Number(decrypt(json.amount, uid) ?? json.amount),
    category: decrypt(json.category, uid) ?? json.category,
    desc: decrypt(json.desc, uid) ?? json.desc,
    wallet: decrypt(json.wallet, uid) ?? json.wallet,
    attachement: decrypt(json.attachement, uid),
    repeat: json.repeat,
    freq: json.freq
      ? {
          freq: decrypt(json.freq.freq, uid) as
            | 'yearly'
            | 'monthly'
            | 'weekly'
            | 'daily',
          month: Number(decrypt(String(json.freq.month), uid)),
          day: Number(decrypt(String(json.freq.day), uid)),
          weekDay: Number(decrypt(String(json.freq.weekDay), uid)),
          end: decrypt(json.freq.end, uid) as 'date' | 'never',
          date: json.freq.date,
        }
      : null,
    id: json.id,
    timeStamp: json.timeStamp,
    type: decrypt(json.type, uid) ?? json.type,
    attachementType: decrypt(json.attachementType, uid) ?? json.attachementType,
    from: decrypt(json.from, uid) ?? json.from ?? '',
    to: decrypt(json.to, uid) ?? json.to ?? '',
    deleted: json.deleted ?? false,
  };
}
