import { Component, effect, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { MessageService } from './message.service';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  template: `
    <h1 class="text-2xl font-bold my-4">🤖 Angular Generative AI Demo</h1>

    @for (message of messages(); track message.id) {
      <pre
        class="w-fit max-w-[70%] border border-gray-500 py-2 px-3 rounded-lg whitespace-pre-wrap font-sans my-2"
        [class.ml-auto]="message.fromUser"
        [class.generating]="message.generating"
        >{{ message.text }}</pre
      >
    }

    <form
      #form="ngForm"
      (ngSubmit)="sendMessage(form, form.value.message)"
      class="fixed bottom-0 left-0 w-full flex gap-2 p-2 bg-white border-t border-gray-500 box-border"
    >
      <input
        name="message"
        placeholder="Type a message"
        ngModel
        required
        autofocus
        [disabled]="generatingInProgress()"
        class="flex-1 py-2 px-3 border-0 rounded-lg text-base outline-none"
      />
      <button
        type="submit"
        [disabled]="generatingInProgress() || form.invalid"
        class="bg-blue-500 text-white border-0 rounded py-2 px-3 text-base cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Send
      </button>
    </form>
  `,
})
export class AppComponent {
  private readonly messageService = inject(MessageService);

  readonly messages = this.messageService.messages;
  readonly generatingInProgress = this.messageService.generatingInProgress;

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
