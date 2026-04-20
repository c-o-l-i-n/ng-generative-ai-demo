import { Component, inject } from '@angular/core';
import { MessageService } from './message.service';
import { FormsModule, NgForm } from '@angular/forms';
import { MarkdownComponent } from 'ngx-markdown';

@Component({
  selector: 'app-root',
  imports: [FormsModule, MarkdownComponent],
  template: `
    <!-- Top Nav -->
    <header class="shrink-0 border-b border-slate-800 bg-slate-900">
      <div class="mx-auto max-w-2xl px-2 py-4">
        <h1 class="text-lg font-semibold text-slate-100">
          Angular LLM Chat Demo
        </h1>
      </div>
    </header>

    <main class="flex flex-1 flex-col overflow-y-auto">
      <div
        class="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-3 px-2 py-4 pb-64"
      >
        <!-- Empty State -->
        @if (messages().length === 0) {
          <div class="flex flex-1 items-center justify-center">
            <h2 class="text-3xl font-light text-slate-300">
              What's on your mind today?
            </h2>
          </div>
        }

        <!-- Message List -->
        @for (message of messages(); track message.id) {
          @if (message.fromUser) {
            <div class="flex flex-row-reverse">
              <pre
                class="max-w-[80%] rounded-2xl rounded-br-sm bg-blue-600 px-4 py-2 font-sans leading-relaxed whitespace-pre-wrap text-white"
                >{{ message.text }}</pre
              >
            </div>
          } @else {
            @if (message.generating && !message.text) {
              <div class="px-1 py-2">
                <div class="size-4 animate-pulse rounded-full bg-white"></div>
              </div>
            } @else {
              <markdown
                [data]="message.text"
                class="prose prose-invert w-full max-w-none px-1 py-2 leading-relaxed text-slate-200"
              />
            }
          }
        }
      </div>
    </main>

    <!-- Input Bar -->
    <form
      #form="ngForm"
      (ngSubmit)="sendMessage(form, form.value.message)"
      class="shrink-0 border-t border-slate-800 bg-slate-900 p-3"
    >
      <div class="mx-auto flex max-w-2xl gap-2">
        <input
          name="message"
          placeholder="Ask anything"
          ngModel
          required
          autofocus
          class="flex-1 rounded-full border border-slate-600 bg-slate-800 px-4 py-2 text-slate-100 placeholder-slate-500 transition-all outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-900"
        />
        <!-- Submit Button: disabled while a response is streaming -->
        <button
          type="submit"
          [disabled]="generatingInProgress() || form.invalid"
          class="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white transition-colors enabled:hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            stroke="currentColor"
            fill="none"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M12 5.5V19" />
            <path
              d="M18 11C18 11 13.5811 5.00001 12 5C10.4188 4.99999 6 11 6 11"
            />
          </svg>
        </button>
      </div>
    </form>
  `,
  host: {
    class: 'flex h-screen flex-col overflow-hidden',
  },
})
export class AppComponent {
  private readonly messageService = inject(MessageService);

  readonly messages = this.messageService.messages;
  readonly generatingInProgress = this.messageService.generatingInProgress;

  sendMessage(form: NgForm, messageText: string): void {
    this.messageService.sendMessage(messageText);
    form.resetForm();
  }
}
