export interface EmailArgs {
  to: string;
  subject: string;
  body: string;
}
export interface EmailService {
  send(args: EmailArgs): Promise<void>;
}
