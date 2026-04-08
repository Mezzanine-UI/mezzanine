import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MznTabs } from './tabs.component';
import { MznTabItem } from './tab-item.component';

@Component({
  standalone: true,
  imports: [MznTabs, MznTabItem],
  template: `
    <mzn-tabs [activeKey]="activeKey" (activeKeyChange)="activeKey = $event">
      <mzn-tab-item [key]="0">Tab 1</mzn-tab-item>
      <mzn-tab-item [key]="1">Tab 2</mzn-tab-item>
      <mzn-tab-item [key]="2" [disabled]="true">Tab 3</mzn-tab-item>
    </mzn-tabs>
  `,
})
class TestHostComponent {
  activeKey: string | number = 0;
}

@Component({
  standalone: true,
  imports: [MznTabs, MznTabItem],
  template: `
    <mzn-tabs [defaultActiveKey]="1">
      <mzn-tab-item [key]="0">Tab 1</mzn-tab-item>
      <mzn-tab-item [key]="1">Tab 2</mzn-tab-item>
      <mzn-tab-item [key]="2">Tab 3</mzn-tab-item>
    </mzn-tabs>
  `,
})
class UncontrolledTestHostComponent {}

function createFixture(): {
  fixture: ReturnType<typeof TestBed.createComponent<TestHostComponent>>;
  host: TestHostComponent;
} {
  const fixture = TestBed.createComponent(TestHostComponent);

  fixture.detectChanges();

  return { fixture, host: fixture.componentInstance };
}

describe('MznTabs', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent, UncontrolledTestHostComponent],
    });
  });

  it('should render tabs', () => {
    const { fixture } = createFixture();
    const tabs = fixture.nativeElement.querySelectorAll('button');

    expect(tabs.length).toBe(3);
  });

  it('should render tab labels', () => {
    const { fixture } = createFixture();
    const text = fixture.nativeElement.textContent;

    expect(text).toContain('Tab 1');
    expect(text).toContain('Tab 2');
  });

  it('should mark active tab', () => {
    const { fixture } = createFixture();
    const buttons = fixture.nativeElement.querySelectorAll('button');

    expect(buttons[0].classList.contains('mzn-tab__item--active')).toBe(true);
    expect(buttons[1].classList.contains('mzn-tab__item--active')).toBe(false);
  });

  it('should render active bar', () => {
    const { fixture } = createFixture();
    const bar = fixture.nativeElement.querySelector('.mzn-tab__active-bar');

    expect(bar).toBeTruthy();
  });

  it('should apply horizontal class by default', () => {
    const { fixture } = createFixture();
    const host = fixture.nativeElement.querySelector('.mzn-tab');

    expect(host.classList.contains('mzn-tab--horizontal')).toBe(true);
  });

  it('should disable tab 3', () => {
    const { fixture } = createFixture();
    const buttons = fixture.nativeElement.querySelectorAll(
      'button',
    ) as NodeListOf<HTMLButtonElement>;

    expect(buttons[2].disabled).toBe(true);
  });

  it('should support uncontrolled mode with defaultActiveKey', () => {
    const fixture = TestBed.createComponent(UncontrolledTestHostComponent);

    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('button');

    expect(buttons[1].classList.contains('mzn-tab__item--active')).toBe(true);
    expect(buttons[0].classList.contains('mzn-tab__item--active')).toBe(false);
  });
});
