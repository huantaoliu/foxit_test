import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Subject } from 'rxjs';
import { FoxitHelper } from './foxit-helper.util';
import FoxitLicense from './license-key';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss'],
})
export class PdfViewerComponent implements OnDestroy, OnInit, AfterViewInit {
  @ViewChild('viewRef', { static: true }) viewRef: ElementRef<HTMLDivElement>;

  instance: any;
  downloadedDocumentReady$: Subject<any> = new Subject();
  componentDestroyed$: Subject<void> = new Subject();
  helper: FoxitHelper;

  constructor() {}

  ngOnInit(): void {}

  async ngAfterViewInit() {
    if (!this.instance) {
      console.log('new instance');
      this.helper = new FoxitHelper();
      this.instance = await this.helper.getInstance({
        htmlContainerRef: this.viewRef,
        license: FoxitLicense,
      });
      this.initEditor();
      this.addWindowEvents();
    }
  }

  private async initEditor(): Promise<void> {
    fetch('assets/testfile.pdf')
      .then((response) => response.blob())
      .then(async (text) => {
        try {
          const doc = await this.helper.openPDF(text as File);
          this.helper.applyDocument(doc);
        } catch (err) {
          console.log(err);
        }
      });
  }

  private addWindowEvents(): void {
    window.addEventListener('beforeunload', () => this.destroyInstance());
  }

  private destroyInstance(): void {
    if (this.instance) {
      this.instance.destroy();
      this.instance = null;
      console.log('destroy foxit instance');
    }
  }

  ngOnDestroy(): void {
    this.destroyInstance();
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }
}
