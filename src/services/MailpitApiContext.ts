import { request, APIRequestContext } from '@playwright/test';

type HTTPHeaders = Record<string, string>;

export interface Email {
  fromName: string;
  fromAddress: string;
  toName: string;
  toAddress: string;
  subject: string;
  emailId: string;
}

export class MailpitApiContext {
  public context: APIRequestContext;

  constructor(context: APIRequestContext) {
    this.context = context;
  }

  /**
   * Fetches email headers based on the recipient's email address.
   * @param email - The email address of the recipient.
   * @returns An Email object containing the email headers.
   */
  async getEmailHeaders(email: string): Promise<Email> {
    const response = await this.context.get('/api/v1/search', {
      params: {
        kind: 'To.Address',
        query: email,
      },
    });

    const responseJson = await response.json();
    const message = responseJson.messages[0];

    return {
      fromName: message.From.Name,
      fromAddress: message.From.Address,
      toName: message.To[0].Name,
      toAddress: message.To[0].Address,
      subject: message.Subject,
      emailId: message.ID,
    };
  }

  /**
   * Retrieves the body content of the email as an HTML string.
   * @param email - The email address of the recipient.
   * @returns A promise that resolves to the HTML content of the email.
   */
  async getEmailBody(email: string): Promise<string> {
    const emailId = (await this.getEmailHeaders(email)).emailId;
    const response = await this.context.get(`view/${emailId}.html`);
    const buffer = await response.body();
    return buffer.toString('utf-8');
  }

  /**
   * Generates the full email content, combining headers and body.
   * @param email - The email address to fetch headers for.
   * @returns A promise that resolves to the full email content as a string.
   */
  async generateEmailContent(email: string): Promise<string> {
    const headers = await this.getEmailHeaders(email);
    const htmlTemplate = await this.getEmailBody(email);

    const headerSection = `
       <div style="font-family:arial; font-size:16px;" id="email-container">
        <p id="from"><strong>From:</strong> ${headers.fromName} &lt;${headers.fromAddress}&gt;</p>
        <p id="to"><strong>To:</strong> ${headers.toName} &lt;${headers.toAddress}&gt;</p>
        <p id="subject"><strong>Subject:</strong> ${headers.subject}</p>
      </div> 
    `;

    return headerSection + htmlTemplate;
  }

  /**
   * Retrieves the plain text content of the email.
   * @param email - The email address of the recipient.
   * @returns A promise that resolves to the plain text content of the email.
   */
  async getRenderMessageTxt(email: string): Promise<string> {
    const emailId = (await this.getEmailHeaders(email)).emailId;
    const response = await this.context.get(`view/${emailId}.txt`);
    const buffer = await response.body();
    return buffer.toString('utf-8');
  }

  /**
   * Extracts the first URL found in the plain text content of the latest email.
   * @param email - The email address of the recipient.
   * @returns A promise that resolves to the first URL found in the email content.
   * @throws An error if no URL is found in the email content.
   */
  async getLinkFromMail(email: string): Promise<string> {
    const textContent = await this.getRenderMessageTxt(email);
    const urlMatch = textContent.match(/https?:\/\/[^\s]+/);
    if (urlMatch) {
      return urlMatch[0];
    }
    throw new Error('No URL found in the email content');
  }

  /**
   * Deletes a specific email by ID if provided, or deletes all emails if no ID is provided.
   * @param emailId - The ID of the email to delete (optional).
   */
  async deleteMail(emailId?: string): Promise<void> {
    const data = emailId ? { IDs: [emailId] } : {};
    await this.context.delete(`api/v1/messages`, { data });
  }

  /**
   * Creates a new MailpitApiContext instance with the appropriate configuration.
   * @param baseURL - The base URL for the API.
   * @returns A promise that resolves to a MailpitApiContext instance.
   */
  public static async create(baseURL: string): Promise<MailpitApiContext> {
    const extraHTTPHeaders: HTTPHeaders = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };

    const context = await request.newContext({
      baseURL,
      ignoreHTTPSErrors: true,
      extraHTTPHeaders,
    });
    return new MailpitApiContext(context);
  }
}
