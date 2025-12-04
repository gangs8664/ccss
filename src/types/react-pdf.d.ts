declare module "react-pdf" {
  import type { ComponentType, ReactNode } from "react";

  export const pdfjs: {
    GlobalWorkerOptions: {
      workerSrc: string;
    };
  };

  export interface DocumentProps {
    file:
      | string
      | File
      | Blob
      | ArrayBuffer
      | Uint8Array
      | { url?: string; data?: ArrayBuffer | Uint8Array };
    onLoadSuccess?: (info: { numPages: number }) => void;
    onLoadError?: (error: unknown) => void;
    loading?: ReactNode;
    children?: ReactNode;
  }

  export const Document: ComponentType<DocumentProps>;

  export interface PageProps {
    pageNumber: number;
    width?: number;
    className?: string;
  }

  export const Page: ComponentType<PageProps>;
}

declare module "pdfjs-dist/build/pdf" {
  export const GlobalWorkerOptions: {
    workerSrc: string;
  };
}

declare module "pdfjs-dist/build/pdf.mjs" {
  export const GlobalWorkerOptions: {
    workerSrc: string;
  };
}

declare module "pdfjs-dist/build/pdf.worker.min.js?worker" {
  const worker: string;
  export default worker;
}

declare module "pdfjs-dist/build/pdf.worker.min.js?url" {
  const workerSrc: string;
  export default workerSrc;
}
