import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, input, output } from '@angular/core';
import {
  ContentHeaderSize,
  ContentHeaderTitleComponent,
  MznContentHeader,
} from './content-header.component';
import { MznContentHeaderResponsive } from './content-header-responsive.component';

// ─── Test Host: MznContentHeader ───────────────────────────────────────────

@Component({
  standalone: true,
  imports: [MznContentHeader],
  template: `
    <mzn-content-header
      [title]="title()"
      [description]="description()"
      [size]="size()"
      [titleComponent]="titleComponent()"
      (backClick)="onBackClick.emit()"
    >
      <button contentHeaderBackButton>Back</button>
      <div contentHeaderFilter>Filter</div>
      <div contentHeaderActions>Actions</div>
      <div contentHeaderUtilities>Utilities</div>
    </mzn-content-header>
  `,
})
class TestHostComponent {
  readonly title = input('Test Title');
  readonly description = input<string | undefined>(undefined);
  readonly size = input<ContentHeaderSize>('main');
  readonly titleComponent = input<ContentHeaderTitleComponent | undefined>(
    undefined,
  );
  readonly onBackClick = output<void>();
}

function createFixture(
  overrides: {
    title?: string;
    description?: string;
    size?: ContentHeaderSize;
    titleComponent?: ContentHeaderTitleComponent;
  } = {},
): {
  fixture: ComponentFixture<TestHostComponent>;
  getHeaderElement: () => HTMLElement;
} {
  const fixture = TestBed.createComponent(TestHostComponent);

  if (overrides.title !== undefined) {
    fixture.componentRef.setInput('title', overrides.title);
  }

  if (overrides.description !== undefined) {
    fixture.componentRef.setInput('description', overrides.description);
  }

  if (overrides.size !== undefined) {
    fixture.componentRef.setInput('size', overrides.size);
  }

  if (overrides.titleComponent !== undefined) {
    fixture.componentRef.setInput('titleComponent', overrides.titleComponent);
  }

  fixture.detectChanges();

  return {
    fixture,
    getHeaderElement: (): HTMLElement =>
      fixture.nativeElement.querySelector('mzn-content-header')!,
  };
}

// ─── Test Host: MznContentHeaderResponsive ─────────────────────────────────

@Component({
  standalone: true,
  imports: [MznContentHeaderResponsive],
  template: `
    <mzn-content-header-responsive breakpoint="above1080px">
      <span>responsive content</span>
    </mzn-content-header-responsive>
  `,
})
class TestResponsiveHostComponent {}

// ─── Test Suite ────────────────────────────────────────────────────────────

