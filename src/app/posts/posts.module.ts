import {NgModule} from "@angular/core";
import {PostCreateComponent} from "./post-create/post-create.component";
import {PostListComponent} from "./post-list/post-list.component";
import {ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {AngularMaterialsModule} from "../angular-materials.module";
import {RouterModule} from "@angular/router";

@NgModule({
  declarations:[
    PostCreateComponent,
    PostListComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialsModule,
    RouterModule
  ]

})

export class PostsModule {

}
