import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MznDescription } from './description.component';
import { MznDescriptionTitle } from './description-title.component';
import { MznDescriptionContent } from './description-content.component';
import { MznDescriptionGroup } from './description-group.component';

@Component({
  standalone: true,
  imports: [
    MznDescription,
    MznDescriptionTitle,
    MznDescriptionContent,
    MznDescriptionGroup,
  ],
  template: `
    <mzn-description
      [orientation]="orientation"
      [size]="size"
      [title]="titleText"
      [widthType]="widthType"
    >
      <mzn-description-content [variant]="variant"
        >Content</mzn-description-content
      >
    </mzn-description>
  `,
})
class TestHostComponent {
  orientation: 'horizontal' | 'vertical' = 'horizontal';
  size: 'main' | 'sub' = 'main';
  titleText = 'Title';
  widthType: 'narrow' | 'wide' | 'stretch' | 'hug' = 'stretch';
  variant: 'normal' | 'statistic' = 'normal';
}

function createFixture(overrides: Partial<TestHostComponent> = {}): {
  fixture: ReturnType<typeof TestBed.createComponent<TestHostComponent>>;
  host: TestHostComponent;
  getDescription: () => HTMLElement;
  getTitle: () => HTMLElement;
  getContent: () => HTMLElement;
} {
  const fixture = TestBed.createComponent(TestHostComponent);
  const host = fixture.componentInstance;

  Object.assign(host, overrides);
  fixture.detectChanges();

  return {
    fixture,
    host,
    getDescription: () =>
      fixture.nativeElement.querySelector('mzn-description') as HTMLElement,
    getTitle: () =>
      fixture.nativeElement.querySelector(
        'mzn-description-title',
      ) as HTMLElement,
    getContent: () =>
      fixture.nativeElement.querySelector(
        'mzn-description-content',
      ) as HTMLElement,
  };
}

describe('MznDescription', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
    });
  });

  it('should render with host class', () => {
    const { getDescription } = createFixture();

    expect(getDescription().classList.contains('mzn-description')).toBe(true);
  });

  it('should apply horizontal orientation by default', () => {
    const { getDescription } = createFixture();

    expect(
      getDescription().classList.contains('mzn-description--horizontal'),
    ).toBe(true);
  });

  it('should apply vertical orientation', () => {
    const { getDescription } = createFixture({ orientation: 'vertical' });

    expect(
      getDescription().classList.contains('mzn-description--vertical'),
    ).toBe(true);
  });
});

describe('MznDescriptionTitle', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
    });
  });

  it('should render with title host class', () => {
    const { getTitle } = createFixture();

    expect(getTitle().classList.contains('mzn-description-title')).toBe(true);
  });

  it('should apply size class from parent', () => {
    const { getTitle } = createFixture({ size: 'sub' });

    expect(getTitle().classList.contains('mzn-description-title--sub')).toBe(
      true,
    );
  });

  it('should apply width type class', () => {
    const { getTitle } = createFixture({ widthType: 'narrow' });

    expect(getTitle().classList.contains('mzn-description-title--narrow')).toBe(
      true,
    );
  });

  it('should render title text', () => {
    const { getTitle } = createFixture();

    expect(
      getTitle().querySelector('.mzn-description-title__text')?.textContent,
    ).toContain('Title');
  });
});

describe('MznDescriptionContent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
    });
  });

  it('should render with content host class', () => {
    const { getContent } = createFixture();

    expect(getContent().classList.contains('mzn-description-content')).toBe(
      true,
    );
  });

  it('should apply variant class', () => {
    const { getContent } = createFixture({ variant: 'statistic' });

    expect(
      getContent().classList.contains('mzn-description-content--statistic'),
    ).toBe(true);
  });

  it('should apply size class from parent', () => {
    const { getContent } = createFixture({ size: 'sub' });

    expect(
      getContent().classList.contains('mzn-description-content--sub'),
    ).toBe(true);
  });
});

describe('MznDescriptionGroup', () => {
  @Component({
    standalone: true,
    imports: [MznDescription, MznDescriptionGroup],
    template: `
      <mzn-description-group>
        <mzn-description title="Child 1"
          ><span>Content 1</span></mzn-description
        >
        <mzn-description title="Child 2"
          ><span>Content 2</span></mzn-description
        >
      </mzn-description-group>
    `,
  })
  class GroupHost {}

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GroupHost],
    });
  });

  it('should render with group host class', () => {
    const fixture = TestBed.createComponent(GroupHost);

    fixture.detectChanges();

    const group = fixture.nativeElement.querySelector(
      'mzn-description-group',
    ) as HTMLElement;

    expect(group.classList.contains('mzn-description-group')).toBe(true);
  });
});
