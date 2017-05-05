/// <reference types="lodash" />
/// <reference types="googlemaps" />
import Vue from 'vue';
import * as _ from 'lodash';
import 'googlemaps';
export default class AddressInput extends Vue {
    $refs: {
        autocomplete: HTMLInputElement;
    };
    searchText: string;
    postalCodes: PostalCode[];
    searchTextChanged: (() => void) & _.Cancelable;
    autocomplete: google.maps.places.Autocomplete;
    autocompleteService: google.maps.places.AutocompleteService;
    placeService: google.maps.places.PlacesService;
    predictionPlace: Place;
    search(): void;
    geolocate(): void;
    useGeolocation(): void;
    geocoderHandler(results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus): void;
    initAutocomplete(): void;
    fillInAddress(address_components: google.maps.GeocoderAddressComponent[]): void;
    receivePostalCodes(postalCodes: PostalCode[]): void;
    postalCodesFilter(postCode: PostalCode): boolean;
}
