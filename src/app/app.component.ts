import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
// @ts-ignore
import IconsJson from '../assets/icons.json';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('fullSize') modal: TemplateRef<any>;
  title = 'image-ranker';
  name = new FormControl('' , Validators.required);
  colNum: number;
  width: number;

  icons  = [];
  nameForm = new FormGroup({
    name: this.name
  });

  step = 0;
  nameFormSubmitted = false;
  isVertPhone = false;

  constructor(public dialog: MatDialog) {}


  ngOnInit(): void {
    this.icons = IconsJson.icons;
    this.width = window.innerWidth;
    this.colNum = this.getColumns(this.width);
    this.isVertPhone = this.width < 600;
    console.log(this.icons);
  }

  onResize(event) {
    this.colNum = this.getColumns(event.target.innerWidth);
  }

  getColumns(width: number): number {
    const panelWidth = 250;
    const paddingWidth = 15;
    if (Math.ceil(width / panelWidth) * width + 10 * Math.ceil(width / panelWidth) + 108 + 48 > width) {
      return Math.ceil((width - 108) / panelWidth) - 1;
    }
    return Math.ceil((width - 108) / panelWidth);
  }
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
  openFullImage(url: string): void {
    console.log(window.innerWidth);
    this.dialog.open(this.modal, {
      maxWidth: (window.innerWidth - 10) + 'px',
      width: '700px',
      maxHeight: (window.innerWidth - 10) + 'px',
      height: '700px',
      data: {
        url,
        width: (window.innerWidth - 10) < 700 ? (window.innerWidth - 48) : 652,
      }
    });
  }

  prevStep() {
    this.step--;
  }

}
