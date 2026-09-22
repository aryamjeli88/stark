import React from "react";

interface StarkLogoProps {
  className?: string;
  variant?: "full" | "icon";
  inverted?: boolean;
  alt?: string;
}

export const StarkLogo: React.FC<StarkLogoProps> = ({
  className = "h-11",
  variant = "full",
  alt = "STARK - Smart Tank Assessment & Risk Keeper"
}) => {
  const isIcon = variant === "icon";
  const src = isIcon ? "/STARK-ICON.jpeg" : "/STARK LOGO.jpeg";

  return (
    <img
      src={src}
      alt={alt}
      className={`${className} w-auto object-contain select-none flex-shrink-0`}
      loading="eager"
      decoding="async"
    />
  );
};

export default StarkLogo;
