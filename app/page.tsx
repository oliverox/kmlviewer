'use client';

import { UploadDropzone } from '@/utils/uploadthing';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const files: string | null =
    typeof localStorage !== 'undefined' ? localStorage.getItem('kmls') : null;
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <UploadDropzone
        content={{ label: 'Choose or drag and drop a KML file' }}
        endpoint="kmlUploader"
        onBeforeUploadBegin={(files) => {
          const f = files[0];
          console.log('f=', f);
          const [filename, extension] = f.name.split('.');
          console.log('filename=', filename);
          if (extension.toLowerCase() !== 'kml') {
            throw 'Invalid file uploaded';
          }
          return files;
        }}
        onClientUploadComplete={(res) => {
          console.log('Files: ', res);
          const item = `${res[0].name}:${res[0].key}`;
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem(
              'kmls',
              files ? files.concat(`,${item}`) : item
            );
          }
          router.push(`/kml/${res[0].key}`);
        }}
        onUploadError={(error: Error) => {
          alert(`ERROR! ${error.message}`);
        }}
      />
      <div className="w-full mt-10 border rounded-md grid grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        {!files && (
          <span className="col-span-4 text-center text-muted-foreground">
            You have no KML files uploaded yet.
          </span>
        )}
        {files &&
          files.split(',').map((file, index) => {
            const [filename, key] = file.split(':');
            return (
              <div key={index} className="text-center">
                <Link className="underline" href={`/kml/${key}`}>
                  {filename}
                </Link>
              </div>
            );
          })}
      </div>
    </main>
  );
}
