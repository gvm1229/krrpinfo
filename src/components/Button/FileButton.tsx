import { Download } from 'lucide-react';
import React from 'react';

interface FileButtonProps {
  className?: string;
  title: string;
  fileData: {
    src: string;
    filename: string;
    extension: string;
  };
  width?: string;
  isDownloadDecorationExist?: boolean;
  titleAlign?: string;
  titleTextColor?: string;
  titleFontSize?: string;
  titleFontWeight?: string;
}

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
}: FileButtonProps) => {
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
      id="fileDownloadBtn"
      aria-label="file-download-button"
      onClick={handleDownload}
      className={`${className} ${width}`}
    >
      <h1 className={`uppercase ${titleAlign} ${titleTextColor} ${titleFontSize} ${titleFontWeight}`}>{title}</h1>
      {isDownloadDecorationExist && (
        <div className="flex items-center gap-3">
          <p className="text-center text-base font-normal text-gray-600">Download</p>
          <Download />
        </div>
      )}
    </button>
  );
};

export default FileButton;
