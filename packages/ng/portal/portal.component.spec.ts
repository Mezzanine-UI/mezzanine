import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MznPortal } from './portal.component';
import { MznPortalRegistry } from './portal-registry.service';

@Component({
  standalone: true,
  imports: [MznPortal],
  template: `
    <mzn-portal
      [disablePortal]="disablePortal"
      [layer]="layer"
      [container]="container"
    >
      <div class="portal-content">Portal Content</div>
    </mzn-portal>
  `,
})
class TestHostComponent {
  disablePortal = false;
  layer: 'default' | 'alert' = 'default';
  container?: HTMLElement;
}

function createFixture(overrides: Partial<TestHostComponent> = {}): {
  fixture: ReturnType<typeof TestBed.createComponent<TestHostComponent>>;
  host: TestHostComponent;
} {
  const fixture = TestBed.createComponent(TestHostComponent);
  const host = fixture.componentInstance;

  Object.assign(host, overrides);
  fixture.detectChanges();

  return { fixture, host };
}

describe('MznPortal', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
    });
  });

  afterEach(() => {
    document.getElementById('mzn-portal-container')?.remove();
    document.getElementById('mzn-alert-container')?.remove();
  });

  it('should portal content to the default container', () => {
    createFixture();

    const portalContainer = document.getElementById('mzn-portal-container');

    expect(portalContainer).toBeTruthy();
    expect(portalContainer?.querySelector('.portal-content')).toBeTruthy();
  });

  it('should portal content to the alert container', () => {
    createFixture({ layer: 'alert' });

    const alertContainer = document.getElementById('mzn-alert-container');

    expect(alertContainer).toBeTruthy();
    expect(alertContainer?.querySelector('.portal-content')).toBeTruthy();
  });

  it('should render content in place when disablePortal is true', () => {
    const { fixture } = createFixture({ disablePortal: true });

    expect(fixture.nativeElement.querySelector('.portal-content')).toBeTruthy();
  });

  it('should portal to a custom container', () => {
    const customContainer = document.createElement('div');

    document.body.appendChild(customContainer);

    createFixture({ container: customContainer });

    expect(customContainer.querySelector('.portal-content')).toBeTruthy();

    customContainer.remove();
  });

  it('should clean up on destroy', () => {
    const { fixture } = createFixture();

    expect(
      document
        .getElementById('mzn-portal-container')
        ?.querySelector('.portal-content'),
    ).toBeTruthy();

    fixture.destroy();

    expect(
      document
        .getElementById('mzn-portal-container')
        ?.querySelector('.portal-content'),
    ).toBeFalsy();
  });
});

describe('MznPortalRegistry', () => {
  let registry: MznPortalRegistry;

  beforeEach(() => {
    registry = TestBed.inject(MznPortalRegistry);
  });

  afterEach(() => {
    document.getElementById('mzn-portal-container')?.remove();
    document.getElementById('mzn-alert-container')?.remove();
  });

  it('should create default container', () => {
    const container = registry.getContainer('default');

    expect(container).toBeTruthy();
    expect(container.id).toBe('mzn-portal-container');
  });

  it('should create alert container', () => {
    const container = registry.getContainer('alert');

    expect(container).toBeTruthy();
    expect(container.id).toBe('mzn-alert-container');
  });

  it('should return the same container on subsequent calls', () => {
    const first = registry.getContainer('default');
    const second = registry.getContainer('default');

    expect(first).toBe(second);
  });
});
