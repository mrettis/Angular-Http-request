import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Post} from './post.model';
import { PostService } from './post.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  loadedPosts: Post[] = [];
  isFetching = false;
  error = null; 
  private errorSub: Subscription; 

  constructor(private http: HttpClient, private postService: PostService) {}

  ngOnInit() {
   this.errorSub =  this.postService.error.subscribe(errorMessage =>{
      this.error = errorMessage;
    })

    this.isFetching = true;
    this.postService.fetchPost()
       .subscribe(post =>{
        this.isFetching = false;
        this.loadedPosts = post;
      }, error =>{
        this.isFetching = false;
        this.error = error.message;
      });
  }

  onCreatePost(postData: Post) {
    //send Http Request
    this.postService.createAndStorePost(postData.title, postData.content);
         
  }

  onFetchPosts() {
    // Send Http request
    this.isFetching = true;
    this.postService.fetchPost()
       .subscribe(post =>{
        this.isFetching = false;
        this.loadedPosts = post;
        //error handling
      }, error =>{
        this.isFetching = false;
        this.error = error.message;
        //console.log(error); to log in error and see messages from firebase API
      });
     
  }

  onClearPosts() {
    // Send Http request
    this.postService.deletePosts().subscribe(()=>{
      this.loadedPosts =[];
    });
  }

  private fetchPosts(){
    this.isFetching = true;

  }

  onHandleError(){
    this.error = null;
  }

  ngOnDestroy(){
    this.errorSub.unsubscribe()
  }
}
