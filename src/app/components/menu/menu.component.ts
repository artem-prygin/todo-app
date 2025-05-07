import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { NgClass, NgForOf } from '@angular/common';
import { filter } from 'rxjs';

import { MenuItemInterface } from '../../interfaces/menu-item.interface';
import { RoutesConstants } from '../constants/routes.constants';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    RouterLink,
    NgForOf,
    NgClass,
  ],
  templateUrl: './menu.component.html',
})
export class MenuComponent {
  public router: Router = inject(Router);

  public activeRoute: string | null = null;
  public readonly menuList: MenuItemInterface[] = [
    { url: RoutesConstants.ADD, title: 'Add' },
    { url: RoutesConstants.LIST, title: 'List' },
    { url: RoutesConstants.FAVOURITE, title: 'Favourite' },
  ];

  constructor() {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
      ).subscribe(event => {
      this.activeRoute = (event as unknown as NavigationEnd).urlAfterRedirects.slice(1);
    });
  }
}
