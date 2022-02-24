import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import { ToastrService } from 'ngx-toastr';

@Component({
	selector: 'app-navigation',
	templateUrl: './navigation.component.html',
	styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit {

  model: any = {};

	constructor(public accountService: AccountService, private router: Router) {}

	ngOnInit(): void {
  }

  Login() {
    this.accountService.Login(this.model).subscribe(
      (response) => {
        this.router.navigate(['members']);
      }
    );
  }

  Logout() {
    this.accountService.Logout();
    this.router.navigate(['/']);
  }
}
