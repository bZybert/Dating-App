import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Photo } from 'src/app/_models/photo';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})

// this is child of member-edit component
export class PhotoEditorComponent implements OnInit {
  @Input() photos: Photo[];
  @Output() getMemberPhotoChange = new EventEmitter<string>(); // we will sending photo url to parent component
  // https://valor-software.com/ng2-file-upload/
  // ready-made file upload library
  uploader: FileUploader;
  hasBaseDropZoneOver = false;

  baseUrl = environment.apiUrl;
  currentMainPhoto: Photo;
  constructor(
    private authService: AuthService,
    private userServise: UserService,
    private alertify: AlertifyService
  ) {}

  ngOnInit() {
    this.initializeUploader();
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url:
        this.baseUrl +
        'users/' +
        this.authService.decodedToken.nameid +
        '/photos',
      authToken: 'Bearer ' + localStorage.getItem('token'),
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true, // remove it from upload queue after photo will be successful uploaded
      autoUpload: false, // user should upload file by clicking the button
      maxFileSize: 10 * 1024 * 1024 // 10mb
    });

    // solution for console error (from issue on github)
    this.uploader.onAfterAddingFile = file => {
      file.withCredentials = false;
    };

    // fileuploader build method
    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const res: Photo = JSON.parse(response);
        // create complete photo object
        const photo = {
          id: res.id,
          url: res.url,
          dateAdded: res.dateAdded,
          description: res.description,
          isMain: res.isMain
        };
        // add new photo to our photos[]
        this.photos.push(photo);
        // if this is first photo
        if (photo.isMain) {
          // we sending photo.url with _service method
          this.authService.changeMemberPhoto(photo.url);
          // update user photoUrl with new selected photo
          this.authService.currentUser.photoUrl = photo.url;
          // update user in local storage to save changes
          localStorage.setItem(
            'user',
            JSON.stringify(this.authService.currentUser)
          );
        }
      }
    };
  }

  setMainPhoto(photo: Photo) {
    // this method have two parameters
    // userId  and   photo id
    this.userServise
      .setMainPhoto(this.authService.decodedToken.nameid, photo.id)
      .subscribe(
        () => {
          // filter return a copy of photos array and return only the one that match the condition
          // it return an array so we need to specify [0] - array with one elemet (only photo one could be main)
          this.currentMainPhoto = this.photos.filter(p => p.isMain === true)[0];
          // set this photo to false
          this.currentMainPhoto.isMain = false;
          // set chosen photo as main
          photo.isMain = true;
          // sending selected photo url to output variable for parent component
          // this.getMemberPhotoChange.emit(photo.url);

          // we sending photo.url with _service method
          this.authService.changeMemberPhoto(photo.url);
          // update user photoUrl with new selected photo
          this.authService.currentUser.photoUrl = photo.url;
          // update user in local storage to save changes
          localStorage.setItem(
            'user',
            JSON.stringify(this.authService.currentUser)
          );
        },
        error => {
          this.alertify.error(error);
        }
      );
  }

  deletePhoto(id: number) {
    // confirmation from user to delete photo
    this.alertify.confirm(
      'Are you sure you want to delete this photo ?',
      () => {
        this.userServise
          .deletePhoto(this.authService.decodedToken.nameid, id)
          .subscribe(
            () => {
              // remove photo from photos array
              // slice (start number, how many position to cut)
              this.photos.slice(this.photos.findIndex(p => p.id === id), 1);
              this.alertify.success('Photo has been deleted');
            },
            error => {
              this.alertify.error('Failed to delete photo');
            }
          );
      }
    );
  }
}
