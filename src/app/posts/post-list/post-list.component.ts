import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from 'rxjs';

import { Post } from "../post.model";
import { PostsService } from "../posts.service";

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"]
})
export class PostListComponent implements OnInit, OnDestroy {
  //Post from post.model
  posts: Post[] = [];
  isLoading = false;
  //store subscription to prevent memory leak
  private postsSub: Subscription;

  constructor(public postsService: PostsService) {}
  //initialization tasks
  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts();
    this.postsSub = this.postsService.getPostUpdateListener()
    //subscribe connects observer with observables to see items emitted by observable
      .subscribe((posts: Post[]) => {
        this.isLoading = false;
        this.posts = posts;
      });
  }

onDelete(postId: string) {
  //uses delete method from posts.service.ts
  this.postsService.deletePost(postId);
}
//when component is removed subscription unsubscribe/ prevents memory leak
  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
}
