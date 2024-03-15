import { Download } from 'lucide-react';
import React from 'react';

const FileButton = ({
  className = 'px-6 py-4 bg-white shadow-md flex justify-between items-center group transition hover:bg-gray-50 hover:scale-105',
  title,
  fileData,
  width = 'w-64',
  isDownloadDecorationExist = true,
  titleAlign = 'text-left',
  titleTextColor = 'text-gray-900',
  titleFontSize = 'text-lg',
  titleFontWeight = 'font-semibold',
}) => {
  const handleDownload = () => {
    // Perform any necessary logic here

    // Specify the name and extension the file will be downloaded (overwrites the original)
    const fileName = fileData?.filename;
    const fileExtension = fileData?.extension;

    // Create a temporary link element
    const link = document.createElement('a');
    link.href = fileData?.src;
    // Specify the file name with the abbreviated extension
    link.download = `${fileName}.${fileExtension}`;

    // Programmatically click the link to trigger the download
    link.click();
  };

  return (
    <button
      name="fileDownloadBtn"
      onClick={handleDownload}
      className={`${className} ${width}`}
    >
      <h1 className={`uppercase ${titleAlign} ${titleTextColor} ${titleFontSize} ${titleFontWeight}`}>{title}</h1>
      {isDownloadDecorationExist && (
        <div className="flex items-center gap-3">
          <h3 className="text-center text-base font-normal text-gray-600">Download</h3>
          <Download />
        </div>
      )}
    </button>
  );
};

export default FileButton;
