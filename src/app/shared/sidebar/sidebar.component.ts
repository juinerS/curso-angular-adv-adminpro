import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { UserService } from '../../services/user.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit {

  public user: User;
  public menuItem: any[];

  constructor( private sidebarService: SidebarService, private userService: UserService ) {
    this.menuItem = sidebarService.menu;
    this.user = userService.user;
  }

  ngOnInit(): void {
  }

}
