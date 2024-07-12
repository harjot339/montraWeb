import React, { useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import Onbarding1 from '../../assets/images/onboarding1.png';
import Onbarding2 from '../../assets/images/onboarding2.png';
import Onbarding3 from '../../assets/images/onboarding3.png';
import Login from '../Login';
import Signup from '../Signup';
import { OnboardData } from '../../Shared/Strings';
import Forgotpassword from '../ForgotPassword/Forgotpassword';

function AuthLayout() {
  const image = useCallback((i: number) => {
    if (i === 0) {
      return Onbarding1;
    }
    if (i === 1) {
      return Onbarding2;
    }
    return Onbarding3;
  }, []);
  const loc = useLocation();
  return (
    <div className="flex justify-center bg-white rounded-2xl w-11/12 py-5">
      <div className="w-1/2 px-10 hidden sm:block self-center" id="leftCtr">
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
              <img src={image(i)} alt="" style={{ maxWidth: '450px' }} />
              <p className="text-2xl md:text-3xl lg:text-4xl font-semibold">
                {item.text1}
              </p>
              <p className="text-xl md:text-lg lg:text-xl font-medium mt-4 md:mb-10">
                {item.text2}
              </p>
            </div>
          ))}
        </Carousel>
      </div>
      {loc.pathname === '/login' && <Login />}
      {loc.pathname === '/signup' && <Signup />}
      {loc.pathname === '/forgot-password' && <Forgotpassword />}
    </div>
    // </Alert>
  );
}

export default React.memo(AuthLayout);
