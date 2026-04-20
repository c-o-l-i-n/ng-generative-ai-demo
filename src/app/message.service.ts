import { computed, inject, Injectable, signal } from '@angular/core';
import { filter, map, Observable, startWith } from 'rxjs';
import {
  HttpClient,
  HttpDownloadProgressEvent,
  HttpEvent,
  HttpEventType,
  HttpResponse,
} from '@angular/common/http';

export interface Message {
  id: string;
  text: string;
  fromUser: boolean;
  generating?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private readonly http = inject(HttpClient);

  private readonly completeMessages = signal<Message[]>([]);
  private readonly incomingMessage = signal<Message | null>(null);

  readonly messages = computed(() => {
    const incomingMessage = this.incomingMessage();
    return incomingMessage
      ? [...this.completeMessages(), incomingMessage]
      : this.completeMessages();
  });

  readonly generatingInProgress = computed(
    () => this.incomingMessage() !== null,
  );

  sendMessage(prompt: string): void {
    this.completeMessages.update((msgs) => [
      ...msgs,
      { id: window.crypto.randomUUID(), text: prompt, fromUser: true },
    ]);

    this.getChatResponseStream(prompt).subscribe({
      next: (message) => this.incomingMessage.set(message),

      complete: () => {
        const completedMessage = this.incomingMessage();
        if (completedMessage) {
          this.completeMessages.update((messages) => [
            ...messages,
            { ...completedMessage, generating: false },
          ]);
        }
        this.incomingMessage.set(null);
      },

      error: () => this.incomingMessage.set(null),
    });
  }

  private getChatResponseStream(prompt: string): Observable<Message> {
    const id = window.crypto.randomUUID();

    return this.http
      .post('http://localhost:3000/message', prompt, {
        responseType: 'text',
        observe: 'events',
        reportProgress: true,
      })
      .pipe(
        filter(
          (event: HttpEvent<string>): boolean =>
            event.type === HttpEventType.DownloadProgress ||
            event.type === HttpEventType.Response,
        ),
        map(
          (event: HttpEvent<string>): Message =>
            event.type === HttpEventType.DownloadProgress
              ? {
                  id,
                  text: (event as HttpDownloadProgressEvent).partialText!,
                  fromUser: false,
                  generating: true,
                }
              : {
                  id,
                  text: (event as HttpResponse<string>).body!,
                  fromUser: false,
                  generating: false,
                },
        ),
        startWith<Message>({
          id,
          text: '',
          fromUser: false,
          generating: true,
        }),
      );
  }
}
