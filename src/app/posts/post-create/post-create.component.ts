import { PostService } from './../post.service';
import { Post } from './../post.model';
import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from './mime-type.validator';
import {Subscription} from "rxjs";
import {AuthService} from "../../auth/auth.service";


@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit, OnDestroy {
  addedTitle = '';
  addedContent = '';
  mode = 'create';
  postId: string;
  post: Post;
  form: FormGroup;
  isLoading = false;
  imagePreview: string;
  private authStatusSub: Subscription;
  constructor(
    public postService: PostService,
    public route: ActivatedRoute,
    public authSrvice: AuthService
  ) { }

  ngOnInit(): void {
  this.authStatusSub = this.authSrvice.getAuthStateListener().subscribe(authStatus => {
      this.isLoading = false;
    })
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.minLength(3)
        ]
      }),
      content: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.minLength(5)
        ]
      }),
      image: new FormControl(null, {
        validators: [
          Validators.required
        ],
        asyncValidators: [
          mimeType
        ]
      })
    });

    this.route.paramMap
      .subscribe((paramMap: ParamMap) => {
        if (paramMap.has('postId')) {
          this.mode = 'edit';
          this.postId = paramMap.get('postId');
          this.isLoading = true;
          this.postService.getPost(this.postId)
            .subscribe((postData) => {
              this.isLoading = false;
              this.post = {
                id: postData._id,
                title: postData.title,
                content: postData.content,
                imagePath: postData.imagePath,
                creator: postData.creator
              };

              this.form.setValue({ title: this.post.title, content: this.post.content, image: this.post.imagePath });
            });
        } else {
          this.mode = 'create';
          this.postId = null;
        }
      });
  }

  // tslint:disable-next-line:typedef
  onAddPost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postService.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
        );
    } else {
      this.postService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
        );
    }
    this.form.reset();
  }

  onImagePicker(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };

    reader.readAsDataURL(file);
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}