import { Component, OnInit } from '@angular/core';
import { NavItem } from '../../../shared/interfaces/nav-item.interface';

@Component({
  selector: 'app-layout-page',
  templateUrl: './layout-page.component.html',
  styleUrl: './layout-page.component.css'
})
export class LayoutPageComponent {

  public navItems: NavItem[] = [
    { title: 'Clients', route: '/client/client-list' },
  ];

  constructor(

  ) {}




}
