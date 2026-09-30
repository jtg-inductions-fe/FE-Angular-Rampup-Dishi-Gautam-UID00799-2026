import { Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';

@Component({
    selector: 'app-rich-text-editor',
    standalone: true,
    imports: [QuillModule, ReactiveFormsModule],
    template: `
        <div class="rich-text-editor">
                <quill-editor
                class="rich-text-editor__control"
                [formControl]="control()"
                [modules]="modules()"
                theme="snow"
            />
        </div>
    `,
    styleUrl: './rich-text-editor.scss',
})
export class RichTextEditorComponent {
    readonly control = input.required<FormControl<string>>();

    readonly modules = input.required<object>();

    readonly label = input.required<string>();
}
