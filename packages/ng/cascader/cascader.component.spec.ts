import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { cascaderClasses as classes } from '@mezzanine-ui/core/cascader';

import { MznCascader } from './cascader.component';
import { CascaderOption } from './cascader-option';

const MOCK_OPTIONS: CascaderOption[] = [
  {
    id: '1',
    name: 'Option 1',
    children: [
      {
        id: '1-1',
        name: 'Option 1-1',
        children: [
          { id: '1-1-1', name: 'Option 1-1-1' },
          { id: '1-1-2', name: 'Option 1-1-2' },
        ],
      },
      { id: '1-2', name: 'Option 1-2' },
    ],
  },
  { id: '2', name: 'Option 2' },
  { id: '3', name: 'Option 3', disabled: true },
];

@Component({
  standalone: true,
  imports: [MznCascader],
  template: `
    <mzn-cascader
      [clearable]="clearable()"
      [disabled]="disabled()"
      [fullWidth]="fullWidth()"
      [globalPortal]="false"
      [options]="options()"
      [placeholder]="placeholder()"
      [value]="value()"
      (valueChange)="onValueChange($event)"
    />
  `,
})
class TestHostComponent {
  readonly clearable = signal(false);
  readonly disabled = signal(false);
  readonly fullWidth = signal(false);
  readonly options = signal<CascaderOption[]>(MOCK_OPTIONS);
  readonly placeholder = signal<string | undefined>(undefined);
  readonly value = signal<CascaderOption[] | undefined>(undefined);

  onValueChange = jest.fn();
}

function createFixture(): {
  fixture: ComponentFixture<TestHostComponent>;
  host: TestHostComponent;
  getHost: () => HTMLElement;
  getTrigger: () => HTMLElement;
  getPanels: () => HTMLElement | null;
  getPanelItems: (panelIndex: number) => NodeListOf<HTMLElement>;
} {
  const fixture = TestBed.createComponent(TestHostComponent);

  fixture.detectChanges();

  const host = fixture.componentInstance;

  return {
    fixture,
    host,
    getHost: (): HTMLElement =>
      fixture.nativeElement.querySelector(`.${classes.host}`)!,
    getTrigger: (): HTMLElement =>
      fixture.nativeElement.querySelector('mzn-select-trigger')!,
    getPanels: (): HTMLElement | null =>
      fixture.nativeElement.querySelector(`.${classes.dropdownPanels}`),
    getPanelItems: (panelIndex: number): NodeListOf<HTMLElement> => {
      const panels = fixture.nativeElement.querySelectorAll(
        `.${classes.panel}`,
      );

      return (
        panels[panelIndex]?.querySelectorAll(`.${classes.item}`) ??
        ([] as unknown as NodeListOf<HTMLElement>)
      );
    },
  };
}

describe('MznCascader', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();
  });

  it('should create with host class', () => {
    const { getHost } = createFixture();

    expect(getHost().classList.contains(classes.host)).toBe(true);
  });

  it('should render placeholder when no value', () => {
    const { host, fixture, getTrigger } = createFixture();

    host.placeholder.set('請選擇');
    fixture.detectChanges();

    expect(getTrigger().textContent).toContain('請選擇');
  });

  it('should display selected value path', () => {
    const { host, fixture, getTrigger } = createFixture();

    host.value.set([
      MOCK_OPTIONS[0],
      MOCK_OPTIONS[0].children![0],
      MOCK_OPTIONS[0].children![0].children![0],
    ]);
    fixture.detectChanges();

    expect(getTrigger().textContent).toContain(
      'Option 1 / Option 1-1 / Option 1-1-1',
    );
  });

  it('should open dropdown on click', () => {
    const { fixture, getTrigger, getPanels } = createFixture();

    expect(getPanels()).toBeNull();

    getTrigger().click();
    fixture.detectChanges();

    expect(getPanels()).not.toBeNull();
  });

  it('should render cascader panels', () => {
    const { fixture, getTrigger, getPanelItems } = createFixture();

    getTrigger().click();
    fixture.detectChanges();

    const items = getPanelItems(0);

    expect(items.length).toBe(MOCK_OPTIONS.length);
    expect(items[0].textContent).toContain('Option 1');
    expect(items[1].textContent).toContain('Option 2');
  });

  it('should select leaf option', () => {
    const { fixture, host, getTrigger, getPanelItems } = createFixture();

    getTrigger().click();
    fixture.detectChanges();

    // Click "Option 2" (leaf)
    getPanelItems(0)[1].click();
    fixture.detectChanges();

    expect(host.onValueChange).toHaveBeenCalledWith([MOCK_OPTIONS[1]]);
  });

  it('should expand non-leaf option', () => {
    const { fixture, getTrigger, getPanelItems } = createFixture();

    getTrigger().click();
    fixture.detectChanges();

    // Click "Option 1" (has children)
    getPanelItems(0)[0].click();
    fixture.detectChanges();

    const secondPanelItems = getPanelItems(1);

    expect(secondPanelItems.length).toBe(2);
    expect(secondPanelItems[0].textContent).toContain('Option 1-1');
    expect(secondPanelItems[1].textContent).toContain('Option 1-2');
  });

  it('should apply fullWidth class', () => {
    const { host, fixture, getHost } = createFixture();

    expect(getHost().classList.contains(classes.hostFullWidth)).toBe(false);

    host.fullWidth.set(true);
    fixture.detectChanges();

    expect(getHost().classList.contains(classes.hostFullWidth)).toBe(true);
  });

  it('should apply disabled state', () => {
    const { host, fixture, getTrigger, getPanels } = createFixture();

    host.disabled.set(true);
    fixture.detectChanges();

    getTrigger().click();
    fixture.detectChanges();

    expect(getPanels()).toBeNull();
  });

  it('should close dropdown after selecting a leaf option', () => {
    const { fixture, getTrigger, getPanelItems, getPanels } = createFixture();

    getTrigger().click();
    fixture.detectChanges();

    getPanelItems(0)[1].click();
    fixture.detectChanges();

    expect(getPanels()).toBeNull();
  });
});
