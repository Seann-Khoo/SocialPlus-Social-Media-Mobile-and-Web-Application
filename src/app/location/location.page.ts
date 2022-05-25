import { ModalController } from '@ionic/angular';
import { Component, OnInit, NgZone } from '@angular/core';

declare var google;

@Component({
  selector: 'app-location',
  templateUrl: './location.page.html',
  styleUrls: ['./location.page.scss'],
})
export class LocationPage implements OnInit {

  autocomplete: { input: string; };
  autocompleteItems: any[];
  location: any;
  placeId: any;
  locationName: string;
  GoogleAutocomplete: any;
  hasResults: boolean = false;

 
  constructor(   
    public zone: NgZone,
    private modalController: ModalController,
  ) {
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
  }
 
  ngOnInit() { 
  }
  
  UpdateSearchResults(){
    if (this.autocomplete.input == '') {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
    (predictions, status) => {
      this.hasResults = true;
      this.autocompleteItems = [];
      this.zone.run(() => {
        predictions.forEach((prediction) => {
          this.autocompleteItems.push(prediction);
        });
      });
    });
  }
  
  SelectSearchResult(item) {
    this.placeId = item.place_id;
    this.locationName = item.description;
  }
  
  ClearAutocomplete(){
    this.autocompleteItems = []
    this.autocomplete.input = ''
  }

  save(){
    this.modalController.dismiss({location: this.locationName, place: this.placeId});
  }
  
  close(){
    this.modalController.dismiss({location: "Location (Optional)", place: null});
  }

}
