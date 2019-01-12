import { Injectable } from '@angular/core';
declare let alertify: any;

@Injectable({
  providedIn: 'root'
})
/**
 * third part library for displaying information for user in popup box
 */
export class AlertifyService {

constructor() { }


confirm(message: any, okCallback: () => any) {
 alertify.confirm(message, function(e) {
   // e - our event
if (e) {
okCallback();
} else {}
 });
}

success(message: string) {
  alertify.success(message);
}

error(message: string) {
  alertify.error(message);
}

warning(message: string) {
  alertify.warning(message);
}

message(message: string) {
  alertify.message(message);
}


}
