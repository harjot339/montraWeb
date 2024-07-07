import { useCallback, useState } from 'react';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import Onbarding1 from '../../assets/images/onboarding1.png';
import Onbarding2 from '../../assets/images/onboarding2.png';
import Onbarding3 from '../../assets/images/onboarding3.png';
import Google from '../../assets/svgs/google.svg';
import CustomInput from '../../Components/CustomInput';
import CustomButton from '../../Components/CustomButton';
import { COLORS, InputBorderColor } from '../../Shared/commonStyles';
import './styles.css';

export const OnboardData = [
  {
    icon: '../../assets/images/onboarding1.png',
    text1: 'Gain total control of your money',
    text2: 'Become your own money manager and make every cent count',
  },
  {
    icon: '../../assets/images/onboarding2.png',
    text1: 'Know where your money goes',
    text2:
      'Track your transactions easily with categories and financial report ',
  },
  {
    icon: '../../assets/images/onboarding3.png',
    text1: 'Planning ahead',
    text2: 'Setup your budget for each category so you are in control',
  },
];
function Login() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const image = useCallback((i: number) => {
    if (i === 0) {
      return Onbarding1;
    }
    if (i === 1) {
      return Onbarding2;
    }
    return Onbarding3;
  }, []);
  return (
    <div className="flex bg-white rounded-2xl">
      <div className="w-1/2 py-8 px-14 border" id="leftCtr">
        <Carousel
          autoPlay
          showArrows={false}
          showThumbs={false}
          showStatus={false}
          infiniteLoop
          showIndicators={false}
          interval={3000}
        >
          {OnboardData.map((item, i) => (
            <div key={item.text1}>
              <img src={image(i)} alt="" />
              <p className="text-lg md:text-2xl lg:text-4xl">{item.text1}</p>
              <p className="text-md md:text-lg lg:text-xl  mb-20">
                {item.text2}
              </p>
            </div>
          ))}
        </Carousel>
      </div>
      <div className=" w-11/12 m-auto md:w-1/2 py-8 px-5 max-w- md:px-20 sm flex flex-col text-center">
        <p className="text-2xl md:text-2xl lg:text-4xl mb-16">Login</p>
        <CustomInput
          placeholderText="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <div className="my-2" />
        <CustomInput
          placeholderText="Password"
          value={pass}
          onChange={(e) => {
            setPass(e.target.value);
          }}
        />
        <div className="my-2" />
        <CustomButton title="Login" onPress={() => {}} />
        <div className="my-1.5" />
        <p className="text-sm md:text-xl text-gray-500 font-bold">Or With</p>
        <div className="my-1.5" />
        <CustomButton
          component={<img alt="" src={Google} width="26vw" />}
          backgroundColor={COLORS.LIGHT[100]}
          textColor={COLORS.DARK[100]}
          borderWidth={1}
          borderColor={InputBorderColor}
          title="Login With Google"
          onPress={() => {}}
        />
        <p className="text-sm md:text-xl font-bold">
          Do not have an Account <a className="underline">Signup</a>
        </p>
        <div className="my-1.5" />
      </div>
    </div>
  );
}

export default Login;
