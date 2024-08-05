import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BreadcrumbService } from '../../../../component/breadcrumb/breadcrumb.service';

@Component({
  selector: 'app-integration-detail-page',
  standalone: true,
  imports: [],
  templateUrl: './integration-detail-page.component.html',
  styleUrl: './integration-detail-page.component.scss'
})
export class IntegrationDetailPageComponent implements OnDestroy {

  static readonly TARGET = 'integrationTarget';
  static readonly BC_TARGET = 'intTarget';

  private subscription: Subscription;
  private validTargets = new Set<string>(['gcp', 'aws', 'azure']);

  integrationTarget!: string;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService
  ) {
    this.subscription = this.activatedRoute.paramMap.subscribe(
      m => this.updateIntegrationTarget(m.get(IntegrationDetailPageComponent.TARGET) || undefined)
    )
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private updateIntegrationTarget(target?: string): void {
    if (target && this.validTargets.has(target)) {
      this.integrationTarget = target.toUpperCase();
      this.breadcrumbService.updateDynamicLabel(IntegrationDetailPageComponent.BC_TARGET, this.integrationTarget);
    } else {
      alert('Invalid target');
      console.error('Invalid target: ' + target);
      this.router.navigate(['..'], { relativeTo: this.activatedRoute });
    }

  }

}
