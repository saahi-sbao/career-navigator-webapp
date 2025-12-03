import Image from 'next/image';

export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      <Image
        src="https://storage.googleapis.com/project-spark-3c51e.appspot.com/generated/v81dkbn3g0l2t75t707a3l9j1/image_0.png"
        alt="Career Guidance AI System Logo"
        width={50}
        height={50}
        className="rounded-full"
      />
    </div>
  );
}
