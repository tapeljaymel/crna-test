export interface Hospital {
    id: number;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
}

export interface University {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    experience_tags: string;
}

export interface Review {
    id: number;
    rating: number;
    hospital_id: number;
    review_text: string;
    created_at: string;
}

export interface HospitalUniversity {
    hospital_id: number;
    university_id: number;
}
