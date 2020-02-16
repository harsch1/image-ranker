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

  constructor(public dialog: MatDialog) {}
  @ViewChild('fullSize') modal: TemplateRef<any>;
  title = 'image-ranker';
  name = new FormControl('' , Validators.required);
  colNum: number;
  width: number;
  iconMaxSize = 200;
  iconBuffer = 20;
  iconPanelSize = this.iconMaxSize + this.iconBuffer + 30;
  iconMaxSizeCss = this.iconMaxSize + 'px';
  iconTotalCss = (this.iconMaxSize + this.iconBuffer) + 'px';
  iconPanelCss = this.iconPanelSize + 'px';

  icons  = [];
  nameForm = new FormGroup({
    name: this.name
  });

  step = 1;
  nameFormSubmitted = false;
  isVertPhone = false;

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
    const panelWidth = this.iconPanelSize;
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
    } else if (this.step === 1) {
      this.step++;
    }
  }
  openFullImage(url: string): void {
    const img = new Image();
    img.src = url;
    this.dialog.open(this.modal, {
      panelClass: 'custom-dialog-container',
      maxWidth: (window.innerWidth - 10) + 'px',
      maxHeight: (window.innerHeight - 10) + 'px',
      data: {
        url,
        width: (window.innerWidth - 60),
        height: (window.innerHeight - 60),
      }
    });
  }

  prevStep() {
    this.step--;
  }

}
