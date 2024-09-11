import Link from 'next/link';
import { Map } from '@/components/map';
import { Button } from '@/components/ui/button';

export default function KmlPage({ params }: { params: { id: string } }) {
  console.log(`https://utfs.io/f/${params.id}`);
  if (!params.id) {
    return (
      <div>
        <span>Sorry, you are trying to load an invalid KML file</span>
        <Link href="/" className="underline">
          Upload again
        </Link>
      </div>
    );
  }
  return (
    <div className="w-full h-screen">
      <div className="h-8 flex items-center p-4 m-4">
        <Button asChild>
          <Link href="/" className="hover:underline">
            Home
          </Link>
        </Button>
      </div>
      <Map id={params.id} />
    </div>
  );
}
