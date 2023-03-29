import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Gif, SearchGifsResponse } from '../interface/gifs.interface';

//providedIn: 'root' = indica a angular que este servicio se va poder acceder desde cualquier parte, evitando espicifar
//en el provider del modulo
@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private apiKey: string = '8RcRhlHkzxOOGqSdslQpjzgadIsl3cCX';
  private servicioUrl: string = 'https://api.giphy.com/v1/gifs';
  private _historial: string[] = [];

  //TODO: cambiar any por su tipo
  public resultados: Gif[] = []

  get historial() {
    return [...this._historial];
  }

  constructor(private http: HttpClient) {
    // if (localStorage.getItem('historial'))
    this._historial = JSON.parse(localStorage.getItem('historial')!) || [];
    //resultados
    this.resultados = JSON.parse(localStorage.getItem('resultados')!) || [];
  }

  buscarGifs(query: string = '') {
    query = query.toLocaleLowerCase();

    if (!this._historial.includes(query)) {
      this._historial.unshift(query);
      this._historial = this._historial.splice(0, 10);
      localStorage.setItem('historial', JSON.stringify(this._historial));
    }

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '10')
      .set('q', query);

    this.http.get<SearchGifsResponse>(`${this.servicioUrl}/search`, { params })
      .subscribe((resp: SearchGifsResponse) => {
        this.resultados = resp.data;
        localStorage.setItem('resultados', JSON.stringify(resp.data));
      });
  }

  // buscarGifs(query: string = '') {
  //   query = query.toLocaleLowerCase();

  //   if (!this._historial.includes(query)) {
  //     this._historial.unshift(query);
  //     this._historial = this._historial.splice(0, 10);
  //   }
  //   console.log(this._historial);

  //   fetch('https://api.giphy.com/v1/gifs/search?api_key=8RcRhlHkzxOOGqSdslQpjzgadIsl3cCX&q=dragon ball z&limit=10').then(resp => {
  //     resp.json().then(data => {
  //       console.log(data);
  //     })
  //   })
  // }

  // async buscarGifs(query: string = '') {
  //   query = query.toLocaleLowerCase();

  //   if (!this._historial.includes(query)) {
  //     this._historial.unshift(query);
  //     this._historial = this._historial.splice(0, 10);
  //   }
  //   console.log(this._historial);

  //   const resp = await fetch('https://api.giphy.com/v1/gifs/search?api_key=8RcRhlHkzxOOGqSdslQpjzgadIsl3cCX&q=dragon ball z&limit=10');
  //   const data = await resp.json();
  //   console.log(data);
  // }

}
