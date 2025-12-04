import { pdfjs } from "react-pdf";
import workerSrc from "pdfjs-dist/build/pdf.worker.min.js?url";

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

if (import.meta.env.DEV) {
  console.log("[react-pdf] pdfjs version:", pdfjs.version);
}
