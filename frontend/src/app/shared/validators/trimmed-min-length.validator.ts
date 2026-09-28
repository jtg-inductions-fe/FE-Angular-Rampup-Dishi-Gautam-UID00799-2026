import {
    AbstractControl,
    ValidationErrors,
    ValidatorFn,
} from '@angular/forms';

export const trimmedMinLength = (
    minLength: number,
): ValidatorFn => {
    return (
        control: AbstractControl,
    ): ValidationErrors | null => {
        const value = String(control.value ?? '').trim();

        if (value.length < minLength) {
            return {
                minlength: {
                    requiredLength: minLength,
                    actualLength: value.length,
                },
            };
        }

        return null;
    };
};