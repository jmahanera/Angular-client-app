import { Injectable } from '@angular/core';
import { FetchApiDataService } from './fetch-api-data.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private movies: any[] = [];
  private user: any = {};
  private currentMovies: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(
    []
  );
  public currentMovies$: Observable<any[]> = this.currentMovies.asObservable();

  constructor(private fetchApiDataService: FetchApiDataService) {
    this.signin();
  }

  signin(): void {
    const userString = localStorage.getItem('user');
    if (userString) {
      this.user = JSON.parse(userString);
    }
  }

  hasUser(): boolean {
    return Object.keys(this.user).length > 0;
  }

  signout(): void {
    this.user = {};
    localStorage.clear();
  }

  setMovies(data: any[]): void {
    this.movies = data;
    this.currentMovies.next(data);
  }

  getMovies(): any[] {
    return this.movies;
  }

  setUser(data: any): void {
    this.user = data;
  }

  getUser(): any {
    return this.user;
  }

  getFavoriteMovies(): any[] {
    return this.user.favoriteMovies;
  }

  addFavoriteMovie(id: string): void {
    // Ensure that user._id is defined
    if (!this.user._id) {
      console.error('User ID is undefined. Unable to add favorite movie.');
      return;
    }

    // Ensure that id is a valid movie ID
    if (!id) {
      console.error('Invalid movie ID. Unable to add favorite movie.');
      return;
    }

    // Add the movie ID to the user's favorites
    this.user.favoriteMovies.push(id);

    // Make the API call to add the favorite movie
    this.fetchApiDataService.addFavoriteMovie(this.user.username, id).subscribe(
      (response) => {
        this.user = response;
        localStorage.setItem('user', JSON.stringify(response));
        console.log('Favorite movie added successfully:', response);
      },
      (error) => {
        console.error('Error adding favorite: ', error);
      }
    );
  }

  removeFavoriteMovie(movie_id: string): void {
    const index = this.user.favoriteMovies.indexOf(movie_id);
    this.user.favoriteMovies.splice(index, 1);

    this.fetchApiDataService.deleteFavoriteMovie(this.user.username, movie_id).subscribe(
      (response) => {
        this.user = response;
        localStorage.setItem('user', JSON.stringify(response));
      },
      (error) => {
        console.error('Error removing favorite: ', error);
      }
    );
  }

  filteredMovies(field: string, value: string): any[] {
    const movies = this.getMovies();

    switch (field) {
      case 'director':
        return movies.filter((movie) => movie.director?.name === value);
      case 'genre':
        return movies.filter((movie) => movie.genre?.name === value);
      case 'favoriteMovies':
        return movies.filter((movie) =>
          this.user.favoriteMovies?.includes(movie._id)
        );
      case 'navSearch': {
        const searchValue = value.toLowerCase();

        const newFavMovies = movies.filter(
          (movie) =>
            movie.genre?.name.toLowerCase().includes(searchValue) ||
            movie.director?.name.toLowerCase().includes(searchValue) ||
            movie.title.toLowerCase().includes(searchValue)
        );

        this.currentMovies.next(newFavMovies);
        return newFavMovies;
      }
      default:
        break;
    }

    return [];
  }
}
