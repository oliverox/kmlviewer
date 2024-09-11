'use client';

import { UploadDropzone } from '@/utils/uploadthing';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <UploadDropzone
        endpoint="kmlUploader"
        onBeforeUploadBegin={(files) => {
          const f = files[0];
          console.log('f=', f);
          const [filename, extension] = f.name.split('.');
          console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> filename=', filename);
          if (extension.toLowerCase() !== 'kml') {
            throw "Invalid file uploaded";
          }
          return files;
        }}
        onClientUploadComplete={(res) => {
          // Do something with the response
          console.log('Files: ', res);
          router.push(`/kml/${res[0].key}`);
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);
        }}
      />
    </main>
  );
}
