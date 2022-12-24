import JSZip from "jszip";

declare namespace JSZip {
  interface Utils {
    getBinaryContent(
      path: string,
      callback: (err: Error, data: any) => void
    ): void;
  }
}

export = getBinaryContent;
