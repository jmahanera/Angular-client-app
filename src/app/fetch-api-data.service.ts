import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import mockdata from './mockdata';
import { DataService } from './data.service';

const apiUrl = 'https://primemovies-39075872fbeb.herokuapp.com/';

@Injectable({
  providedIn: 'root',
})
export class UserRegistrationService {
  constructor(private http: HttpClient, private dataService: DataService) {}

  private tokenHeader(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });
  }

  public editUser(user: any): Observable<any> {
    const userDetails = user.id;
    const apiUrl = `https://primemovies-39075872fbeb.herokuapp.com/users/${user}`;

    return this.http
      .put(apiUrl, userDetails, { headers: this.tokenHeader() })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Making the api call for the user registration endpoint
   * @param userDetails
   * @returns a user that has been registered in the DB
   * used in user-registration-form component
   */
  //Making api call for the user registration endpoint
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http
      .post(apiUrl + '/users', userDetails)
      .pipe(catchError(this.handleError));
  }

  /**
   * Making the api call to get a movie with the given title
   * @param title
   * @returns movie details from db
   */
  // Making api call in order to get one movie with its title
  public getOneMovie(title: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + '/movies/' + title, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Making the api call to delete the movie from favouriteList of the user
   * @param movieId
   * @returns updated user object
   */
  // Making api call in order to delete given movie from  users favouritelist
  public deleteFromFavourite(movieId: string): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '');
    const token = localStorage.getItem('token');
    return this.http
      .delete(apiUrl + '/users/' + user.username + '/' + movieId, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Making the api call to get the list of users
   * @returns the users list from db
   */
  // Making api call in order to get user
  public getUsers(): Observable<any> {
    return this.http
      .get(apiUrl + '/users')
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Making the api call for getting the favouriteList of the user
   * @returns the list of favouriteMovies()
   */
  // Making api call in order to get favourite movies list of the user
  public getFavorites() {
    const user = JSON.parse(localStorage.getItem('user') || '');
    return user.favourite_movies;
  }

  public userLogin(userDetails: any): Observable<string> {
    return this.http
      .post(apiUrl + 'login', userDetails, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .pipe(
        catchError(this.handleError),
        map((resData: any) => {
          if (resData.user) {
            localStorage.setItem('user', JSON.stringify(resData.user));
            localStorage.setItem('token', resData.token);
            this.dataService.setUser(resData.user);
            return JSON.stringify(resData.user);
          } else {
            throw new Error('No such user');
          }
        })
      );
  }

  private extractResponseData(res: any): any {
    const body = res;
    return body || {};
  }

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('An error has occurred: ', error.error.message);
    } else {
      console.error(
        `Error Status Code:\n    ${error.status},\n` +
          `Error body is: \n    ${error.error}`
      );
    }
  }
}

@Injectable({
  providedIn: 'root',
})
export class FetchApiDataService {
  public isTesting = false;

  constructor(private http: HttpClient) {}

  private tokenHeader(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });
  }

  public addFavoriteMovie(username: string, movieID: string): Observable<any> {
    const url = apiUrl + 'users/' + username + '/movies/' + movieID;

    return this.http.post(url, {}, { headers: this.tokenHeader() }).pipe(
      map(this.extractResponseData),
      catchError((error: HttpErrorResponse) => {
        console.error('Error adding favorite movie:', error);
        return this.handleError(error);
      })
    );
  }

  public getAllMovies(): Observable<any> {
    if (this.isTesting) {
      console.log('Loading Test Data');
      return of(mockdata);
    } else {
      return this.http
        .get(apiUrl + 'movies', { headers: this.tokenHeader() })
        .pipe(map(this.extractResponseData), catchError(this.handleError));
    }
  }

  public getOneUser(): Observable<any> {
    return this.http
      .get(apiUrl + 'users/profile', { headers: this.tokenHeader() })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  public editUser(user: any): Observable<any> {
    const username = user.username;
    const apiUrl = `https://primemovies-39075872fbeb.herokuapp.com/users/${user}`;

    return this.http
      .put(apiUrl, username, { headers: this.tokenHeader() })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  public deleteOneUser(): Observable<any> {
    return this.http
      .delete(apiUrl + 'users/profile', { headers: this.tokenHeader() })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  private extractResponseData(res: any): any {
    const body = res;
    return body || {};
  }

  public getMovie(movieID: string): Observable<any> {
    return this.http
      .get(apiUrl + 'movies/' + movieID, { headers: this.tokenHeader() })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  public getDirector(directorName: string): Observable<any> {
    return this.http
      .get(apiUrl + 'director/' + directorName, { headers: this.tokenHeader() })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  public getGenre(genreName: string): Observable<any> {
    return this.http
      .get(apiUrl + 'genre/' + genreName, { headers: this.tokenHeader() })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  public updateUserInfo(username: string, userInfo: any): Observable<any> {
    return this.http
      .put(apiUrl + 'users/' + username, userInfo, {
        headers: this.tokenHeader(),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  public deleteUser(username: string): Observable<any> {
    return this.http
      .delete(apiUrl + 'users/' + username, { headers: this.tokenHeader() })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  public deleteFavoriteMovie(
    username: string,
    movieID: string
  ): Observable<any> {
    return this.http
      .delete(apiUrl + 'users/' + username + '/movies/' + movieID, {
        headers: this.tokenHeader(),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Making the api call to add the movie to favouriteList of the user
   * @param movieId
   * @returns updated user object
   */
  public addToFavourite(movieId: string): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '');
    const token = localStorage.getItem('token');
    return this.http
      .post(
        apiUrl + '/users/' + user.username + '/' + movieId,
        {},
        {
          headers: new HttpHeaders({
            Authorization: 'Bearer ' + token,
          }),
        }
      )
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('An error has occurred: ', error.error.message);
    } else {
      console.error(
        `Error Status Code:\n    ${error.status},\n` +
          `Error body is: \n    ${error.error}`
      );
    }
    // You need to return something here, like an Observable with an error message.
    return of(''); // Placeholder, replace it with appropriate handling.
  }
}
