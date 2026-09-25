import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { DialogData } from '@app/core/models/dialog.model';

@Component({
    selector: 'app-dialog',
    standalone: true,
    imports: [MatButtonModule, MatDialogModule],
    templateUrl: './dialog.component.html',
    styleUrl: './dialog.component.scss',
})
export class DialogComponent {
    protected readonly data = inject<DialogData>(MAT_DIALOG_DATA);

    private readonly dialogRef = inject(MatDialogRef<DialogComponent>);

    close(): void {
        this.dialogRef.close();
    }
}
