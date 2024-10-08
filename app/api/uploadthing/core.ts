import { createUploadthing, type FileRouter } from 'uploadthing/server';
import { UploadThingError } from 'uploadthing/server';

const f = createUploadthing();

const auth = async (req: Request) => {
  console.log(req.body);
  return { id: 'fakeId' }; // Fake auth function
};

// FileRouter for your app, can contain multiple FileRoutes
export const kmlFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  kmlUploader: f({
    // 'application/vnd.google-earth.kml+xml': { maxFileSize: '4MB', minFileCount: 1, maxFileCount: 1,  } 
    'blob': { maxFileSize: '128MB', minFileCount: 1, maxFileCount: 1,  },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const user = await auth(req);

      // If you throw, the user will not be able to upload
      if (!user) throw new UploadThingError('Unauthorized');

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log('Upload complete for userId:', metadata.userId);

      console.log('file url', file.url);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type KmlFileRouter = typeof kmlFileRouter;
