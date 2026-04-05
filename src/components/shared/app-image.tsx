import Image, { type ImageLoaderProps, type ImageProps } from 'next/image';

type AppImageProps = Omit<ImageProps, 'alt' | 'src'> & {
  alt: string;
  src?: ImageProps['src'];
};

function passthroughLoader({ src }: ImageLoaderProps) {
  return src;
}

export function AppImage({
  alt,
  loader,
  sizes,
  src,
  unoptimized,
  ...props
}: AppImageProps) {
  if (!src) {
    return null;
  }

  const isRemoteSource =
    typeof src === 'string' &&
    (src.startsWith('http://') || src.startsWith('https://'));

  return (
    <Image
      {...props}
      alt={alt}
      src={src}
      loader={loader ?? passthroughLoader}
      sizes={sizes ?? (props.fill ? '100vw' : undefined)}
      unoptimized={unoptimized ?? isRemoteSource}
    />
  );
}
