interface Place {
    street_number: string;
    route: string;
    locality: string;
    administrative_area_level_1: string;
    administrative_area_level_2: string;
    administrative_area_level_3: string;
    country: string;
    postal_code: string;
    [key: string]: string;
}

interface City {
    postal_codes: PostalCode[];
}

interface PostalCode {
    code: string;
    area: string;
    road: string;
    range: string;
}
