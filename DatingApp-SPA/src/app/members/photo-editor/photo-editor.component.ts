import { Component, OnInit, Input } from '@angular/core';
import { Photo } from 'src/app/_models/photo';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/_services/auth.service';


@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})

// this is child of member-edit component
export class PhotoEditorComponent implements OnInit {
  @Input() photos: Photo[];
  // https://valor-software.com/ng2-file-upload/
  // ready-made file upload library
  uploader: FileUploader;
  hasBaseDropZoneOver = false;

  baseUrl = environment.apiUrl;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.initializeUploader();
  }

  fileOverBase( e: any ): void {
    this.hasBaseDropZoneOver = e;
  }

  initializeUploader() {
this.uploader = new FileUploader({
  url: this.baseUrl + 'users/' + this.authService.decodedToken.nameid + '/photos',
  authToken: 'Bearer ' + localStorage.getItem('token'),
  isHTML5: true,
  allowedFileType: ['image'],
  removeAfterUpload: true,  // remove it from upload queue after photo will be successful uploaded
  autoUpload: false, // user should upload file by clicking the button
  maxFileSize: 10 * 1024 * 1024 // 10mb
});

  // solution for console error (from issue on github)
  this.uploader.onAfterAddingFile = (file) => {file.withCredentials = false; };

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
    }
  };
  }

}
