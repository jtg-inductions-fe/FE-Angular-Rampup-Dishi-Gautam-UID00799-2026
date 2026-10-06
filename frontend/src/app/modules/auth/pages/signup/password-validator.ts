import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import { AUTH_FORM_FIELDS } from '@app/shared/constants/auth-form-fields';

export const passwordMatchValidator: ValidatorFn = (
    control: AbstractControl,
): ValidationErrors | null => {
    const password = control.get(AUTH_FORM_FIELDS.PASSWORD)?.value;
    const confirmPassword = control.get(AUTH_FORM_FIELDS.CONFIRM_PASSWORD)?.value;
    if (!password || !confirmPassword) {
        return null;
    }
    return password === confirmPassword ? null : { passwordMismatch: true };
};
