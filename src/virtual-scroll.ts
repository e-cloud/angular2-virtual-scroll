import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  NgModule,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChange,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

export interface ChangeEvent {
  start?: number;
  end?: number;
}

const isIE = !!navigator.userAgent.match(/Trident/g) || !!navigator.userAgent.match(/MSIE/g);

function getRootScrollContainerIfNeeded(element) {
  return element === document.body
    ? isIE
      ? document.documentElement
      : document.scrollingElement
    : element;
}

@Component({
  selector: 'virtual-scroll, [virtualScroll]',
  exportAs: 'virtualScroll',
  template: `
    <div class="total-padding" [style.height]="scrollHeight + 'px'"></div>
    <div class="scrollable-content" #content [style.transform]="'translateY(' + topPadding + 'px)'"
         [style.webkitTransform]="'translateY(' + topPadding + 'px)'">
      <ng-content></ng-content>
    </div>
  `,
  host: {
    '[style.overflow-y]': 'parentScroll ? "hidden" : "auto"'
  },
  styles: [
      `
      :host {
        overflow: hidden;
        position: relative;
        display: block;
        -webkit-overflow-scrolling: touch;
      }

      .scrollable-content {
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        position: absolute;
      }

      .total-padding {
        width: 1px;
        opacity: 0;
      }
      `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VirtualScrollComponent implements OnChanges, OnDestroy {

  @Input()
  items: any[] = [];

  @Input()
  scrollbarWidth = 0;

  @Input()
  scrollbarHeight = 0;

  @Input()
  childWidth: number;

  @Input()
  childHeight: number;

  @Input()
  bufferAmount = 0;

  @Input()
  set parentScroll(element: Element | Window) {
    if (this._parentScroll === element) {
      return;
    }
    this.removeParentEventHandlers(this._parentScroll);
    this._parentScroll = element;
    this.addParentEventHandlers(this._parentScroll);
  }

  get parentScroll(): Element | Window {
    return this._parentScroll;
  }

  @Output()
  update: EventEmitter<any[]> = new EventEmitter<any[]>();

  @Output()
  change: EventEmitter<ChangeEvent> = new EventEmitter<ChangeEvent>();

  @Output()
  start: EventEmitter<ChangeEvent> = new EventEmitter<ChangeEvent>();

  @Output()
  end: EventEmitter<ChangeEvent> = new EventEmitter<ChangeEvent>();

  @ViewChild('content', { read: ElementRef })
  contentElementRef: ElementRef;

  @ContentChild('container')
  containerElementRef: ElementRef;

  viewPortItems: any[];
  topPadding: number;
  scrollHeight: number;
  previousStart: number;
  previousEnd: number;
  startupLoop = true;
  window = window;

  private ticking = false;
  private _parentScroll: Element | Window;

  constructor(private element: ElementRef) { }

  @HostListener('scroll')
  onScroll() {
    this.refresh();
  }

  ngOnDestroy() {
    this.removeParentEventHandlers(this.parentScroll);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.previousStart = undefined;
    this.previousEnd = undefined;
    const items: SimpleChange = changes.items || {} as any;
    if (changes.items !== undefined && items.previousValue === undefined ||
      items.previousValue !== undefined && items.previousValue.length === 0) {

      // startupLoop is a temporary solution for rendering out the correct viewport items.
      // When users don't specify the child dimensions(width and height) and we haven't render anything,
      // we have to figure out the dimensions ourselves. That's to assume that child dimensions
      // is the same as viewport dimensions. Therefore, for the initial rendering, we will render the first
      // item. Then, the second round, we will render the full viewport based on the element's dimension of
      // the first rendered element.
      this.startupLoop = true;
    }
    this.refresh();
  }

  refresh() {
    if (this.ticking) {
      return;
    }

    this.ticking = true;

    requestAnimationFrame(() => {
      this.ticking = false;
      this.calculateItems();
    });
  }

  scrollInto(item: any) {
    const el = this.findScrollContainer();
    const index = (this.items || []).indexOf(item);
    if (index < 0 || index >= (this.items || []).length) {
      return;
    }

    const d = this.calculateDimensions();
    el.scrollTop = (Math.floor(index / d.itemsPerRow) * d.childHeight)
      - (d.childHeight * Math.min(index, this.bufferAmount));
    this.refresh();
  }

  private refreshHandler() {
    this.refresh();
  }

  private addParentEventHandlers(parentScroll: Element | Window) {
    if (parentScroll) {
      parentScroll.addEventListener('scroll', this.refreshHandler);
      if (parentScroll instanceof Window) {
        parentScroll.addEventListener('resize', this.refreshHandler);
      }
    }
  }

  private removeParentEventHandlers(parentScroll: Element | Window) {
    if (parentScroll) {
      parentScroll.removeEventListener('scroll', this.refreshHandler);
      if (parentScroll instanceof Window) {
        parentScroll.removeEventListener('resize', this.refreshHandler);
      }
    }
  }

  private countItemsPerRow() {
    let offsetTop;
    let itemsPerRow;
    const children = this.contentElementRef.nativeElement.children;
    for (itemsPerRow = 0; itemsPerRow < children.length; itemsPerRow++) {
      if (offsetTop !== undefined && offsetTop !== children[itemsPerRow].offsetTop) {
        break;
      }
      offsetTop = children[itemsPerRow].offsetTop;
    }
    return itemsPerRow;
  }

  /**
   * for usecase with additional elements in scrollable container or using the upper scrollable area
   * (as parentScroll), offsetTop is required to calculate the proper slice index
   */
  private getElementsOffset(): number {
    let offsetTop = 0;
    if (this.containerElementRef && this.containerElementRef.nativeElement) {
      offsetTop += this.containerElementRef.nativeElement.offsetTop;
    }
    if (this.parentScroll) {
      offsetTop += this.element.nativeElement.offsetTop;
    }
    return offsetTop;
  }

  private findScrollContainer() {
    return getRootScrollContainerIfNeeded(this.parentScroll || this.element.nativeElement);
  }

  private calculateDimensions() {
    const el = this.findScrollContainer();
    const items = this.items || [];
    const itemCount = items.length;
    const viewWidth = el.clientWidth - this.scrollbarWidth;
    const viewHeight = el.clientHeight - this.scrollbarHeight;

    let contentDimensions;
    if (this.childWidth === undefined || this.childHeight === undefined) {
      let content = this.contentElementRef.nativeElement;
      if (this.containerElementRef && this.containerElementRef.nativeElement) {
        content = this.containerElementRef.nativeElement;
      }
      contentDimensions = content.children[0]
        ? content.children[0].getBoundingClientRect()
        : {
          width: viewWidth,
          height: viewHeight
        };
    }
    const childWidth = this.childWidth || contentDimensions.width;
    const childHeight = this.childHeight || contentDimensions.height;

    // colSize
    let itemsPerRow = Math.max(1, this.countItemsPerRow());
    const itemsPerRowByCalc = Math.max(1, Math.floor(viewWidth / childWidth));
    /*
     * visible RowSize in viewport
     * i.e. vH: 100 cH: 23 => itemsPerCol = 5,
     * there would be 5 rows visible in viewport
     */
    const itemsPerCol = Math.max(1, Math.ceil(viewHeight / childHeight));

    const scrollTop = Math.max(0, el.scrollTop);

    const shouldUseCalcVal = scrollTop
      ? Math.floor(scrollTop / this.scrollHeight * itemsPerRowByCalc) + itemsPerRowByCalc >= itemCount
      : itemsPerRowByCalc > itemsPerRow;

    if (itemsPerRow === 1 && shouldUseCalcVal) {
      itemsPerRow = itemsPerRowByCalc;
    }

    return {
      itemCount: itemCount,
      viewWidth: viewWidth,
      viewHeight: viewHeight,
      childWidth: childWidth,
      childHeight: childHeight,
      itemsPerRow: itemsPerRow,
      itemsPerCol: itemsPerCol,
      itemsPerRowByCalc: itemsPerRowByCalc
    };
  }

  private calculateItems() {
    const d = this.calculateDimensions();
    const items = this.items || [];
    const offsetTop = this.getElementsOffset();
    this.scrollHeight = d.childHeight * d.itemCount / d.itemsPerRow;

    const el = this.findScrollContainer();

    // reset the scrollTop if it overflows the container
    if (el.scrollTop > (this.scrollHeight + offsetTop)) {
      el.scrollTop = this.scrollHeight + offsetTop;
    }

    // calc the actual scrollTop regardless of other factors
    const scrollTop = Math.max(0, el.scrollTop - offsetTop);

    const rowSize = d.itemCount / d.itemsPerRow;
    // calc the approximate row index based on scrollTop by percentage
    const rowIndexByScrollTop = scrollTop / this.scrollHeight * rowSize;

    // calc the end index from the start index above with colSize * (rowSize + 1), reset to
    // itemCount when scrollTop overflows, normally happens when input size reduces
    let end = Math.min(d.itemCount,
      Math.ceil(rowIndexByScrollTop) * d.itemsPerRow + d.itemsPerRow * d.itemsPerCol);

    // No matter the last row size is full or not, fill it to be full
    const maxEnd = Math.ceil(end / d.itemsPerRow) * d.itemsPerRow;

    const maxStart = Math.max(0, maxEnd - d.itemsPerCol * d.itemsPerRow);
    let start = Math.min(maxStart, Math.floor(rowIndexByScrollTop) * d.itemsPerRow);

    this.topPadding = d.childHeight * Math.ceil(start / d.itemsPerRow)
      - (d.childHeight * Math.min(start, this.bufferAmount)) || 0;

    start = !isNaN(start) ? start : 0;
    end = !isNaN(end) ? end : 0;
    start -= Math.ceil(this.bufferAmount / d.itemsPerRow);
    start = Math.max(0, start);
    end += Math.ceil(this.bufferAmount / d.itemsPerRow);
    end = Math.min(items.length, end);

    if (start !== this.previousStart || end !== this.previousEnd) {

      // update the scroll list
      this.viewPortItems = items.slice(start, end);
      this.update.emit(this.viewPortItems);

      if (this.startupLoop) {
        this.refresh();
      } else {
        // emit 'start' event
        if (start !== this.previousStart) {
          this.start.emit({ start, end });
        }

        // emit 'end' event
        if (end !== this.previousEnd) {
          this.end.emit({ start, end });
        }

        this.change.emit({ start, end });
      }

      this.previousStart = start;
      this.previousEnd = end;

    } else if (this.startupLoop) {
      this.startupLoop = false;
      // todo: There is no found usecase that causes changes after stable rendering
      // However, if anything goes wrong, re-enable next line.
      // this.refresh();
    }
  }
}

@NgModule({
  exports: [VirtualScrollComponent],
  declarations: [VirtualScrollComponent]
})
export class VirtualScrollModule {}
