import { CommonModule } from '@angular/common';
import {
  configure,
  fireEvent,
  render,
} from '@testing-library/angular';
import { MznTabsComponent, MznTabComponent, MznTabBodyComponent } from '.';

configure({
  defaultImports: [
    CommonModule,
  ],
});

describe('MznTabsComponent', () => {
  it('should bind host class', async () => {
    const result = await render(MznTabsComponent, {
      declarations: [
        MznTabComponent,
        MznTabBodyComponent,
      ],
      template: `
        <mzn-tabs></mzn-tabs>
      `,
    });

    const element = result.container.firstElementChild as HTMLElement;

    expect(element.classList.contains('mzn-tabs')).toBeTruthy();
  });

  describe('output: selectChange', () => {
    it('should be fired when tab clicked', async () => {
      const selectChange = jest.fn();
      const result = await render(MznTabsComponent, {
        declarations: [
          MznTabComponent,
          MznTabBodyComponent,
        ],
        template: `
          <mzn-tabs
            (selectChange)="selectChange()">
            <mzn-tab title="tab">
              tabPane
            </mzn-tab>
          </mzn-tabs>
        `,
        componentProperties: {
          selectChange,
        },
      });

      const element = result.container.firstElementChild as HTMLElement;
      const { firstElementChild: tabBarElement } = element;
      const { firstElementChild: tabElement } = tabBarElement!;

      fireEvent.click(tabElement!);

      expect(selectChange).toBeCalledTimes(1);
    });
  });

  describe('ngModal: selectedIndex', () => {
    it('should activate the tab which selectedIndex=tab index', async () => {
      const selectedIndex = 0;

      const result = await render(MznTabsComponent, {
        declarations: [
          MznTabComponent,
          MznTabBodyComponent,
        ],
        template: `
          <mzn-tabs [selectedIndex]="selectedIndex">
            <mzn-tab title="tab0">tabPane0</mzn-tab>
            <mzn-tab title="tab1">tabPane1</mzn-tab>
          </mzn-tabs>
        `,
        componentProperties: {
          selectedIndex,
        },
      });

      const element = result.container.firstElementChild as HTMLElement;

      const { firstElementChild: tabBarElement } = element;

      const { firstElementChild: activeTabElement } = tabBarElement!;

      expect(activeTabElement!.classList.contains('mzn-tabs__tab--active'));
    });

    it('should fire onChange while inactive tab clicked', async () => {
      const selectedIndex = 1;
      const selectedIndexChange = jest.fn();

      const result = await render(MznTabsComponent, {
        declarations: [
          MznTabComponent,
          MznTabBodyComponent,
        ],
        template: `
          <mzn-tabs [selectedIndex]="selectedIndex" (selectedIndexChange)="selectedIndexChange()">
            <mzn-tab title="tab0">tabPane0</mzn-tab>
            <mzn-tab title="tab1">tabPane1</mzn-tab>
          </mzn-tabs>
        `,
        componentProperties: {
          selectedIndex,
          selectedIndexChange,
        },
      });

      const element = result.container.firstElementChild as HTMLElement;

      const { firstElementChild: tabBarElement } = element;

      const inactiveTabElement = tabBarElement!.getElementsByTagName('button')[0];

      fireEvent.click(inactiveTabElement!);

      expect(selectedIndexChange).toBeCalledTimes(1);
    });
  });

  describe('element structure', () => {
    it('should extract tab title to tab bar and render active content', async () => {
      const selectedIndex = 1;

      const result = await render(MznTabsComponent, {
        declarations: [
          MznTabComponent,
          MznTabBodyComponent,
        ],
        template: `
          <mzn-tabs [selectedIndex]="selectedIndex">
            <mzn-tab title="tab0">tabPane0</mzn-tab>
            <mzn-tab title="tab1">tabPane1</mzn-tab>
          </mzn-tabs>
        `,
        componentProperties: {
          selectedIndex,
        },
      });

      const element = result.container.firstElementChild as HTMLElement;

      const {
        firstElementChild: tabBarElement,
        lastElementChild: tabPaneElement,
        childElementCount,
      } = element;

      expect(childElementCount).toBe(3);
      expect(tabBarElement!.classList.contains('mzn-tabs__tab-bar')).toBeTruthy();

      [...tabBarElement!.children].forEach((child, index) => {
        expect(child.classList.contains('mzn-tabs__tab')).toBeTruthy();
        expect(child.textContent).toBe(`tab${index}`);
      });

      expect(tabPaneElement!.classList.contains('mzn-tabs__pane')).toBeTruthy();
      expect(tabPaneElement!.textContent).toBe('tabPane1');
    });

    describe('tab bar', () => {
      it('should bind tab bar class', async () => {
        const result = await render(MznTabsComponent, {
          declarations: [
            MznTabComponent,
            MznTabBodyComponent,
          ],
          template: `
              <mzn-tabs>
                <mzn-tab title="tab0">
                  tabPane0
                </mzn-tab>
              </mzn-tabs>
            `,
        });

        const element = result.container.firstElementChild as HTMLElement;

        const { firstElementChild: tabBarElement } = element;

        expect(tabBarElement!.classList.contains('mzn-tabs__tab-bar')).toBeTruthy();
      });
    });

    describe('tab pane', () => {
      it('should bind tab pane class', async () => {
        const result = await render(MznTabsComponent, {
          declarations: [
            MznTabComponent,
            MznTabBodyComponent,
          ],
          template: `
              <mzn-tabs>
                <mzn-tab title="tab">
                  tabPane
                </mzn-tab>
              </mzn-tabs>
            `,
        });

        const element = result.container.firstElementChild as HTMLElement;

        const { lastElementChild: tabPaneElement } = element;

        expect(tabPaneElement!.classList.contains('mzn-tabs__pane')).toBeTruthy();
      });

      it('should wrap tab pane by div', async () => {
        const result = await render(MznTabsComponent, {
          declarations: [
            MznTabComponent,
            MznTabBodyComponent,
          ],
          template: `
            <mzn-tabs>
              <mzn-tab title="tab">tabPane</mzn-tab>
            </mzn-tabs>
          `,
        });

        const element = result.container.firstElementChild as HTMLElement;

        const { lastElementChild: tabPaneElement } = element;

        expect(tabPaneElement!.tagName.toLowerCase()).toBe('div');
        expect(tabPaneElement!.textContent).toBe('tabPane');
      });
    });
  });
});
