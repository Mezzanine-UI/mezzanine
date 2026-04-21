import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MznBaseCard } from './base-card.component';
import { MznQuickActionCard } from './quick-action-card.component';
import { MznCardGroup, CardGroupType } from './card-group.component';

@Component({
  standalone: true,
  imports: [MznBaseCard],
  template: `
    <mzn-base-card
      [title]="title"
      [description]="description"
      [disabled]="disabled"
      [readOnly]="readOnly"
    >
      <button header-action>操作</button>
      <p>卡片內容</p>
    </mzn-base-card>
  `,
})
class TestBaseCardHost {
  description?: string;
  disabled = false;
  readOnly = false;
  title?: string;
}

@Component({
  standalone: true,
  imports: [MznQuickActionCard],
  template: `
    <mzn-quick-action-card
      [title]="title"
      [subtitle]="subtitle"
      [disabled]="disabled"
      [mode]="mode"
    />
  `,
})
class TestQuickActionHost {
  disabled = false;
  mode: 'horizontal' | 'vertical' = 'horizontal';
  subtitle?: string;
  title = '快速操作';
}

@Component({
  standalone: true,
  imports: [MznCardGroup, MznBaseCard],
  template: `
    <mzn-card-group [cardType]="cardType">
      <mzn-base-card title="A">內容</mzn-base-card>
      <mzn-base-card title="B">內容</mzn-base-card>
    </mzn-card-group>
  `,
})
class TestCardGroupHost {
  cardType: CardGroupType = 'base';
}

describe('MznBaseCard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestBaseCardHost],
    });
  });

  function createFixture(overrides: Partial<TestBaseCardHost> = {}): {
    fixture: ComponentFixture<TestBaseCardHost>;
    getEl: () => HTMLElement;
  } {
    const fixture = TestBed.createComponent(TestBaseCardHost);

    Object.assign(fixture.componentInstance, overrides);
    fixture.detectChanges();

    return {
      fixture,
      getEl: (): HTMLElement =>
        fixture.nativeElement.querySelector('mzn-base-card')!,
    };
  }

  it('should create', () => {
    const { getEl } = createFixture();

    expect(getEl()).toBeTruthy();
    expect(getEl().classList.contains('mzn-base-card')).toBe(true);
  });

  it('should render title and description', () => {
    const { getEl } = createFixture({
      title: '測試標題',
      description: '描述文字',
    });

    expect(getEl().textContent).toContain('測試標題');
    expect(getEl().textContent).toContain('描述文字');
  });

  it('should not render header when no title/description', () => {
    const { getEl } = createFixture();

    expect(getEl().querySelector('.mzn-base-card__header')).toBeNull();
  });

  it('should render content', () => {
    const { getEl } = createFixture();

    expect(getEl().textContent).toContain('卡片內容');
  });

  it('should apply disabled class and aria', () => {
    const { getEl } = createFixture({ disabled: true });

    expect(getEl().classList.contains('mzn-base-card--disabled')).toBe(true);
    expect(getEl().getAttribute('aria-disabled')).toBe('true');
  });

  it('should apply read-only class and aria', () => {
    const { getEl } = createFixture({ readOnly: true });

    expect(getEl().classList.contains('mzn-base-card--read-only')).toBe(true);
    expect(getEl().getAttribute('aria-readonly')).toBe('true');
  });

  it('should project header-action slot', () => {
    const { getEl } = createFixture({ title: '標題' });

    expect(getEl().querySelector('button')?.textContent).toContain('操作');
  });
});

describe('MznQuickActionCard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestQuickActionHost],
    });
  });

  function createFixture(overrides: Partial<TestQuickActionHost> = {}): {
    fixture: ComponentFixture<TestQuickActionHost>;
    getEl: () => HTMLElement;
  } {
    const fixture = TestBed.createComponent(TestQuickActionHost);

    Object.assign(fixture.componentInstance, overrides);
    fixture.detectChanges();

    return {
      fixture,
      getEl: (): HTMLElement =>
        fixture.nativeElement.querySelector('mzn-quick-action-card')!,
    };
  }

  it('should create', () => {
    const { getEl } = createFixture();

    expect(getEl()).toBeTruthy();
    expect(getEl().classList.contains('mzn-quick-action-card')).toBe(true);
  });

  it('should render title', () => {
    const { getEl } = createFixture();

    expect(getEl().textContent).toContain('快速操作');
  });

  it('should render subtitle', () => {
    const { getEl } = createFixture({ subtitle: '副標題' });

    expect(getEl().textContent).toContain('副標題');
  });

  it('should apply vertical mode class', () => {
    const { getEl } = createFixture({ mode: 'vertical' });

    expect(getEl().classList.contains('mzn-quick-action-card--vertical')).toBe(
      true,
    );
  });

  it('should apply disabled class', () => {
    const { getEl } = createFixture({ disabled: true });

    expect(getEl().classList.contains('mzn-quick-action-card--disabled')).toBe(
      true,
    );
  });
});

describe('MznCardGroup', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestCardGroupHost],
    });
  });

  function createFixture(overrides: Partial<TestCardGroupHost> = {}): {
    fixture: ComponentFixture<TestCardGroupHost>;
    getEl: () => HTMLElement;
  } {
    const fixture = TestBed.createComponent(TestCardGroupHost);

    Object.assign(fixture.componentInstance, overrides);
    fixture.detectChanges();

    return {
      fixture,
      getEl: (): HTMLElement =>
        fixture.nativeElement.querySelector('mzn-card-group')!,
    };
  }

  it('should create group', () => {
    const { getEl } = createFixture();

    expect(getEl().classList.contains('mzn-card-group')).toBe(true);
  });

  it('should apply quick-action modifier', () => {
    const { getEl } = createFixture({ cardType: 'quick-action' });

    expect(getEl().classList.contains('mzn-card-group--quick-action')).toBe(
      true,
    );
  });

  it('should render children', () => {
    const { getEl } = createFixture();

    expect(getEl().querySelectorAll('mzn-base-card')).toHaveLength(2);
  });
});
