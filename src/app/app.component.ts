import { Component, effect, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { MessageService } from './message.service';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgClass, FormsModule],
  template: `
    <h1>🤖 Angular Generative AI Demo</h1>

    @for (message of messages(); track message.id) {
      <pre
        class="message"
        [ngClass]="{
          'from-user': message.fromUser,
          generating: message.generating
        }"
        >{{ message.text }}</pre
      >
    }

    <form #form="ngForm" (ngSubmit)="sendMessage(form, form.value.message)">
      <input
        name="message"
        placeholder="Type a message"
        ngModel
        required
        autofocus
        [disabled]="generatingInProgress()"
      />
      <button type="submit" [disabled]="generatingInProgress() || form.invalid">
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
    setImmediate(() =>
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
