import { Component, OnInit, Input } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-user-profile',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss'],
})
export class UserProfileComponent implements OnInit {
  user: any = {};
  FavoriteMovies: any[] = [];

  @Input() userData = { username: '', password: '', email: '', birthdate: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    private router: Router,
    public dialog: MatDialog
  ) { }

  back(): void {
    // You can use the router to navigate back or implement your own logic
    this.router.navigate(['your-back-route']); // Replace 'your-back-route' with the actual route
  }

  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void {
    this.fetchApiData.getOneUser().subscribe((response: any) => {
      this.user = response;
      this.userData.username = this.user.username;
      this.userData.email = this.user.email;
      this.user.birth_date = formatDate(
        this.user.birth_date,
        'mm-dd-yyyy',
        'en-US',
        'UTC+0'
      );

      // Use user.favorite_movies directly instead of filtering movies
      this.FavoriteMovies = this.user.favorite_movies;
    });
  }

  updateUser(): void {
    this.fetchApiData.editUser(this.userData).subscribe(
      (data) => {
        localStorage.setItem('user', JSON.stringify(data));
        this.user = data;
        this.snackBar.open('Your profile has been updated', 'OK', {
          duration: 3000,
        });
        window.location.reload();
      },
      (result) => {
        this.snackBar.open('Something went wrong', 'OK', {
          duration: 3000,
        });
      }
    );
  }

  deleteUser(): void {
    if (confirm('Do you want to delete your account permanently?')) {
      this.router.navigate(['welcome']).then(() => {
        localStorage.clear();
        this.snackBar.open('Your account has been deleted', 'OK', {
          duration: 3000,
        });
      });
      this.fetchApiData.deleteOneUser().subscribe((result) => {
        console.log(result);
      });
    }
  }
}
