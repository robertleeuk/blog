'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ExternalImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  fallback?: string;
}

const DEFAULT_FALLBACK = '/images/placeholder.svg';

export default function ExternalImage({
  src,
  alt,
  width = 800,
  height = 400,
  priority = false,
  className = '',
  fallback = DEFAULT_FALLBACK,
}: ExternalImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  
  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallback);
    }
  };
  
  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      loading={priority ? undefined : 'lazy'}
      className={className}
      onError={handleError}
      unoptimized
    />
  );
}
