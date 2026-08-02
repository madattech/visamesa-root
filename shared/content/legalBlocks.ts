export type LegalBlock =
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }
  | {
      type: 'pLink';
      before: string;
      linkText: string;
      linkHref: string;
      after?: string;
    }
  | { type: 'privacyLink'; before: string; after: string }
  | { type: 'email'; label: string; email: string };

export type LegalDocumentId = 'privacy' | 'terms';
