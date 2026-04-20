import { Component, computed, effect, inject } from '@angular/core';
import { MessageService } from './message.service';
import { FormsModule, NgForm } from '@angular/forms';
import { MarkdownComponent } from 'ngx-markdown';

@Component({
  selector: 'app-root',
  imports: [FormsModule, MarkdownComponent],
  template: `
    <!-- Sticky Top Nav -->
    <header class="sticky top-0 z-10 bg-gray-900 border-b border-gray-700">
      <div class="max-w-2xl mx-auto py-4 px-2">
        <h1 class="text-lg font-semibold text-gray-100">
          Angular LLM Chat Demo
        </h1>
      </div>
    </header>

    <div class="max-w-2xl mx-auto flex flex-col min-h-screen">
      <main class="flex-1 flex flex-col gap-3 py-4 px-2 pb-24">
        <!-- Empty State -->
        @if (messages().length === 0) {
          <div
            class="flex flex-col items-center justify-center flex-1 text-center text-gray-500 py-16"
          >
            <div class="text-4xl mb-3">💬</div>
            <p class="text-sm">Send a message to get started</p>
          </div>
        }

        <!-- Message List -->
        @for (message of messages(); track message.id) {
          <!-- User-Generated Message: right-aligned bubble-->
          @if (message.fromUser) {
            <div class="flex flex-row-reverse">
              <pre
                class="max-w-[80%] py-2 px-4 rounded-2xl rounded-br-sm bg-blue-600 text-white whitespace-pre-wrap font-sans leading-relaxed"
                >{{ message.text }}</pre
              >
            </div>
          } @else {
            <!-- AI-generate Message: rendered as markdown, shows a blinking cursor while generating -->
            <markdown
              [data]="message.text"
              class="w-full py-2 px-1 leading-relaxed text-gray-200 prose prose-invert max-w-none"
              [class.generating]="message.generating"
            />
          }
        }
      </main>

      <!-- fixed input bar -->
      <form
        #form="ngForm"
        (ngSubmit)="sendMessage(form, form.value.message)"
        class="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 p-3"
      >
        <div class="max-w-2xl mx-auto flex gap-2">
          <input
            name="message"
            [placeholder]="placeholder()"
            ngModel
            required
            autofocus
            [disabled]="generatingInProgress()"
            class="flex-1 py-2 px-4 bg-gray-800 border border-gray-600 text-gray-100 placeholder-gray-500 rounded-full outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-900 transition-all disabled:opacity-50"
          />
          <!-- submit; disabled while a response is streaming -->
          <button
            type="submit"
            [disabled]="generatingInProgress() || form.invalid"
            class="bg-blue-500 hover:bg-blue-600 text-white rounded-full size-10 flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
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
    this.messages().length === 0 ? 'How can I help you today?' : 'Reply',
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
