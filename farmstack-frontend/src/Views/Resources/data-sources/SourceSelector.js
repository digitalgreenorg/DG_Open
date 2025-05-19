import React, { useState } from 'react';
import S3Form from './S3Form';
import GoogleDriveForm from './GoogleDriveForm';
import DropboxForm from './DropboxForm';
import AzureBlobForm from './AzureBlobForm';
import styles from './SourceSelector.module.css';

const SourceSelector = ({ onSubmit }) => {
  const [selectedSource, setSelectedSource] = useState('');

  const handleSourceChange = (event) => {
    setSelectedSource(event.target.value);
  };

  const renderForm = () => {
    switch (selectedSource) {
      case 's3':
        return <S3Form onSubmit={onSubmit} />;
      case 'google_drive':
        return <GoogleDriveForm onSubmit={onSubmit} />;
      case 'dropbox':
        return <DropboxForm onSubmit={onSubmit} />;
      case 'azure_blob':
        return <AzureBlobForm onSubmit={onSubmit} />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <label>Select Source Type:</label>
      <select value={selectedSource} onChange={handleSourceChange} className={styles.select}>
        <option value="">--Select--</option>
        <option value="s3">S3</option>
        <option value="google_drive">Google Drive</option>
        <option value="dropbox">Dropbox</option>
        <option value="azure_blob">Azure Blob Storage</option>
      </select>

      {renderForm()}
    </div>
  );
};

export default SourceSelector;
