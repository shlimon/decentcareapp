const allowedExtensions = [
  'pdf',
  'jpg',
  'jpeg',
  'png',
  'mp4',
  'fig',
  'aep',
  'mp3',
  'docx',
];

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Maps file extensions to their corresponding icon filenames in /public/icons/
const iconFileMap = {
  PDF: 'pdf',
  JPG: 'jpg',
  JPEG: 'jpg',   // jpeg shares the jpg icon
  PNG: 'jpg',    // png shares the jpg icon
  WEBP: 'webp',
  MP4: 'mp4',
  FIG: 'fig',
  AEP: 'aep',
  MP3: 'mp3',
  DOCX: 'docx',
};

function getIconPath(fileType) {
  const type = fileType?.toUpperCase();
  const iconFile = iconFileMap[type];

  if (iconFile) {
    return `/icons/${iconFile}.svg`;
  }
}

function getDocumentName(path) {
  if (!path) return '';
  const parts = path.split('/');
  return parts[parts.length - 1];
}

const checkImageFile = (file) => {
  if (!file) return false;
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
  const extension = `.${file.name.split('.').pop()?.toLowerCase()}`;
  return imageExtensions.includes(extension);
};

export {
  allowedExtensions,
  checkImageFile,
  formatFileSize,
  getDocumentName,
  getIconPath
};
