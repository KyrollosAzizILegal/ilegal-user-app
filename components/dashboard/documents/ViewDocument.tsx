import React from "react";
import { Button, ScrollShadow } from "@heroui/react";

interface DocumentMetadata {
  content: string;
}

interface DocumentData {
  id: string;
  name: string;
  DocumentMetadata?: DocumentMetadata[];
}

interface DocumentError {
  message: string;
  status?: number;
}

interface DocumentViewerProps {
  documentData: DocumentData;
  documentLoading: boolean;
  documentError?: DocumentError | null;
  handleEdit: () => void;
  isValidated?: boolean;
}

export const ViewDocument: React.FC<DocumentViewerProps> = ({
  documentData,
  documentLoading,
  documentError,
  handleEdit,
  isValidated,
}) => {
  if (documentLoading) return <div>Loading...</div>;
  if (documentError)
    return <div>Error loading Document: {JSON.stringify(documentError)}</div>;

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          {documentData.name}
        </h2>
        {!isValidated && (
          <Button
            className="bg-gradient-to-r from-deepRed to-brightRed text-white py-2 px-4 rounded-lg shadow"
            onPress={handleEdit}
          >
            Edit Document
          </Button>
        )}
      </div>
      <div className="h-1 bg-gradient-to-r from-deepBlue to-lightBlue rounded-lg mb-6"></div>
      <ScrollShadow className="max-h-[calc(100vh-250px)]">
        <div className="text-gray-700 text-base leading-relaxed space-y-4 prose max-w-none">
          {documentData?.DocumentMetadata?.[0]?.content ? (
            <div
              dangerouslySetInnerHTML={{
                __html: documentData.DocumentMetadata[0].content,
              }}
            />
          ) : (
            <p>No content available</p>
          )}
        </div>
      </ScrollShadow>
    </div>
  );
};
