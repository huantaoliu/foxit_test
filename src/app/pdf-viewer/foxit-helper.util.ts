import { ElementRef } from '@angular/core';
import { environment } from '@environments/environment';
import * as UIExtension from '@foxitsoftware/foxit-pdf-sdk-for-web-library/lib/UIExtension.full';

export class FoxitHelper {
  private containerElement: HTMLElement;
  pdfui: any;
  events = UIExtension.PDFViewCtrl.Events;
  currentPage = 0;
  pdfDoc = null;

  getInstance(data: {
    htmlContainerRef: ElementRef;
    license: any;
  }): Promise<any> {
    const { license, htmlContainerRef } = data;

    return new Promise((resolve) => {
      // const PDFUI = UIExtension.PDFUI;
      this.pdfui = new UIExtension.PDFUI({
        viewerOptions: {
          libPath: environment.pathToFoxit,
          jr: {
            ...license,
            enginePath: `${environment.pathToFoxit}jr-engine/gsdk`,
          },
        },
        appearance: UIExtension.appearances.adaptive,
        renderTo: this.containerElement,
        // addons: [
        //   `${environment.pathToFoxit}uix-addons/edit-graphics`,
        //   `${environment.pathToFoxit}uix-addons/export-form`,
        //   `${environment.pathToFoxit}uix-addons/file-property`,
        //   `${environment.pathToFoxit}uix-addons/form-designer`,
        //   `${environment.pathToFoxit}uix-addons/form-to-sheet`,
        //   `${environment.pathToFoxit}uix-addons/full-screen`,
        //   `${environment.pathToFoxit}uix-addons/h-continuous`,
        //   `${environment.pathToFoxit}uix-addons/h-facing`,
        //   `${environment.pathToFoxit}uix-addons/h-single`,
        //   `${environment.pathToFoxit}uix-addons/import-form`,
        //   `${environment.pathToFoxit}uix-addons/multi-media`,
        //   `${environment.pathToFoxit}uix-addons/page-template`,
        //   `${environment.pathToFoxit}uix-addons/password-protect`,
        //   `${environment.pathToFoxit}uix-addons/path-objects`,
        //   `${environment.pathToFoxit}uix-addons/print`,
        //   `${environment.pathToFoxit}uix-addons/read-aloud`,
        //   `${environment.pathToFoxit}uix-addons/recognition-form`,
        //   `${environment.pathToFoxit}uix-addons/redaction`,
        //   `${environment.pathToFoxit}uix-addons/text-object`,
        //   `${environment.pathToFoxit}uix-addons/thumbnail`,
        //   `${environment.pathToFoxit}uix-addons/undo-redo`,
        //   `${environment.pathToFoxit}uix-addons/xfa-form`,
        // ],
      });
      this.registerEvents();
      resolve(this.pdfui);
    });
  }

  registerEvents(): void {
    // click
    this.pdfui.addViewerEventListener(
      this.events.tapPage,
      async (event: any) => {
        console.log('click ', event);
      }
    );

    // Double Click: to Create a new Annotation
    this.pdfui.addViewerEventListener(
      this.events.doubleTapPage,
      async (event: any) => {
        console.log('double clicked', event);
      }
    );
  }

  applyDocument(doc): void {
    this.currentPage = 1;
    this.pdfDoc = doc;
  }

  async openPDF(data): Promise<any> {
    return await this.pdfui.openPDFByFile(data);
  }
}
