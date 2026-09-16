import { randomUUID } from "crypto";
import { DocumentTag } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getMembership } from "@/lib/orgs";

export class DocumentUploadError extends Error {}

export const DOCUMENT_TAG_LABELS: Record<DocumentTag, string> = {
  GOVERNING_DOCUMENT: "Governing document",
  PAST_FILING: "Past filing",
  POLICY: "Policy",
  MINUTES: "Minutes",
  OTHER: "Other",
};

export async function createOrVersionDocument({
  organisationId,
  uploadedByUserId,
  tag,
  file,
  groupId,
}: {
  organisationId: string;
  uploadedByUserId: string;
  tag: DocumentTag;
  file: File;
  groupId?: string | null;
}) {
  let resolvedGroupId = groupId ?? null;
  let nextVersion = 1;

  if (resolvedGroupId) {
    const existing = await prisma.document.findFirst({
      where: { groupId: resolvedGroupId, organisationId },
      orderBy: { version: "desc" },
    });
    if (!existing) {
      throw new DocumentUploadError("That document group was not found for this organisation.");
    }
    nextVersion = existing.version + 1;
  } else {
    resolvedGroupId = randomUUID();
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  return prisma.document.create({
    data: {
      organisationId,
      uploadedByUserId,
      groupId: resolvedGroupId,
      version: nextVersion,
      filename: file.name,
      mimeType: file.type || "application/octet-stream",
      sizeBytes: file.size,
      tag,
      content: buffer,
    },
  });
}

export async function listDocumentGroups(organisationId: string) {
  const documents = await prisma.document.findMany({
    where: { organisationId },
    orderBy: [{ groupId: "asc" }, { version: "desc" }],
    include: { uploadedBy: true },
  });

  const groups = new Map<string, typeof documents>();
  for (const doc of documents) {
    const existing = groups.get(doc.groupId);
    if (existing) existing.push(doc);
    else groups.set(doc.groupId, [doc]);
  }

  return Array.from(groups.values())
    .map((versions) => ({ latest: versions[0], versions }))
    .sort((a, b) => b.latest.createdAt.getTime() - a.latest.createdAt.getTime());
}

export async function getLatestDocumentInGroup(organisationId: string, groupId: string) {
  return prisma.document.findFirst({
    where: { organisationId, groupId },
    orderBy: { version: "desc" },
  });
}

export async function findLatestDocumentByFilename(organisationId: string, filename: string) {
  return prisma.document.findFirst({
    where: { organisationId, filename },
    orderBy: { version: "desc" },
  });
}

export async function getDocumentForUser(userId: string, documentId: string) {
  const document = await prisma.document.findUnique({ where: { id: documentId } });
  if (!document) return null;

  const membership = await getMembership(userId, document.organisationId);
  if (!membership) return null;

  return document;
}
