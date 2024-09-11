import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";
 
import type { KmlFileRouter } from "@/app/api/uploadthing/core";
 
export const UploadButton = generateUploadButton<KmlFileRouter>();
export const UploadDropzone = generateUploadDropzone<KmlFileRouter>();