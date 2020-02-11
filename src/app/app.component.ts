import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'image-ranker';
  name = new FormControl('', Validators.required);

  nameForm = new FormGroup({
    name: this.name
  });

  step = 0;
  nameFormSubmitted = false;

  getErrorMessage(elm: FormControl): string {
    if (elm.hasError('required')) {
      return 'You must enter a value';
    }
    return 'Unknown error';
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    if (this.step === 0) {
      console.log(this.nameForm);
      if (this.nameForm.valid) {
        this.nameFormSubmitted = true;
        this.step++;
      } else {
        this.name.markAsTouched();
      }
    }
  }

  prevStep() {
    this.step--;
  }
}
