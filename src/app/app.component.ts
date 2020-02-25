import {Component, ElementRef, HostListener, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
// @ts-ignore
import IconsJson from '../assets/icons.json';
import {MatDialog} from '@angular/material/dialog';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';


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
  formWidth: number;
  rankWidth: number;
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

  step = 0;
  nameFormSubmitted = false;
  isVertPhone = false;
  startingIcons = [];
  rankedList = [];

  ngOnInit(): void {
    this.icons = IconsJson.icons;
    this.width = window.innerWidth;
    this.colNum = this.getColumns(this.width);
    this.isVertPhone = this.width < 600;
    this.startingIcons = IconsJson.icons.map(x => Object.assign({}, x));
    this.formWidth = this.width - 60;
    this.rankWidth = this.width - 110 - 18;
  }
  @HostListener('window:resize', ['$event'])
  onWindowResize($event) {
    this.width = window.innerWidth;
    this.colNum = this.getColumns(this.width);
    this.isVertPhone = this.width < 600;
    this.formWidth = this.width - 60;
    this.rankWidth = this.width - 110 - 18;
    return undefined;
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
      if (!this.nameForm.valid) {
        this.name.markAsTouched();
        return;
      } else {
        this.nameFormSubmitted = true;
      }
    } else if (this.step === 2) {
      if (this.rankedList.length === 0) {
        alert('Please vote for at least one icon');
        return;
      }
    }
    this.step++;
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

  submitAll() {
    alert('Thanks for voting!');
  }


  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      if (event.container.id !== 'trashList') {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      }
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }
}
