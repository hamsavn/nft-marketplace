export const getFileUrl = (fileName: string) => {
  if (!fileName || fileName.startsWith('http') || fileName.startsWith('blob:')) {
    return fileName || 'https://storage.googleapis.com/opensea-static/opensea-profile/18.png';
  }

  return `${process.env.STATIC_FILES}/${fileName}`;
};
