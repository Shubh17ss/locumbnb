import React, { useState, useEffect } from 'react';
import { supabase } from '../../../utils/supabaseClient';

interface UploadedDocument {
  id: string;
  name: string;
  size: number;
  uploadDate: string;
  url: string;
}

interface DocumentUploadsData {
  cv: UploadedDocument | null;
  npdbReport: UploadedDocument | null;
  deaCertificate: UploadedDocument | null;
  boardCertificates: UploadedDocument[];
  otherDocuments: UploadedDocument[];
}

interface DocumentUploadsSectionProps {
  data: DocumentUploadsData | null;
  onUpdate: (data: DocumentUploadsData, isComplete: boolean) => void;
}

const DocumentUploadsSection: React.FC<DocumentUploadsSectionProps> = ({
  data,
  onUpdate,
}) => {
  const [documents, setDocuments] = useState<DocumentUploadsData>({
    cv: data?.cv || null,
    npdbReport: data?.npdbReport || null,
    deaCertificate: data?.deaCertificate || null,
    boardCertificates: data?.boardCertificates || [],
    otherDocuments: data?.otherDocuments || [],
  });

  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [dragOver, setDragOver] = useState<string | null>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const validateFile = (file: File, allowedTypes: string[]): string | null => {
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (file.size > maxSize) {
      return 'File size must be less than 10MB';
    }

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !allowedTypes.includes(fileExtension)) {
      return `Only ${allowedTypes.join(', ')} files are allowed`;
    }

    return null;
  };

  const handleFileUpload = async (
    file: File,
    documentType: keyof DocumentUploadsData,
    allowedTypes: string[]
  ) => {
    console.log('=== UPLOAD START ===');
    console.log('File:', file.name, 'Type:', documentType, 'Size:', file.size);
    
    const error = validateFile(file, allowedTypes);
    if (error) {
      console.error('Validation error:', error);
      alert(error);
      return;
    }

    setUploading((prev) => ({ ...prev, [documentType]: true }));

    try {
      // Get current user
      console.log('Getting user...');
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('Auth error:', userError);
        throw new Error(`Authentication error: ${userError.message}`);
      }
      
      if (!user) {
        console.error('No user found');
        throw new Error('User not authenticated. Please log in again.');
      }
      
      console.log('User authenticated:', user.id);

      // Create unique file path
      const timestamp = Date.now();
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${documentType}/${timestamp}_${file.name}`;
      
      console.log('Uploading to path:', fileName);

      // Upload to Supabase Storage with timeout
      const uploadPromise = supabase.storage
        .from('physician-documents')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      // Add 30 second timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Upload timeout - please try again')), 30000)
      );

      const { data: uploadData, error: uploadError } = await Promise.race([
        uploadPromise,
        timeoutPromise
      ]) as any;

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      console.log('Upload successful:', uploadData);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('physician-documents')
        .getPublicUrl(fileName);

      console.log('Public URL:', urlData.publicUrl);

      const uploadedDoc: UploadedDocument = {
        id: timestamp.toString(),
        name: file.name,
        size: file.size,
        uploadDate: new Date().toISOString(),
        url: urlData.publicUrl,
      };

      console.log('Updating local state...');

      if (documentType === 'boardCertificates' || documentType === 'otherDocuments') {
        setDocuments((prev) => ({
          ...prev,
          [documentType]: [...(prev[documentType] as UploadedDocument[]), uploadedDoc],
        }));
      } else {
        setDocuments((prev) => ({
          ...prev,
          [documentType]: uploadedDoc,
        }));
      }

      console.log('=== UPLOAD COMPLETE ===');
      alert(`${file.name} uploaded successfully!`);
      
    } catch (error: any) {
      console.error('=== UPLOAD FAILED ===');
      console.error('Error details:', error);
      alert(`Upload failed: ${error.message || 'Unknown error occurred'}`);
    } finally {
      setUploading((prev) => ({ ...prev, [documentType]: false }));
    }
  };

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    documentType: keyof DocumentUploadsData,
    allowedTypes: string[]
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file, documentType, allowedTypes);
    }
    e.target.value = '';
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    documentType: keyof DocumentUploadsData,
    allowedTypes: string[]
  ) => {
    e.preventDefault();
    setDragOver(null);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file, documentType, allowedTypes);
    }
  };

  const removeDocument = (
    documentType: keyof DocumentUploadsData,
    documentId?: string
  ) => {
    if (documentType === 'boardCertificates' || documentType === 'otherDocuments') {
      setDocuments((prev) => ({
        ...prev,
        [documentType]: prev[documentType].filter((doc) => doc.id !== documentId),
      }));
    } else {
      setDocuments((prev) => ({
        ...prev,
        [documentType]: null,
      }));
    }
  };

  const checkCompletion = (data: DocumentUploadsData): boolean => {
    // CV and NPDB Report are required
    return data.cv !== null && data.npdbReport !== null;
  };

  useEffect(() => {
    const isComplete = checkCompletion(documents);
    onUpdate(documents, isComplete);
  }, [documents]);

  const renderUploadArea = (
    documentType: keyof DocumentUploadsData,
    label: string,
    description: string,
    allowedTypes: string[],
    required: boolean = false,
    currentDoc: UploadedDocument | null = null
  ) => {
    const isUploading = uploading[documentType];
    const isDragOver = dragOver === documentType;

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <p className="text-xs text-gray-500 mb-2">{description}</p>

        {currentDoc ? (
          <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="ri-file-text-line text-green-600 text-xl"></i>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{currentDoc.name}</p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(currentDoc.size)} • Uploaded{' '}
                  {new Date(currentDoc.uploadDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <button
              onClick={() => removeDocument(documentType)}
              className="text-red-600 hover:text-red-700 text-sm font-medium whitespace-nowrap"
            >
              <i className="ri-delete-bin-line mr-1"></i>
              Remove
            </button>
          </div>
        ) : (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(documentType);
            }}
            onDragLeave={() => setDragOver(null)}
            onDrop={(e) => handleDrop(e, documentType, allowedTypes)}
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              isDragOver
                ? 'border-teal-500 bg-teal-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            {isUploading ? (
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                <p className="text-sm text-gray-600">Uploading...</p>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <i className="ri-upload-cloud-line text-gray-400 text-2xl"></i>
                </div>
                <p className="text-sm text-gray-700 mb-1">
                  Drag and drop your file here, or
                </p>
                <label className="inline-block px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors cursor-pointer whitespace-nowrap">
                  Browse Files
                  <input
                    type="file"
                    accept={allowedTypes.map((type) => `.${type}`).join(',')}
                    onChange={(e) => handleFileSelect(e, documentType, allowedTypes)}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  Accepted formats: {allowedTypes.join(', ').toUpperCase()} (Max 10MB)
                </p>
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderMultipleUploadArea = (
    documentType: 'boardCertificates' | 'otherDocuments',
    label: string,
    description: string,
    allowedTypes: string[],
    currentDocs: UploadedDocument[]
  ) => {
    const isUploading = uploading[documentType];
    const isDragOver = dragOver === documentType;

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
        <p className="text-xs text-gray-500 mb-2">{description}</p>

        {currentDocs && currentDocs.length > 0 && (
          <div className="space-y-2 mb-3">
            {currentDocs.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                    <i className="ri-file-text-line text-gray-600"></i>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(doc.size)}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeDocument(documentType, doc.id)}
                  className="text-red-600 hover:text-red-700 text-sm whitespace-nowrap"
                >
                  <i className="ri-close-line"></i>
                </button>
              </div>
            ))}
          </div>
        )}

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(documentType);
          }}
          onDragLeave={() => setDragOver(null)}
          onDrop={(e) => handleDrop(e, documentType, allowedTypes)}
          className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
            isDragOver
              ? 'border-teal-500 bg-teal-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          {isUploading ? (
            <div className="flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mr-3"></div>
              <p className="text-sm text-gray-600">Uploading...</p>
            </div>
          ) : (
            <>
              <i className="ri-upload-cloud-line text-gray-400 text-xl mb-2"></i>
              <p className="text-sm text-gray-700 mb-2">
                Drag and drop or{' '}
                <label className="text-teal-600 hover:text-teal-700 font-medium cursor-pointer whitespace-nowrap">
                  browse
                  <input
                    type="file"
                    accept={allowedTypes.map((type) => `.${type}`).join(',')}
                    onChange={(e) => handleFileSelect(e, documentType, allowedTypes)}
                    className="hidden"
                  />
                </label>
              </p>
              <p className="text-xs text-gray-500">
                {allowedTypes.join(', ').toUpperCase()} (Max 10MB)
              </p>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Document Uploads</h3>
        <p className="text-sm text-gray-600">
          Upload required credentials and supporting documents. All files are securely stored.
        </p>
      </div>

      <div className="space-y-6">
        {/* CV / Resume */}
        {renderUploadArea(
          'cv',
          'Curriculum Vitae (CV)',
          'Upload your most recent CV or resume',
          ['pdf', 'doc', 'docx'],
          true,
          documents.cv
        )}

        {/* NPDB Report */}
        {renderUploadArea(
          'npdbReport',
          'NPDB Report',
          'National Practitioner Data Bank report (self-query)',
          ['pdf'],
          true,
          documents.npdbReport
        )}

        {/* DEA Certificate */}
        {renderUploadArea(
          'deaCertificate',
          'DEA Certificate',
          'Drug Enforcement Administration certificate (if applicable)',
          ['pdf', 'jpg', 'jpeg', 'png'],
          false,
          documents.deaCertificate
        )}

        {/* Board Certificates */}
        {renderMultipleUploadArea(
          'boardCertificates',
          'Board Certificates',
          'Upload all relevant board certification documents',
          ['pdf', 'jpg', 'jpeg', 'png'],
          documents.boardCertificates
        )}

        {/* Other Documents */}
        {renderMultipleUploadArea(
          'otherDocuments',
          'Other Supporting Documents',
          'Additional credentials, certifications, or supporting materials',
          ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'],
          documents.otherDocuments
        )}
      </div>

      <div className="mt-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-xs text-gray-600">
          <i className="ri-lock-line mr-1"></i>
          All documents are encrypted and stored securely. Documents are transmitted to facilities only after you apply to an assignment.
        </p>
      </div>
    </div>
  );
};

export { DocumentUploadsSection };
export default DocumentUploadsSection;