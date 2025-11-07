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

function getIconPath(fileType) {
  const type = fileType?.toUpperCase();
  const supportedTypes = [
    'PDF',
    'JPG',
    'JPEG',
    'PNG',
    'MP4',
    'FIG',
    'AEP',
    'MP3',
    'DOCX',
  ];

  if (supportedTypes.includes(type)) {
    return `/img/icons/${type.toLowerCase()}.svg`;
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
  getIconPath,
};
