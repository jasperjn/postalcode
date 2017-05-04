<template>
<div class="form-group">
    <input class="form-control"
        id="searchText"
        placeholder=""
        required
        ref="autocomplete"
        v-model="searchText"
        @input="searchTextChanged"
        @focus.once="geolocate" />
    <label for="searchText">地址</label>
    <a class="geolocation" href="#" @click.prevent="useGeolocation">使用目前位置</a>
</div>
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
        this.autocompleteService.getPlacePredictions({
            input: this.searchText,
            componentRestrictions: {
                country: 'tw'
            }
        }, (predictions, status) => {
            if (status !== google.maps.places.PlacesServiceStatus.OK) {
                alert(status);
                return;
            }
            var geocoder = new google.maps.Geocoder();

            geocoder.geocode({
                'placeId': predictions[0].place_id
            }, this.geocoderHandler);
        });
    }
    geolocate() {
        this.initAutocomplete();
    }
    useGeolocation(){
        navigator.geolocation.getCurrentPosition(position => {
            let geolocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            }
            let geocoder = new google.maps.Geocoder();
            geocoder.geocode({
                location: geolocation
            }, this.geocoderHandler);
        }, err => {
            if (err.code === err.PERMISSION_DENIED) {
                alert('請允許取得目前位置。');
            } else if (err.code === err.POSITION_UNAVAILABLE) {
                alert('無法取得目前位置。')
            } else {
                alert('無法取得目前位置。')
            }
        });
    }
    geocoderHandler(results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) {
        if (status === google.maps.GeocoderStatus.OK) {
            if (results[0]) {
                this.fillInAddress(results[0].address_components);
            } else {
                alert('無法解析位置');
            }
        } else {
            alert('無法解析位置');
        }
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

<style scoped>
.form-group {
    --input-border-color: #757575;
    --input-placeholder-color: #999;
    --input-label-color: #5264AE;
    position: relative;
    text-align: center;
}
input {
    width: 100%;
    font-size: 18px;
    padding: 10px 10px 10px 5px;
    display: block;
    border: none;
    border-bottom: 1px solid var(--input-border-color);
}
input:focus {
    outline: none;
    border-bottom: 2px solid var(--input-label-color);
}
label {
    color: var(--input-placeholder-color);
    position: absolute;
    left: 5px;
    top: 10px;
    font-size: 18px;
    transition: all 0.2s;
    pointer-events: none;
}
input:focus ~ label,
input:valid ~ label {
    top: -20px;
    font-size: 14px;
    color: var(--input-label-color);
}
.geolocation {
    font-size: 13px;
    text-decoration: none;
}
</style>