import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../services/account.service';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
	model: any = {};
	@Output() cancelRegister: EventEmitter<boolean> = new EventEmitter();

	constructor(private accountService: AccountService, private toastr: ToastrService) {}

	ngOnInit(): void {}

	Register() {
		console.log(this.model);
		this.accountService.Register(this.model).subscribe(
			(response) => {
				console.log(response);
				this.Cancel();
			},
			(error) => {
				console.log(error.error);
				this.toastr.error(error.error);
			}
		);
	}

	Cancel() {
		this.cancelRegister.emit(false);
	}
}
