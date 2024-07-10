import { emailRegex, nameRegex, STRINGS } from './Strings';

export function testInput(re: RegExp, str: string): boolean {
  return re.test(str);
}
const style = {
  error: {
    color: 'rgb(255,51,51)',
    fontSize: 12,
    paddingLeft: 12,
    paddingTop: 3,
    // justifyContent:"flex-end",
    alignSelf: 'flex-start',
    height: 25,
  },
};
export function EmailValError({
  email,
  formKey,
}: Readonly<{
  email: string;
  formKey: boolean;
}>) {
  if (!!email && !testInput(emailRegex, email)) {
    return <p style={style.error}>{STRINGS.EmailIsNotValid}</p>;
  }
  if (email === '' && formKey) {
    return <p style={style.error}>{STRINGS.EmailCannotBeEmpty}</p>;
  }
  return <div style={{ height: '25px' }} />;
}
export function NameValError({
  name,
  formKey,
}: Readonly<{
  name: string;
  formKey: boolean;
}>) {
  if (!!name.trim() && !testInput(nameRegex, name.trim())) {
    return <p style={style.error}>{STRINGS.NameIsNotValid}</p>;
  }
  if (name.trim() === '' && formKey) {
    return <p style={style.error}>{STRINGS.NameCannotBeEmpty}</p>;
  }
  return <div style={{ height: '25px' }} />;
}
export function PassValidationError({
  pass,
  formKey,
}: Readonly<{ pass: string; formKey: boolean }>) {
  if (!!pass && pass.length < 6) {
    return <p style={style.error}>{STRINGS.PasswordNotValid}</p>;
  }
  if (pass.trim() === '' && formKey) {
    return <p style={style.error}>{STRINGS.PasswordCannotBeEmpty}</p>;
  }
  return <div style={{ height: '25px' }} />;
}

export function ConfirmPassError({
  pass,
  confirmPass,
  formKey,
}: Readonly<{
  pass: string;
  confirmPass: string;
  formKey: boolean;
}>) {
  if (confirmPass !== '' && confirmPass !== pass) {
    return <p style={style.error}>{STRINGS.PasswordDoNotMatch}</p>;
  }
  if (confirmPass === '' && formKey) {
    return <p style={style.error}>{STRINGS.ConfirmPasswordCannotBeEmpty}</p>;
  }
  return <div style={{ height: '25px' }} />;
}

export function EmailEmptyError({
  email,
  formKey,
}: Readonly<{
  email: string;
  formKey: boolean;
}>) {
  return email === '' && formKey ? (
    <p style={style.error}>{STRINGS.EmailCannotBeEmpty}</p>
  ) : (
    <div style={{ height: '25px' }} />
  );
}

export function PassEmptyError({
  pass,
  formKey,
}: Readonly<{
  pass: string;
  formKey: boolean;
}>) {
  return pass.trim() === '' && formKey ? (
    <p style={style.error}>{STRINGS.PasswordCannotBeEmpty}</p>
  ) : (
    <div style={{ height: '25px' }} />
  );
}

export function EmptyZeroError({
  value,
  formKey,
  errorText,
}: Readonly<{
  value: string;
  formKey: boolean;
  errorText: string;
}>) {
  return (value === '' || Number(value) <= 0 || value.trim() === '.') &&
    formKey ? (
    <p
      className="pl-4 sm:pl-8"
      style={{
        color: 'white',
        fontSize: '28px',
        alignSelf: 'flex-start',
      }}
    >
      {errorText}
    </p>
  ) : (
    <div style={{ height: '25px' }} />
  );
}

export function EmptyError({
  value,
  formKey,
  errorText,
}: Readonly<{
  value: string;
  formKey: boolean;
  errorText: string;
  color?: string;
  size?: number;
}>) {
  return value === '' && formKey ? (
    <p style={style.error}>{errorText}</p>
  ) : (
    <div style={{ height: '25px' }} />
  );
}

export function CompundEmptyError({
  value1,
  value2,
  formKey,
  errorText,
}: Readonly<{
  value1: string;
  value2: string;
  formKey: boolean;
  errorText: string;
  color?: string;
  size?: number;
}>) {
  return (value1 === '' || value2 === '') && formKey ? (
    <p style={style.error}>{errorText}</p>
  ) : (
    <div style={{ height: '25px' }} />
  );
}
