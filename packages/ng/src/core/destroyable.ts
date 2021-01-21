import { OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

export abstract class Destroyable implements OnDestroy {
  protected destroy$ = new Subject<void>();

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
