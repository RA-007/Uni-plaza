import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { fileUploadService } from '../services/fileUpload';
import styles from '../ClubDashboard.module.css';

const FileUpload = ({ 
  label, 
  files, 
  onFilesChange, 
  accept = 'image/*',
  multiple = true,
  folder = 'club-ads'
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);

  const uploadFiles = async (newFiles) => {
    setUploading(true);
    try {
      const uploadResults = await fileUploadService.uploadFiles(newFiles, folder);
      console.log('Upload results:', uploadResults);
      
      // Extract file paths from upload results
      const uploadedFilePaths = uploadResults.map(result => result.filePath);
      
      // Combine existing files with new uploaded file paths
      const allFiles = [...files, ...uploadedFilePaths];
      onFilesChange(allFiles);
    } catch (error) {
      console.error('Error uploading files:', error);
      Swal.fire({
        icon: 'error',
        title: 'Upload Failed',
        text: 'Error uploading files. Please try again.',
        confirmButtonColor: '#3085d6'
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0) {
      if (multiple) {
        await uploadFiles(selectedFiles);
      } else {
        await uploadFiles([selectedFiles[0]]);
      }
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      if (multiple) {
        await uploadFiles(droppedFiles);
      } else {
        await uploadFiles([droppedFiles[0]]);
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removeFile = async (index) => {
    const fileToRemove = files[index];
    
    // If it's a file path (string), try to delete from server
    if (typeof fileToRemove === 'string') {
      try {
        await fileUploadService.deleteFile(fileToRemove);
      } catch (error) {
        console.error('Error deleting file from server:', error);
      }
    }
    
    const newFiles = files.filter((_, i) => i !== index);
    onFilesChange(newFiles);
  };

  const getFilePreview = (file) => {
    if (typeof file === 'string') {
      // It's a file path from server - construct full URL
      const fullUrl = fileUploadService.getFileUrl(file);
      console.log('File preview URL:', fullUrl);
      return fullUrl;
    } else if (file && file.type && file.type.startsWith('image/')) {
      // It's a File object - create blob URL for preview
      return URL.createObjectURL(file);
    }
    return null;
  };

  const getFileName = (file) => {
    if (typeof file === 'string') {
      // Extract filename from path
      return file.split('/').pop() || file;
    } else if (file && file.name) {
      return file.name;
    }
    return 'Unknown file';
  };

  return (
    <div className={styles.formGroup}>
      <label className={styles.label}>{label}</label>
      <div
        className={`${styles.fileUpload} ${dragOver ? styles.dragOver : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !uploading && document.getElementById(`file-input-${label}`).click()}
      >
        <div className={styles.fileUploadText}>
          {uploading 
            ? 'Uploading files...'
            : files.length === 0 
              ? `Click or drag to upload ${label.toLowerCase()}`
              : `Click or drag to add more ${label.toLowerCase()}`
          }
        </div>
        <input
          id={`file-input-${label}`}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          disabled={uploading}
        />
      </div>
      
      {files.length > 0 && (
        <div className={styles.fileList}>
          <div className={styles.imagePreview}>
            {files.map((file, index) => (
              <div key={index} className={styles.imageItem}>
                {getFilePreview(file) ? (
                  <img
                    src={getFilePreview(file)}
                    alt={getFileName(file)}
                    className={styles.imagePreviewImg}
                    onError={(e) => {
                      console.error('Image failed to load:', getFilePreview(file));
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className={styles.imagePreviewImg} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    background: '#f5f5f5',
                    fontSize: '0.7rem',
                    textAlign: 'center',
                    padding: '4px'
                  }}>
                    {getFileName(file)}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className={styles.removeImageButton}
                  disabled={uploading}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {uploading && (
        <div style={{ 
          marginTop: '8px', 
          color: '#1976d2', 
          fontSize: '0.9rem',
          fontWeight: '500'
        }}>
          Uploading files, please wait...
        </div>
      )}
    </div>
  );
};

export default FileUpload;
