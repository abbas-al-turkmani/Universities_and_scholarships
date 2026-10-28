import { applications } from "@/infrastructure/mock-data";

export const documents = applications.flatMap((application, applicationIndex) =>
  application.documents.map((document, documentIndex) => ({
    id: `document-${String(applicationIndex + 1).padStart(3, "0")}-${documentIndex + 1}`,
    applicationId: application.id,
    ...document,
  })),
);
