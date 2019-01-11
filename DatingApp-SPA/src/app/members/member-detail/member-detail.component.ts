import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/_models/user';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';


@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
user: User;
galleryOptions: NgxGalleryOptions[];  // style options
galleryImages: NgxGalleryImage[]; // images from user.photos db

  constructor(
    private userService: UserService,
    private alertify: AlertifyService,
    private route: ActivatedRoute // needed to get user id
    ) { }

  ngOnInit() {
    this.route.data.subscribe( data => {
      this.user = data['user'];  // routes.ts  members path
    });

    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,  // numbers of small images under main image
        imageAnimation: NgxGalleryAnimation.Slide,  // type of build animation
        preview: false  // prevent to display image in full screen if user click on it
      }];

      // need to be an array with objects  - https://www.npmjs.com/package/ngx-gallery
      this.galleryImages = this.getImages();
  }

  // getting images from user.photos db
  getImages() {
    const imagesUrl = [];
    for (let i = 0; i < this.user.photos.length; i++) {
      imagesUrl.push({
        small: this.user.photos[i].url,
        medium: this.user.photos[i].url,
        big: this.user.photos[i].url,
        description: this.user.photos[i].description
      });
    }
    return imagesUrl;
  }
// loadUser() {
//   // this.router.snapshot.params['id'] - our id parameter taking from url
//   // url is string and when we add '+' in front it convert it to number (+this.route.snapshot.params['id'])
//   return this.userService.getUser(+this.route.snapshot.params['id']).subscribe((user: User) => {
//   this.user = user;
//   }, error => {
//     this.alertify.error(error);
//   });
// }

}
