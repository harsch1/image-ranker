import {ChangeDetectorRef, Component, HostListener, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import * as sheets from 'google-spreadsheet';
import creds from '../assets/credentials.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(public dialog: MatDialog, private cd: ChangeDetectorRef) {}
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
  doc: any;

  // icons  = [];
  nameForm = new FormGroup({
    name: this.name
  });

  step = 0;
  nameFormSubmitted = false;
  startingIcons = [];
  rankedList = [];
  icons = [];

  ngOnInit(): void {
    // this.icons = IconsJson.icons;
    this.width = window.innerWidth;
    this.colNum = this.getColumns(this.width);
    this.formWidth = this.width - 60;
    this.rankWidth = this.width - 110 - 18;
    this.initSheets().then(() => console.log('Loaded from sheets'));
  }

  async initSheets() {
    this.doc = new sheets.GoogleSpreadsheet('19AstxA2-L_Ok1wm5lmijbk3ttVuIZBmbVPE0mKOhPm4');
    await this.doc.useServiceAccountAuth(creds);
    await this.doc.loadInfo();
    const sheet = this.doc.sheetsByIndex[0];
    sheet.getRows().then(resolve => {
      this.icons = resolve;
      this.shuffle(this.icons);
      this.startingIcons = this.icons;
    });
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize($event) {
    this.width = window.innerWidth;
    this.colNum = this.getColumns(this.width);
    this.formWidth = this.width - 60;
    this.rankWidth = this.width - 110 - 18;
    this.cd.detectChanges();
    return undefined;
  }

  onResize(event) {
    this.colNum = this.getColumns(event.target.innerWidth);
  }

  getColumns(width: number): number {
    const panelWidth = this.iconPanelSize;
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

  shuffle( array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep(steps: number = 1) {
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
    this.step = this.step + steps;
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
    if (this.rankedList.length === 0) {
      alert('Please vote for at least one icon. (You can do this by dragging it from the lower box to the upper one)');
    } else {
      const sheet = this.doc.sheetsByIndex[1];
      (sheet.addRow({
        name: this.name.value,
        voteString: this.rankedList.map(icon => icon.index).join(','),
        date: new Date().toUTCString()
      }, {insert: true}) as Promise<any>).then(row => {
        (sheet.saveUpdatedCells() as Promise<any>).then(() => {
          alert('Successfully submitted your vote! Let harsch know if there were any issues while voting ' +
            'or things to change about the site');
          location.reload();
        }, error => {
          console.log(error);
          console.log(row);
          alert('Error submitting vote. Please try again. Contact harsch if this keeps happening');
        });
      }, error => {
        console.log(error);
        console.log(sheet);
        alert('Error creating vote. Please try again. Contact harsch if this keeps happening');
      });
    }
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
