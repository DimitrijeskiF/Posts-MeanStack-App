import {NgModule} from "@angular/core";
import {LoginComponent} from "./login/login.component";
import {SignupComponent} from "./signup/signup.component";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {AngularMaterialsModule} from "../angular-materials.module";
import {AuthRoutingModule} from "./auth-routing.module";


@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    AngularMaterialsModule,
    AuthRoutingModule
  ]
})
export class AuthModule {}
