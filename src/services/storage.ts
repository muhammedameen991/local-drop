// In-memory / temporary chunk store for incoming files

interface FileAssembly {
  name: string;
  size: number;
  mimeType: string;
  totalChunks: number;
  chunks: ArrayBuffer[];
  receivedBytes: number;
}

class StorageManager {
  private activeAssemblies = new Map<string, FileAssembly>();

  public initAssembly(id: string, name: string, size: number, mimeType: string, totalChunks: number) {
    this.activeAssemblies.set(id, {
      name,
      size,
      mimeType: mimeType || 'application/octet-stream',
      totalChunks,
      chunks: new Array(totalChunks),
      receivedBytes: 0,
    });
  }

  public addChunk(id: string, index: number, chunk: ArrayBuffer): { progress: number; isComplete: boolean } {
    const assembly = this.activeAssemblies.get(id);
    if (!assembly) {
      throw new Error(`Assembly for file ${id} not found.`);
    }

    if (!assembly.chunks[index]) {
      assembly.chunks[index] = chunk;
      assembly.receivedBytes += chunk.byteLength;
    }

    const isComplete = assembly.receivedBytes >= assembly.size || 
      (assembly.chunks.filter(Boolean).length === assembly.totalChunks);

    const progress = Math.min(100, (assembly.receivedBytes / assembly.size) * 100);

    return { progress, isComplete };
  }

  public finalizeAssembly(id: string): { blob: Blob; url: string; name: string } {
    const assembly = this.activeAssemblies.get(id);
    if (!assembly) {
      throw new Error(`Assembly for file ${id} not found.`);
    }

    // Filter valid chunks
    const validChunks = assembly.chunks.filter(Boolean);
    const blob = new Blob(validChunks, { type: assembly.mimeType });
    const url = URL.createObjectURL(blob);
    const name = this.sanitizeFileName(assembly.name);

    // Keep assembly temporarily or clean up
    this.activeAssemblies.delete(id);

    return { blob, url, name };
  }

  public cancelAssembly(id: string) {
    this.activeAssemblies.delete(id);
  }

  public sanitizeFileName(name: string): string {
    // Prevent directory traversal and malicious characters
    const clean = name.replace(/[/\\?%*:|"<>]/g, '_').trim();
    return clean || 'downloaded-file';
  }

  public downloadBlob(url: string, filename: string) {
    const a = document.createElement('a');
    a.href = url;
    a.download = this.sanitizeFileName(filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}

export const storageManager = new StorageManager();
