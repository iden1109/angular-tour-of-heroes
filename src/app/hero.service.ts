import { MessageService } from './message.service';
import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map , tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class HeroService {

  private heroesUrl = 'api/heroes';

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }


  getHeroes(): Observable<Hero[]> {
    this.messageService.add('HeroService: fetched heroes');
    // return of(HEROES);
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(heroes => this.log('fetched heroes')),
        catchError(this.handleError('getHeroes', [])
      ));
  }

  getHero(id: number): Observable<Hero> {
    this.messageService.add('HeroService: fetched hero id=${id}');
    // return of(HEROES.find(hero => hero.id === id));
    const url = '${this.heroesUrl}/${id}';
    return this.http.get<Hero>(url)
      .pipe(
        tap(who => this.log('fetched hero id=${id}')),
        catchError(this.handleError<Hero>('getHero id=${id}'))
      );
  }

  /**
   * Handle http operation that failed.
   * @param operation - name of the opeartion that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      // better job of transforming error for user consumption
      this.log('${operation} failed: ${error.message}');
      // Let the app keep running by returning a empty result.
      return of(result as T);
    };
  }

  private log(message: string) {
    this.messageService.add('HeroService: ' + message);
  }
}
