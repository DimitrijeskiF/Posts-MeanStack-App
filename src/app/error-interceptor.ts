import {HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http'
import {catchError} from "rxjs/operators";
import {throwError} from "rxjs";

import {MatDialog} from '@angular/material/dialog';
import {ErrorComponent} from "./error/error.component";
import {Injectable} from "@angular/core";


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(public dialog: MatDialog) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error:HttpErrorResponse) => {
        let errorMessage = 'Unknown error occurred!'
        if(error.error.message) {
          errorMessage = error.error.message;
        }
        this.dialog.open(ErrorComponent, {data: {message: errorMessage}});
        return throwError(error);
      })
    )
  }
}
