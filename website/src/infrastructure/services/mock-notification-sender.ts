import type { INotificationSender } from "@/application/ports";

export class MockNotificationSender implements INotificationSender {
  readonly sent: { recipient: string; subject: string; body: string }[] = [];

  async send(recipient: string, subject: string, body: string): Promise<void> {
    this.sent.push({ recipient, subject, body });
  }
}
