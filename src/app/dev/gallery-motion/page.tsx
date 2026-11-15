import { notFound } from 'next/navigation';
import { ImmersiveGallery } from '@/components/home/ImmersiveGallery';

export default function GalleryMotionPrototype() {
  if (process.env.NODE_ENV !== 'development') notFound();

  return <main className="cleanicall"><ImmersiveGallery preview /></main>;
}
