export default async function createFileWriter(
    extName: string,
  ): Promise<FileSystemWritableFileStream> {
    const fileHandle = await window.showSaveFilePicker({
      suggestedName: `WebAV-export-${Date.now()}.${extName}`,
    });
    return fileHandle.createWritable();
  }