import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { MznPageHeader } from './page-header.component';

@Component({
  standalone: true,
  imports: [MznPageHeader],
  template: `
    <div mznPageHeader>
      <nav>Breadcrumb here</nav>
      <div>Content header here</div>
    </div>
  `,
})
class TestHost {}

describe('MznPageHeader', () => {
  let fixture: ComponentFixture<TestHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
  });

  it('should render with host class', () => {
    const el = fixture.nativeElement.querySelector('[mznPageHeader]');
    expect(el).toBeTruthy();
    expect(el.classList.contains('mzn-page-header')).toBe(true);
  });

  it('should have banner role', () => {
    const el = fixture.nativeElement.querySelector('[mznPageHeader]');
    expect(el.getAttribute('role')).toBe('banner');
  });

  it('should project children', () => {
    const el = fixture.nativeElement.querySelector('[mznPageHeader]');
    expect(el.textContent).toContain('Breadcrumb here');
    expect(el.textContent).toContain('Content header here');
  });
});
