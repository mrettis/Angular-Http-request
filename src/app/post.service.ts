import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpEventType } from "@angular/common/http";
import { Post} from "./post.model";
import { map, catchError, tap } from 'rxjs/operators';
import { Subject, throwError, pipe } from 'rxjs';

@Injectable({providedIn:"root"})

export class PostService{
    error = new Subject<string>();

    constructor(private http: HttpClient){}

    createAndStorePost(title:string, content: string){
        const postData: Post = {title: title, content: content}
        this.http
        .post<{name: string}>
        ('https://angular-http-request-f11c8.firebaseio.com/posts.json',
      
         postData,
         {
          observe: 'response'
         
         }
         )
                  .subscribe(responseData=>{
                    console.log(responseData.body);
                  }, error =>{
                    this.error.next(error.message);
                  });

    }

    fetchPost(){
      // add more params:
     let searchParams = new HttpParams();
     searchParams =  searchParams.append('print', 'pretty');
     searchParams = searchParams.append('custom', 'key');
       return  this.http
        .get<{ [key: string]: Post }>(
          'https://angular-http-request-f11c8.firebaseio.com/posts.json',
          {
            headers: new HttpHeaders({ 'Custom-Header': 'Hello, I am header'}),
            // params: new HttpParams().set('print', 'pretty')
            params: searchParams,
            responseType: 'json'
          }
        )
        .pipe(
          map(responseData=>{
          const postsArray: Post[]= [];
          for(const key in responseData){
            if(responseData.hasOwnProperty(key)){
               postsArray.push({ ...responseData[key], id: key});
            }       
          }
          return postsArray;
        }),
        catchError(errorRes =>{
          // send to analytics server
          return throwError(errorRes);
        })
        );
       
    }
    deletePosts(){
      return  this.http.delete('https://angular-http-request-f11c8.firebaseio.com/posts.json',
      {
        observe: 'events',
        responseType: 'text'
      }
      ).pipe(tap(event =>{
        console.log(event)
        if(event.type===HttpEventType.Sent){
          //.. some logic to announce waiting for response
        }
        if(event.type === HttpEventType.Response ){
          console.log(event.body);
        }
        
      }))
      
    }
}