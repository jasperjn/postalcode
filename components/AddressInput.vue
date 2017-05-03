<template>
<input class="form-control"
    placeholder="郵寄地址"
    ref="autocomplete"
    v-model="searchText"
    @input="searchTextChanged"
    @focus.once="geolocate" />
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'nuxt-class-component';
import * as _ from 'lodash';
import 'googlemaps';

var addressComponentMap: Place = {
    street_number: 'short_name',
    route: 'long_name',
    locality: 'long_name',
    administrative_area_level_1: 'short_name',
    administrative_area_level_2: 'short_name',
    administrative_area_level_3: 'short_name',
    country: 'long_name',
    postal_code: 'short_name'
};

@Component({
    // beforeCreate() {
    //     localStorage.clear();
    // }
})
export default class AddressInput extends Vue {
    $refs: {
        autocomplete: HTMLInputElement;
    };
    searchText = '';
    postalCodes:PostalCode[] = [];
    searchTextChanged = _.debounce(this.search, 800);
    autocomplete: google.maps.places.Autocomplete;
    autocompleteService: google.maps.places.AutocompleteService;
    placeService: google.maps.places.PlacesService;
    predictionPlace: Place = {} as Place;

    search() {
        if (!this.searchText) {
            return;
        }
        this.autocompleteService = new google.maps.places.AutocompleteService();
        // this.autocompleteService.getPlacePredictions({}, null)
        this.autocompleteService.getPlacePredictions({
            input: this.searchText,
            componentRestrictions: {
                country: 'tw'
            }
        }, (predictions,
        status) => {
            if (status !== google.maps.places.PlacesServiceStatus.OK) {
                alert(status);
                return;
            }
            var geocoder = new google.maps.Geocoder();

            geocoder.geocode({ 'placeId': predictions[0].place_id },  (results, status) => {
                if (status === google.maps.GeocoderStatus.OK) {
                    if (results[0]) {
                        this.fillInAddress(results[0].address_components);
                    } else {
                        window.alert('No results found');
                    }
                } else {
                    window.alert('Geocoder failed due to: ' + status);
                }
            });

            // this.placeService = new google.maps.places.PlacesService();
        });
    }
    geolocate() {
        this.initAutocomplete();
        // if (navigator.geolocation) {
        //     navigator.geolocation.getCurrentPosition(position => {
        //         let geolocation = {
        //             lat: position.coords.latitude,
        //             lng: position.coords.longitude
        //         };
        //         var geocoder = new google.maps.Geocoder();
        //         geocoder.geocode({ location: geolocation }, (result, status) => {

        //         });

        //     }, err => {
        //     });
        // }
    }
    initAutocomplete() {
        this.autocomplete = new google.maps.places.Autocomplete(
            this.$refs.autocomplete, {
                types: ['geocode'],
                componentRestrictions: { country: 'tw' }
            }
        );

        this.autocomplete.addListener('place_changed', () => {
            this.fillInAddress(this.autocomplete.getPlace().address_components);
        });
    }
    fillInAddress(address_components: google.maps.GeocoderAddressComponent[]) {
        for (let key in addressComponentMap) {
            this.predictionPlace[key] = '';
        }
        for (let component of address_components) {
            let addressType = component.types[0];
            if (addressComponentMap[addressType]) {
                this.predictionPlace[addressType] = (component as any)[addressComponentMap[addressType]].replace('臺', '台');
            }
        }

        let city = this.predictionPlace.administrative_area_level_1;

        if (!city || city === '台灣省') {
            city = this.predictionPlace.administrative_area_level_2;
        }

        if (!localStorage.getItem(city)) {
            fetch(`/postal_codes/${encodeURIComponent(city)}.json`)
                .then<City>(res => res.json())
                .then(json => {
                    localStorage.setItem(city, JSON.stringify(json));
                    this.receivePostalCodes(json.postal_codes);
                });
        } else {
            this.receivePostalCodes(JSON.parse(localStorage.getItem(city) as string).postal_codes);
        }
    }

    receivePostalCodes(postalCodes: PostalCode[]) {
        this.postalCodes = postalCodes.filter(this.postalCodesFilter).slice(0, 10);
        this.$store.commit('setPostalCodes', this.postalCodes);
    }

    postalCodesFilter(postCode: PostalCode) {
        let city = this.predictionPlace.administrative_area_level_1;
        let district = this.predictionPlace.administrative_area_level_3;
        let road = this.predictionPlace.route;

        if (!city || city === '台灣省') {
            city = this.predictionPlace.administrative_area_level_2;
        }

        return postCode.area === city + district && postCode.road.startsWith(road);
    }
}
</script>

