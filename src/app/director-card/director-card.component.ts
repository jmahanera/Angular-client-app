import { Component, Inject, Injector, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { DataService } from '../data.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MovieCardComponent } from '../movie-card/movie-card.component';

@Component({
  selector: 'app-director-card',
  templateUrl: './director-card.component.html',
  styleUrls: ['../movie-card/movie-card.component.scss'],
})
export class DirectorCardComponent implements OnInit {
  director: any;
  similarMovies: any[];
  datePipe: DatePipe;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private injector: Injector,
    private dataService: DataService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<MovieCardComponent>
  ) {
    this.director = this.data.director;
    this.similarMovies = dataService
      .filteredMovies('director', this.director.name)
      .slice(0, 5);

    // Manually inject DatePipe using Injector
    this.datePipe = this.injector.get(DatePipe);
  }

  ngOnInit(): void {
    if (this.director.birth)
      this.director.birthdate = this.datePipe.transform(
        this.director.birthdate,
        'MM/dd/yyyy'
      );

    if (this.director.death)
      this.director.death = this.datePipe.transform(
        this.director.death,
        'MM/dd/yyyy'
      );
  }

  openMovieCardDialog(movie: any): void {
    this.dialog.open(MovieCardComponent, {
      width: '80%',
      height: '80%',
      data: { movie },
    });
    this.dialogRef.close();
  }
}
