import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MznDrawer } from './drawer.component';

@Component({
  standalone: true,
  imports: [MznDrawer],
  template: `
    <div
      mznDrawer
      [open]="open"
      [size]="size"
      [disablePortal]="true"
      isHeaderDisplay
      isBottomDisplay
      headerTitle="Test Drawer"
      bottomPrimaryActionText="Confirm"
      (closed)="onClose()"
      (bottomPrimaryActionClick)="onConfirm()"
    >
      <p class="content">Drawer content</p>
    </div>
  `,
})
class TestHostComponent {
  open = false;
  size: 'medium' | 'narrow' | 'wide' = 'medium';
  confirmed = false;
  onClose(): void {
    this.open = false;
  }
  onConfirm(): void {
    this.confirmed = true;
  }
}

/** Drawer with two focusable children, driven by a signal. */
@Component({
  standalone: true,
  imports: [MznDrawer],
  template: `
    <div mznDrawer [open]="open()" [disablePortal]="true">
      <button type="button">first</button>
      <button type="button">second</button>
    </div>
  `,
})
class FocusModelHost {
  readonly open = signal(false);
}

/** Drawer with a header, whose close control is the first focusable. */
@Component({
  standalone: true,
  imports: [MznDrawer],
  template: `
    <div
      mznDrawer
      [open]="true"
      [disablePortal]="true"
      headerTitle="Title"
      isHeaderDisplay
    >
      <button type="button">first</button>
    </div>
  `,
})
class FocusHeaderHost {}

/** Drawer with nothing focusable inside. */
@Component({
  standalone: true,
  imports: [MznDrawer],
  template: `
    <div mznDrawer [open]="true" [disablePortal]="true">
      <p>Plain text</p>
    </div>
  `,
})
class FocusEmptyHost {}

function createFixture<T>(component: new () => T): {
  fixture: ReturnType<typeof TestBed.createComponent<T>>;
  host: T;
} {
  const fixture = TestBed.createComponent(component);

  fixture.detectChanges();

  return { fixture, host: fixture.componentInstance };
}

describe('MznDrawer', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, TestHostComponent],
    });
  });

  it('should not render when closed', () => {
    createFixture(TestHostComponent);

    expect(document.querySelector('.mzn-drawer')).toBeNull();
  });

  it('should render when open', () => {
    const { fixture, host } = createFixture(TestHostComponent);

    host.open = true;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    fixture.detectChanges();

    const drawer = fixture.nativeElement.querySelector('.mzn-drawer');

    expect(drawer).toBeTruthy();
  });

  it('should apply size class', () => {
    const { fixture, host } = createFixture(TestHostComponent);

    host.open = true;
    host.size = 'wide';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    fixture.detectChanges();

    const drawer = fixture.nativeElement.querySelector('.mzn-drawer');

    expect(drawer.classList.contains('mzn-drawer--wide')).toBe(true);
  });

  it('should render header title', () => {
    const { fixture, host } = createFixture(TestHostComponent);

    host.open = true;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    fixture.detectChanges();

    const header = fixture.nativeElement.querySelector('.mzn-drawer__header');

    expect(header).toBeTruthy();
    expect(header.textContent).toContain('Test Drawer');
  });

  it('should render close button in header', () => {
    const { fixture, host } = createFixture(TestHostComponent);

    host.open = true;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    fixture.detectChanges();

    const closeBtn = fixture.nativeElement.querySelector('.mzn-clear-actions');

    expect(closeBtn).toBeTruthy();
  });

  it('should render projected content', () => {
    const { fixture, host } = createFixture(TestHostComponent);

    host.open = true;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    fixture.detectChanges();

    const content = fixture.nativeElement.querySelector('.content');

    expect(content).toBeTruthy();
    expect(content.textContent).toContain('Drawer content');
  });

  it('should render bottom area with flat-prop primary button', () => {
    const { fixture, host } = createFixture(TestHostComponent);

    host.open = true;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    fixture.detectChanges();

    const bottom = fixture.nativeElement.querySelector('.mzn-drawer__bottom');

    expect(bottom).toBeTruthy();
    expect(bottom.textContent).toContain('Confirm');
  });

  describe('focus model', () => {
    function panelOf(): HTMLElement {
      return document.querySelector<HTMLElement>('.mzn-drawer')!;
    }

    function focusablesOf(): HTMLButtonElement[] {
      return Array.from(
        panelOf().querySelectorAll<HTMLButtonElement>('button'),
      );
    }

    async function openFixture<T>(
      component: new () => T,
    ): Promise<ReturnType<typeof TestBed.createComponent<T>>> {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [NoopAnimationsModule, component],
      });

      const fixture = TestBed.createComponent(component);

      fixture.detectChanges();
      await Promise.resolve();

      return fixture;
    }

    async function openFocusModelHost(): Promise<
      ReturnType<typeof TestBed.createComponent<FocusModelHost>>
    > {
      const fixture = await openFixture(FocusModelHost);

      fixture.componentInstance.open.set(true);
      fixture.detectChanges();
      await Promise.resolve();

      return fixture;
    }

    it('should expose dialog semantics on the panel while open', async () => {
      await openFocusModelHost();

      const panel = panelOf();

      expect(panel.getAttribute('role')).toBe('dialog');
      expect(panel.getAttribute('aria-modal')).toBe('true');
      expect(panel.getAttribute('tabindex')).toBe('-1');
    });

    it('should move focus into the drawer when it opens', async () => {
      const outside = document.createElement('button');

      outside.textContent = 'outside';
      document.body.appendChild(outside);
      outside.focus();

      await openFocusModelHost();

      expect(document.activeElement?.textContent).toBe('first');

      outside.remove();
    });

    it('should focus the header close control first when the header is displayed', async () => {
      await openFixture(FocusHeaderHost);

      expect(document.activeElement).toBe(
        panelOf().querySelector('.mzn-drawer__header button'),
      );
    });

    it('should fall back to the panel itself when nothing inside is focusable', async () => {
      await openFixture(FocusEmptyHost);

      expect(document.activeElement).toBe(panelOf());
    });

    it('should restore focus to the previously focused element on close', async () => {
      const trigger = document.createElement('button');

      trigger.textContent = 'trigger';
      document.body.appendChild(trigger);
      trigger.focus();

      const fixture = await openFocusModelHost();

      expect(document.activeElement?.textContent).toBe('first');

      fixture.componentInstance.open.set(false);
      fixture.detectChanges();

      expect(document.activeElement).toBe(trigger);

      trigger.remove();
    });

    it('should cycle Tab from the last focusable back to the first', async () => {
      await openFocusModelHost();

      const focusable = focusablesOf();

      focusable[focusable.length - 1].focus();
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));

      expect(document.activeElement).toBe(focusable[0]);
    });

    it('should cycle Shift+Tab from the first focusable back to the last', async () => {
      await openFocusModelHost();

      const focusable = focusablesOf();

      focusable[0].focus();
      document.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true }),
      );

      expect(document.activeElement).toBe(focusable[focusable.length - 1]);
    });

    it('should pull focus back in when it has escaped the drawer', async () => {
      await openFocusModelHost();

      const outside = document.createElement('button');

      outside.textContent = 'outside';
      document.body.appendChild(outside);
      outside.focus();

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));

      expect(document.activeElement?.textContent).toBe('first');

      outside.remove();
    });
  });
});
