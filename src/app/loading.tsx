import Image from 'next/image'
import loadingImage from '@/assets/three-dots.svg'
export default function Loading() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center">
      <Image src={loadingImage} alt="loading" />
    </div>
  )
}
