import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { MznButton } from '../button/button.directive';
import { MznPageFooter } from './page-footer.component';

@Component({
  standalone: true,
  imports: [MznPageFooter, MznButton],
  template: `
    <mzn-page-footer
      type="standard"
      supportingActionName="查看紀錄"
      warningMessage="部分內容未通過驗證"
    >
      <div actions>
        <button mznButton variant="base-secondary">取消</button>
        <button mznButton variant="base-primary">儲存</button>
      </div>
    </mzn-page-footer>
  `,
})
class StandardTypeHost {}

@Component({
  standalone: true,
  imports: [MznPageFooter, MznButton],
  template: `
    <mzn-page-footer
      type="information"
      annotation="發佈後將無法編輯，請確認內容無誤"
    >
      <div actions>
        <button mznButton variant="base-primary">發佈</button>
      </div>
    </mzn-page-footer>
  `,
})
class InformationTypeHost {}

@Component({
  standalone: true,
  imports: [MznPageFooter, MznButton],
  template: `
    <mzn-page-footer type="overflow">
      <div actions>
        <button mznButton variant="base-primary">儲存</button>
      </div>
    </mzn-page-footer>
  `,
})
class OverflowTypeHost {}

describe('MznPageFooter', () => {
  describe('standard type', () => {
    let fixture: ComponentFixture<StandardTypeHost>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [StandardTypeHost],
      }).compileComponents();

      fixture = TestBed.createComponent(StandardTypeHost);
      fixture.detectChanges();
    });

    it('should render with host class', () => {
      const el = fixture.nativeElement.querySelector('mzn-page-footer');

      expect(el).toBeTruthy();
      expect(el.classList.contains('mzn-page-footer')).toBe(true);
    });

    it('should render supporting action button with given name', () => {
      const btn = fixture.nativeElement.querySelector('button[mznButton]');

      expect(btn?.textContent?.trim()).toContain('查看紀錄');
    });

    it('should render warning message', () => {
      const el = fixture.nativeElement.querySelector('mzn-page-footer');
      const messageDiv = el.querySelector('.mzn-page-footer__message');

      expect(messageDiv?.textContent?.trim()).toContain('部分內容未通過驗證');
    });

    it('should project action buttons', () => {
      const actions = fixture.nativeElement.querySelector('[actions]');

      expect(actions?.textContent).toContain('取消');
      expect(actions?.textContent).toContain('儲存');
    });
  });

  describe('information type', () => {
    let fixture: ComponentFixture<InformationTypeHost>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [InformationTypeHost],
      }).compileComponents();

      fixture = TestBed.createComponent(InformationTypeHost);
      fixture.detectChanges();
    });

    it('should render annotation text', () => {
      const annotationDiv = fixture.nativeElement.querySelector(
        '.mzn-page-footer__annotation',
      );

      expect(annotationDiv?.textContent?.trim()).toContain(
        '發佈後將無法編輯，請確認內容無誤',
      );
    });
  });

  describe('overflow type', () => {
    let fixture: ComponentFixture<OverflowTypeHost>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [OverflowTypeHost],
      }).compileComponents();

      fixture = TestBed.createComponent(OverflowTypeHost);
      fixture.detectChanges();
    });

    it('should render icon-only button in annotation area', () => {
      const annotationDiv = fixture.nativeElement.querySelector(
        '.mzn-page-footer__annotation',
      );
      const btn = annotationDiv?.querySelector('button[mznButton]');

      expect(btn).toBeTruthy();
    });
  });
});
