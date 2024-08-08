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
    
      return {
        fromName: responseJson.messages[0].From.Name,
        fromAddress: responseJson.messages[0].From.Address,
        toName: responseJson.messages[0].To[0].Name,
        toAddress: responseJson.messages[0].To[0].Address,
        subject: responseJson.messages[0].Subject,
        emailId: responseJson.messages[0].ID,
      }
    }
  
    /**
     * Retrieves the body content of the latest email as an HTML string.
     * @returns The HTML content of the latest email.
     */
    async getEmailBody(): Promise<string> {
      const response = await this.context.get('view/latest.html');
      const buffer = await response.body();
      const htmlString = buffer.toString('utf-8');
      return htmlString;
    }
  
    /**
     * Generates the full email content, combining headers and body.
     * @param email - The email address to fetch headers for.
     * @returns The full email content as a string.
     */
    async generateEmailContent(email: string): Promise<string> {
      const headers = await this.getEmailHeaders(email);
      const htmlTemplate = await this.getEmailBody();
      
      const headerSection = `
       <div style="font-family:arial; font-size:16px;" id="email-container">
        <p id="from"><strong>From:</strong> ${headers.fromName} &lt;${headers.fromAddress}&gt;</p>
        <p id="to"><strong>To:</strong> ${headers.toName} &lt;${headers.toAddress}&gt;</p>
        <p id="subject"><strong>Subject:</strong> ${headers.subject}</p>
      </div> 
    `;

      const emailContent = headerSection + htmlTemplate;
      return emailContent;
    }
  
    /**
     * Retrieves the plain text content of the latest email.
     * @returns The plain text content of the latest email.
     */
    async getRenderMessageTxt(): Promise<string> {
      const response = await this.context.get('view/latest.txt');
      const buffer = await response.body();
      const text = buffer.toString('utf-8');
      return text;
    }
  
    /**
     * Extracts the first URL found in the plain text content of the latest email.
     * @returns The first URL found in the email content.
     * @throws An error if no URL is found in the email content.
     */
    async getLinkFromMail(): Promise<string> {
      const textContent = await this.getRenderMessageTxt();
      const urlMatch = textContent.match(/https?:\/\/[^\s]+/);
      if (urlMatch && urlMatch.length > 0) {
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
     * Creates a new EmailApiContext instance with the appropriate configuration.
     * @returns A promise that resolves to an EmailApiContext instance.
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