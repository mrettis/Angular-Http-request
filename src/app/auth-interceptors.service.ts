import {
 HttpInterceptor,
 HttpRequest, 
 HttpHandler, 
//  HttpEventType
} from '@angular/common/http';
import { tap } from 'rxjs/operators';

export class AuthInterceptorsService implements HttpInterceptor{
    intercept(req: HttpRequest<any>, next: HttpHandler){
        // console.log('resquest is first, responseRequ is after');
        // console.log(req.url);
        // modify request by cloning
        const modifiedRequest = req.clone({headers: req.headers.append('Auth', 'XYZ')})

// return next.handle(req);
    return next.handle(modifiedRequest)
    // .pipe(tap((event=>{
    //     console.log(event);
    //      if (event.type === HttpEventType.Response){
    //         console.log('response arrived, body data: ')
    //         console.log(event.body);
    //      }
    // })));
    }
}