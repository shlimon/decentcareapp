class PDFCacheManager {
  constructor(maxSize = 10) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  get(url) {
    return this.cache.get(url);
  }

  set(url, pdfDoc) {
    // If cache is full, remove oldest entry
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
      console.log('🗑️ Removed oldest PDF from cache');
    }
    this.cache.set(url, pdfDoc);
    console.log(`📦 Cached PDF (${this.cache.size}/${this.maxSize})`);
  }

  has(url) {
    return this.cache.has(url);
  }

  clear() {
    this.cache.clear();
    console.log('🗑️ Cache cleared');
  }

  getSize() {
    return this.cache.size;
  }
}

export const pdfCacheManager = new PDFCacheManager(10);
