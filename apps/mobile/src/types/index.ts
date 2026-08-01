// Automation types
export interface CitaPreviaDetails {
  nie: string;
  Name: string;
  nationality: number;
  documentType?: 'nie' | 'dni' | 'passport';
}
