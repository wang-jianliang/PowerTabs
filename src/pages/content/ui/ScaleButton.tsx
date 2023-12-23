import { Button, ButtonProps } from '@chakra-ui/react';
import { useState } from 'react';

interface ScaleButtonProps extends ButtonProps {
  children?: React.ReactNode;
}

function ScaleButton({ children, ...props }: ScaleButtonProps) {
  const [isHover, setIsHover] = useState(false);

  return (
    <Button
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      transition="all 0.2s ease"
      transform={isHover ? 'scale(1.5)' : 'scale(1)'}
      zIndex={isHover ? '1' : '0'}
      position={isHover ? 'relative' : 'static'}
      {...props}>
      {children}
    </Button>
  );
}

export default ScaleButton;
