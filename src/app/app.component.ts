import { Component, computed, effect, inject } from '@angular/core';
import { MessageService } from './message.service';
import { FormsModule, NgForm } from '@angular/forms';
import { MarkdownComponent } from 'ngx-markdown';

@Component({
  selector: 'app-root',
  imports: [FormsModule, MarkdownComponent],
  template: `
    <!-- Sticky Top Nav -->
    <header class="sticky top-0 z-10 border-b border-gray-700 bg-gray-900">
      <div class="mx-auto max-w-2xl px-2 py-4">
        <h1 class="text-lg font-semibold text-gray-100">
          Angular LLM Chat Demo
        </h1>
      </div>
    </header>

    <div class="mx-auto flex min-h-screen max-w-2xl flex-col">
      <main class="flex flex-1 flex-col gap-3 px-2 py-4 pb-24">
        <!-- Empty State -->
        @if (messages().length === 0) {
          <div
            class="flex flex-1 flex-col items-center justify-center py-16 text-center text-gray-500"
          >
            <div class="mb-3 text-4xl">💬</div>
            <p class="text-sm">Send a message to get started</p>
          </div>
        }

        <!-- Message List -->
        @for (message of messages(); track message.id) {
          <!-- User-Generated Message: right-aligned bubble-->
          @if (message.fromUser) {
            <div class="flex flex-row-reverse">
              <pre
                class="max-w-[80%] rounded-2xl rounded-br-sm bg-blue-600 px-4 py-2 font-sans leading-relaxed whitespace-pre-wrap text-white"
                >{{ message.text }}</pre
              >
            </div>
          } @else {
            <!-- AI message: pulsing circle while waiting for first chunk, then plain markdown -->
            @if (message.generating && !message.text) {
              <div class="px-1 py-2">
                <div class="size-4 animate-pulse rounded-full bg-white"></div>
              </div>
            } @else {
              <markdown
                [data]="message.text"
                class="prose prose-invert w-full max-w-none px-1 py-2 leading-relaxed text-gray-200"
              />
            }
          }
        }
      </main>

      <!-- Fixed Input Bar -->
      <form
        #form="ngForm"
        (ngSubmit)="sendMessage(form, form.value.message)"
        class="fixed right-0 bottom-0 left-0 border-t border-gray-700 bg-gray-900 p-3"
      >
        <div class="mx-auto flex max-w-2xl gap-2">
          <input
            name="message"
            [placeholder]="placeholder()"
            ngModel
            required
            autofocus
            class="flex-1 rounded-full border border-gray-600 bg-gray-800 px-4 py-2 text-gray-100 placeholder-gray-500 transition-all outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-900"
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
    </div>
  `,
})
export class AppComponent {
  private readonly messageService = inject(MessageService);

  readonly messages = this.messageService.messages;
  readonly generatingInProgress = this.messageService.generatingInProgress;

  readonly placeholder = computed(() =>
    this.messages().length === 0 ? 'How can I help you today?' : 'Reply...',
  );

  private readonly scrollOnMessageChanges = effect(() => {
    // run this effect on every messages change
    this.messages();

    // scroll after the messages render
    setTimeout(() =>
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth',
      }),
    );
  });

  sendMessage(form: NgForm, messageText: string): void {
    this.messageService.sendMessage(messageText);
    form.resetForm();
  }
}
