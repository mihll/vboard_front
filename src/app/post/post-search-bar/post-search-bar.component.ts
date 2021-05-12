import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmitterService } from '../../shared/emitter-service/emitter.service';

@Component({
  selector: 'app-post-search-bar',
  templateUrl: './post-search-bar.component.html',
  styleUrls: ['./post-search-bar.component.scss']
})
export class PostSearchBarComponent implements OnInit {
  searchForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private emitterService: EmitterService
  ) { }

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
      searchText: ['', Validators.compose([Validators.required, Validators.minLength(3)])]
    });
  }

  get f(): { [p: string]: AbstractControl } {
    return this.searchForm.controls;
  }

  onSearch(): void {
    if (this.searchForm.invalid) {
      return;
    }
    this.emitterService.emitSearchPostsEvent(this.f.searchText.value);
  }
}
