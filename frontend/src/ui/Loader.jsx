import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function Loader () {
  return (
    <div className='min-h-screen overflow-y-hidden'>
    <DotLottieReact
      src="https://lottie.host/6c0708c5-4122-40c0-a6f7-a8cf22c79c50/d8BdrzAfhS.lottie"
      loop
      autoplay
    />
    </div>
  );
};
