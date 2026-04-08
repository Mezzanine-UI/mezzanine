import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MznContentHeader } from '@mezzanine-ui/ng/content-header';
import { MznSection } from './section.component';
import {
  MznSectionGroup,
  SectionGroupDirection,
} from './section-group.component';

@Component({
  standalone: true,
  imports: [MznSection, MznContentHeader],
  template: `
    <mzn-section>
      <mzn-content-header [title]="contentTitle" size="sub" />
      <p class="test-content">主要內容</p>
    </mzn-section>
  `,
})
class TestSectionHost {
  contentTitle = '區段標題';
}

@Component({
  standalone: true,
  imports: [MznSectionGroup, MznSection],
  template: `
    <mzn-section-group [direction]="direction">
      <mzn-section><p>區段一</p></mzn-section>
      <mzn-section><p>區段二</p></mzn-section>
    </mzn-section-group>
  `,
})
class TestSectionGroupHost {
  direction: SectionGroupDirection = 'vertical';
}

describe('MznSection', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestSectionHost],
    });
  });

  function createFixture(overrides: Partial<TestSectionHost> = {}): {
    fixture: ComponentFixture<TestSectionHost>;
    getEl: () => HTMLElement;
  } {
    const fixture = TestBed.createComponent(TestSectionHost);

    Object.assign(fixture.componentInstance, overrides);
    fixture.detectChanges();

    return {
      fixture,
      getEl: (): HTMLElement =>
        fixture.nativeElement.querySelector('mzn-section')!,
    };
  }

  it('should create', () => {
    const { getEl } = createFixture();

    expect(getEl()).toBeTruthy();
  });

  it('should apply host class', () => {
    const { getEl } = createFixture();

    expect(getEl().classList.contains('mzn-section')).toBe(true);
  });

  it('should render content-header slot', () => {
    const { getEl } = createFixture();

    expect(getEl().querySelector('mzn-content-header')).toBeTruthy();
  });

  it('should render main content inside content wrapper', () => {
    const { getEl } = createFixture();
    const contentWrapper = getEl().querySelector('.mzn-section__content');

    expect(contentWrapper).toBeTruthy();
    expect(contentWrapper!.querySelector('.test-content')).toBeTruthy();
  });
});

describe('MznSectionGroup', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestSectionGroupHost],
    });
  });

  function createFixture(overrides: Partial<TestSectionGroupHost> = {}): {
    fixture: ComponentFixture<TestSectionGroupHost>;
    getEl: () => HTMLElement;
  } {
    const fixture = TestBed.createComponent(TestSectionGroupHost);

    Object.assign(fixture.componentInstance, overrides);
    fixture.detectChanges();

    return {
      fixture,
      getEl: (): HTMLElement =>
        fixture.nativeElement.querySelector('mzn-section-group')!,
    };
  }

  it('should create', () => {
    const { getEl } = createFixture();

    expect(getEl()).toBeTruthy();
  });

  it('should apply host class', () => {
    const { getEl } = createFixture();

    expect(getEl().classList.contains('mzn-section-group')).toBe(true);
  });

  it('should not apply horizontal class by default', () => {
    const { getEl } = createFixture();

    expect(getEl().classList.contains('mzn-section-group--horizontal')).toBe(
      false,
    );
  });

  it('should apply horizontal class when direction is horizontal', () => {
    const { getEl } = createFixture({ direction: 'horizontal' });

    expect(getEl().classList.contains('mzn-section-group--horizontal')).toBe(
      true,
    );
  });

  it('should render children sections', () => {
    const { getEl } = createFixture();

    expect(getEl().querySelectorAll('mzn-section')).toHaveLength(2);
  });
});
