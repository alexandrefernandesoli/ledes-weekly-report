import Image from 'next/image'
import loadingImage from '@/assets/three-dots.svg'
export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center p-12">
      <Image src={loadingImage} alt="loading" />
    </div>
  )
}
