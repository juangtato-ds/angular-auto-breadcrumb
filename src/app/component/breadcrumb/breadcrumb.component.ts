import { Component, OnDestroy, OnInit } from '@angular/core';
import { distinctUntilChanged, filter, Subscription } from 'rxjs';
import { BreadcrumbDynamicLabel, BreadCrumbItem, BreadcrumbRouteConfig } from './breadcrumb.api';
import { BreadcrumbService } from './breadcrumb.service';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

// TODO this can be moved to other place
class ObjectUtils {

  static isNotNullOrUndefined(o: any): boolean {
    return o !== null && o !== undefined;
  }

  static get<T>(data: any, path: string): T | undefined {
    const result = path.split('.').reduce(ObjectUtils.reduceFunction, data);
    return !!result ? result as T : undefined;
  }

  private static reduceFunction(o: any, currentValue: string) {
    return o && ObjectUtils.isNotNullOrUndefined(o[currentValue]) ? o[currentValue] : undefined;
  }
}

// TODO this can be moved to other place
class StringUtils {
  static isEmpty(value: string | undefined | null) {
    if (ObjectUtils.isNotNullOrUndefined(value)) {
      return (value as string).length === 0;
    }
    return true;
  }

  static isNotEmpty(value: string | undefined | null) {
    return !StringUtils.isEmpty(value);
  }

  static isBlank(value: string | undefined | null) {
    if (ObjectUtils.isNotNullOrUndefined(value)) {
      return (value as string).replace(/\s/g, '').length === 0;
    }
    return true;
  }

  static isNotBlank(value: string | undefined | null) {
    return !StringUtils.isBlank(value);
  }


}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss'
})
export class BreadcrumbComponent implements OnInit, OnDestroy {

  private routerSubscription: Subscription;
  private dynamicCodeSubscription: Subscription;

  breadcrumbList?: Array<BreadCrumbItem>;

  constructor(
    protected breadcrumbService: BreadcrumbService,
    protected router: Router,
    protected activatedRoute: ActivatedRoute
  ) {
    // Subscribe to all navigation end events
    this.routerSubscription = this.router.events
      .pipe(filter(
        event => event instanceof NavigationEnd),
        distinctUntilChanged()
      )
      .subscribe(() => this.refreshBreadCrumb(this.activatedRoute.root));

    // Dynamic code updates re
    this.dynamicCodeSubscription = this.breadcrumbService.dynamicCodeNotifications().subscribe(
      dynamicInfo => this.updateLabelDeferred(dynamicInfo)
    );
  }

  ngOnInit(): void {
    this.refreshBreadCrumb(this.activatedRoute.root);
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }

    if (this.dynamicCodeSubscription) {
      this.dynamicCodeSubscription.unsubscribe();
    }
  }

  private updateLabelDeferred(dynamicLabel: BreadcrumbDynamicLabel): void {
    if (this.breadcrumbList) {
      for (const crumb of this.breadcrumbList) {
        if (crumb.dynamicCode === dynamicLabel.dynamicCode) {
          if (dynamicLabel.label !== '') {
            crumb.label = dynamicLabel.label;
          } else {
            crumb.label = crumb.defaultLabel;
          }
          break;
        }
      }
    }
  }

  /**
   * Updated breadcrumb item list from the current activated route
   * @param route activated route
   */
  private refreshBreadCrumb(route: ActivatedRoute) {
    this.breadcrumbList = new Array<BreadCrumbItem>();
    this.checkMenuRequest();
    this.buildBreadCrumb(route);
  }

  /**
   * Checks if the request is from a menu.
   * In this case, cached dynamic code messages are purged
   */
  private checkMenuRequest(): void {
    // TODO revisar esto para mejora, buscar mejor forma que pasando un parámetro
    if (this.activatedRoute.snapshot.queryParamMap.has('menu')) {
      this.breadcrumbService.purgeDynamicLabels();
    }
  }

  /**
   * Text for initial label (home label)
   */
  protected getHomeLabel(): string {
    // TODO this can be moved to configuration.
    return 'Home';
  }

  /**
   * Builds breadcrumb information from an activated route.
   * This works recursively through out all first child
   * @param route activated route
   * @param url base url
   */
  private buildBreadCrumb(route: ActivatedRoute, url: string = ''): void {
    if (route.outlet === 'primary' && this.breadcrumbList) {
      const routeConfig: BreadcrumbRouteConfig | undefined = ObjectUtils.get<BreadcrumbRouteConfig>(route, 'routeConfig.data.breadcrumb');
      // If no routeConfig is avalailable and url = '' we are on the root path

      let label = StringUtils.isBlank(url) && this.breadcrumbList.length === 0 ? this.getHomeLabel() : null;
      let dynamicCode: string | undefined = undefined;
      let nolinkData = false;

      if (routeConfig) {
        label = routeConfig.label;
        dynamicCode = routeConfig.dynamicCode;
        nolinkData = routeConfig.nolink || false;
      }

      let path = route.routeConfig ? route.routeConfig.path : '';

      if (path) {
        path = this.fillPathParams(route, path);
      }

      let nextUrl = `${url}`;
      if (label !== null) {
        // In the routeConfig the complete path is not available,
        // so we rebuild it each time
        if (StringUtils.isNotEmpty(path)) {
          nextUrl = `${url}${path}/`;
        }
        const breadcrumb: BreadCrumbItem = {
          defaultLabel: label,
          label: this.getLabel(label, dynamicCode),
          dynamicCode,
          url: nextUrl,
          nolink: nolinkData
        };

        this.breadcrumbList.push(breadcrumb);
      } else if (StringUtils.isNotBlank(path)) {
        nextUrl = `${url}${path}/`;
      }

      if (route.firstChild) {
        // If we are not on our current path yet,
        // there will be more children to look after, to build our breadcumb
        this.buildBreadCrumb(route.firstChild, nextUrl);
      }
    }
  }

  fillPathParams(route: ActivatedRoute, path: string): string {
    const regex = /:(\w*)/g;

    return path.replace(regex, (substring: string, param: string) => {
      const value = ObjectUtils.get<string>(route, `snapshot.paramMap.params.${param}`);
      return (value) ? value : substring;
    });
  }

  private getLabel(label: string, dynamicCode?: string): string {
    let currentLabel = label;
    if (dynamicCode) {
      const dynamicLabel = this.breadcrumbService.getDynamicLabel(dynamicCode);
      if (dynamicLabel) {
        currentLabel = dynamicLabel;
      }
    }
    return currentLabel;
  }
}
