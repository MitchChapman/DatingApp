import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'The Dating App';
  users: any;

  constructor(private httpClient: HttpClient) {}

  ngOnInit() {
    this.GetUsers();
  }

  GetUsers() {
    this.httpClient.get(
      'https://localhost:5001/api/users'
    ).subscribe(
      (response) => {
        this.users = response;
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}