import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from 'rxjs/operators';
import { Post } from "./post.model";

@Injectable({ providedIn: "root" })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) {}

  getPosts() {
    this.http
    //get from server
      .get<{ message: string; posts: Post[] }>(
        "http://localhost:3000/api/posts"
      )
      //actions to handle data before they get to subscribe,
      //add in operator through pipe()
      .pipe(map((postData) => {
        return postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id
          };
        });
      }))
      //given by rxjs, when there is a change that is observed
      //subscribe method gets called
      .subscribe(convertedPosts => {
        this.posts = convertedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = { id: null, title: title, content: content };
    this.http

      .post<{ message: string, postId: string }>("http://localhost:3000/api/posts", post)
      .subscribe(responseData => {
        console.log(responseData.message);
        const id = responseData.postId;
        //updates null value of Post id to the id sent
        post.id = id;
        this.posts.push(post);
        //actively updates frontend when posts are added
        this.postsUpdated.next([...this.posts]);
      });
  }

  //method to send delete request to post-list.component's onDelete method
  deletePost(postId: string) {
    this.http.delete("http://localhost:3000/api/posts/"+postId)
      .subscribe(() => {
        //actively updates view of frontend after delete
        //filter() returns subset that is true where postId
        const updatedPosts = this.posts.filter(post => post.id !== postId);
          this.posts = updatedPosts;
          this.postsUpdated.next([...this.posts]);
        })
        console.log("deleted");

  }
}
