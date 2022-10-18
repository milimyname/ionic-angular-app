import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent, LoadingController } from '@ionic/angular';
import { MovieService } from 'src/app/services/movie.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.page.html',
  styleUrls: ['./movies.page.scss'],
})
export class MoviesPage implements OnInit {

  movies = [];
  currentPage = 1;
  imageBaseUrl = environment.imageUrl;

  constructor(private movieService: MovieService, private loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.loadMovies();
  }

  async loadMovies(event?: InfiniteScrollCustomEvent){
    const loading = await this.loadingCtrl.create({
      message: 'Loading Movies...',
      spinner: 'crescent',
    });
    await loading.present();
    this.movieService.getTopRatedMovies(this.currentPage).subscribe((data) => {
      loading.dismiss();
      this.movies = [...this.movies, ...data.results];

      event?.target.complete();
      if(event) {
        event.target.disabled = this.currentPage === data.total_pages;
      };
    });
  }

  loadMoreMovies(event: InfiniteScrollCustomEvent){
    this.currentPage++;
    this.loadMovies(event);
  }

}