describe('MznContentHeader', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, TestResponsiveHostComponent],
    }).compileComponents();
  });

  it('should create with host class and main size by default', () => {
    const { getHeaderElement } = createFixture();
    const el = getHeaderElement();

    expect(el.classList.contains('mzn-content-header')).toBe(true);
    expect(el.classList.contains('mzn-content-header--main')).toBe(true);
  });

  it('should render title', () => {
    const { getHeaderElement } = createFixture({ title: 'My Title' });
    const titleEl = getHeaderElement().querySelector('.mzn-typography--h2');

    expect(titleEl?.textContent?.trim()).toBe('My Title');
  });

  it('should render description when provided', () => {
    const { getHeaderElement } = createFixture({
      description: 'Some description',
    });
    const descEl = getHeaderElement().querySelector('.mzn-typography--caption');

    expect(descEl?.textContent?.trim()).toBe('Some description');
  });

  it('should not render description when not provided', () => {
    const { getHeaderElement } = createFixture();
    const descEl = getHeaderElement().querySelector('.mzn-typography--caption');

    expect(descEl).toBeNull();
  });

  it('should render back button slot in main size', () => {
    const { getHeaderElement } = createFixture();
    const backBtn = getHeaderElement().querySelector(
      '.mzn-content-header__back-button',
    );

    expect(backBtn).toBeTruthy();
    expect(backBtn?.textContent?.trim()).toBe('Back');
  });

  it('should hide back button slot in sub size', () => {
    const { getHeaderElement } = createFixture({ size: 'sub' });
    const backBtn = getHeaderElement().querySelector(
      '.mzn-content-header__back-button',
    );

    expect(backBtn).toBeNull();
  });

  it('should apply sub size class', () => {
    const { getHeaderElement } = createFixture({ size: 'sub' });
    const el = getHeaderElement();

    expect(el.classList.contains('mzn-content-header--sub')).toBe(true);
    expect(el.classList.contains('mzn-content-header--main')).toBe(false);
  });

  it('should use h2 typography class and h1 tag for main size by default', () => {
    const { getHeaderElement } = createFixture({ title: 'Main Title' });
    const h1El = getHeaderElement().querySelector('h1.mzn-typography--h2');

    expect(h1El?.textContent?.trim()).toBe('Main Title');
  });

  it('should use h3 typography class and h2 tag for sub size by default', () => {
    const { getHeaderElement } = createFixture({
      size: 'sub',
      title: 'Sub Title',
    });
    const h2El = getHeaderElement().querySelector('h2.mzn-typography--h3');

    expect(h2El?.textContent?.trim()).toBe('Sub Title');
  });

  describe('input: titleComponent', () => {
    it('should render h3 element when titleComponent is h3', () => {
      const { getHeaderElement } = createFixture({
        titleComponent: 'h3',
        title: 'H3 Title',
      });
      const h3El = getHeaderElement().querySelector('h3');

      expect(h3El?.textContent?.trim()).toBe('H3 Title');
    });

    it('should render p element when titleComponent is p', () => {
      const { getHeaderElement } = createFixture({
        titleComponent: 'p',
        title: 'Para Title',
      });
      const pEl = getHeaderElement().querySelector('p');

      expect(pEl?.textContent?.trim()).toBe('Para Title');
    });

    it('should override default heading element with titleComponent', () => {
      const { getHeaderElement } = createFixture({
        titleComponent: 'h4',
        title: 'H4 Title',
      });
      const h4El = getHeaderElement().querySelector('h4');

      expect(h4El).toBeTruthy();
      expect(h4El?.textContent?.trim()).toBe('H4 Title');
    });
  });

  it('should render filter slot', () => {
    const { getHeaderElement } = createFixture();
    const actionArea = getHeaderElement().querySelector(
      '.mzn-content-header__action-area',
    );

    expect(actionArea?.textContent).toContain('Filter');
  });

  it('should render actions slot', () => {
    const { getHeaderElement } = createFixture();
    const actionArea = getHeaderElement().querySelector(
      '.mzn-content-header__action-area',
    );

    expect(actionArea?.textContent).toContain('Actions');
  });

  it('should render utilities slot', () => {
    const { getHeaderElement } = createFixture();
    const utilities = getHeaderElement().querySelector(
      '.mzn-content-header__utilities',
    );

    expect(utilities?.textContent).toContain('Utilities');
  });
});

describe('MznContentHeaderResponsive', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestResponsiveHostComponent],
    }).compileComponents();
  });

  it('should apply breakpoint class', () => {
    const fixture = TestBed.createComponent(TestResponsiveHostComponent);

    fixture.detectChanges();

    const el = fixture.nativeElement.querySelector(
      'mzn-content-header-responsive',
    ) as HTMLElement;

    expect(el.classList.contains('mzn-content-header--above1080px')).toBe(true);
  });

  it('should render projected content', () => {
    const fixture = TestBed.createComponent(TestResponsiveHostComponent);

    fixture.detectChanges();

    const el = fixture.nativeElement.querySelector(
      'mzn-content-header-responsive',
    ) as HTMLElement;

    expect(el.textContent?.trim()).toBe('responsive content');
  });
});
