import { inject, Injectable, signal } from '@angular/core';
import { concat, filter, map, Observable, of, scan } from 'rxjs';
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

interface MessageChunk {
  text: string;
  generating: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private readonly http = inject(HttpClient);

  private readonly _completeMessages = signal<Message[]>([]);
  private readonly _messages = signal<Message[]>([]);
  private readonly _generatingInProgress = signal<boolean>(false);

  readonly messages = this._messages.asReadonly();
  readonly generatingInProgress = this._generatingInProgress.asReadonly();

  sendMessage(text: string): void {
    this._generatingInProgress.set(true);

    this._completeMessages.set([
      ...this._completeMessages(),
      { id: crypto.randomUUID(), text, fromUser: true },
    ]);
    this._messages.set(this._completeMessages());

    this.getChatResponseStream(text).subscribe({
      next: (inProgressMessage) => {
        this._messages.set([...this._completeMessages(), inProgressMessage]);
      },
      complete: () => {
        this._completeMessages.set(this._messages());
        this._generatingInProgress.set(false);
      },
      error: () => this._generatingInProgress.set(false),
    });
  }

  private getChatResponseStream(prompt: string): Observable<Message> {
    return concat(
      of({
        id: 'pending',
        text: '…',
        fromUser: false,
        generating: true,
      }),
      this.http
        .post('http://localhost:3000/message', prompt, {
          observe: 'events',
          responseType: 'text',
          reportProgress: true,
        })
        .pipe(
          filter((event: HttpEvent<string>) =>
            [HttpEventType.DownloadProgress, HttpEventType.Response].includes(
              event.type,
            ),
          ),
          map((event: HttpEvent<string>): MessageChunk => {
            if (event.type === HttpEventType.DownloadProgress) {
              return {
                text: (event as HttpDownloadProgressEvent).partialText ?? '',
                generating: true,
              };
            }
            return {
              text: (event as HttpResponse<string>).body ?? '',
              generating: false,
            };
          }),
          scan<MessageChunk, Message>(
            (message, chunk) => ({
              ...message,
              text: chunk.text,
              generating: chunk.generating,
            }),
            {
              id: crypto.randomUUID(),
              text: '',
              fromUser: false,
              generating: true,
            },
          ),
        ),
    );
  }
}
