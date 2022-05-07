import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ImagesService } from '../images.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  images: string[] = [];
  directory: string[] = [];

  constructor(private imageService: ImagesService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.imageService.images.subscribe((value) => {
      this.images = value;
      this.cdr.detectChanges();
    });

    this.imageService.directory.subscribe((value) => {
      this.directory = value;
      this.cdr.detectChanges();
    });
  }

  navigateDirectory(path: any) {
    this.imageService.navigateDirectory(path);
  }

}
