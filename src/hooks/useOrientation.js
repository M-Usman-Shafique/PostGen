import {useEffect, useState} from 'react';
import {useWindowDimensions} from 'react-native';

export const useOrientation = () => {
  const {width: windowWidth, height: windowHeight} = useWindowDimensions();
  const [isLandscape, setIsLandscape] = useState(windowWidth > windowHeight);

  useEffect(() => {
    setIsLandscape(windowWidth > windowHeight);
  }, [windowWidth, windowHeight]);

  const isPortrait = !isLandscape;

  return {isLandscape, isPortrait};
};
