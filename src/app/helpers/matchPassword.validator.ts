import { FormGroup, AbstractControl } from '@angular/forms';

// custom validator to check that two passwords match
export class ValidatePassword {
    static MatchPassword(control: AbstractControl): { [key: string]: any } {

        if (control.get('password') !== null && control.get('confirmPassword') !== null) {
            if (control.get('confirmPassword').errors && !control.get('confirmPassword').errors.isEqual) {
                return;
            }

            if (control.get('password').value !== control.get('confirmPassword').value) {
                control.get('confirmPassword').setErrors({ isEqual: true });
            }
            return null;

            }

        }


}
