import { notFound } from 'next/navigation';
import { CarouselPrototype } from './CarouselPrototype';

export default function CarouselV2Page() {
  if (process.env.NODE_ENV !== 'development') notFound();

  return <main><CarouselPrototype /></main>;
}
