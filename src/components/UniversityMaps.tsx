import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import Map from './Map'; // Import the Map component
import ReviewsSection from './ReviewsSection'; // Import the ReviewsSection component
import ReviewsForm from './ReviewsForm'; // Import the ReviewsForm component
import { University, Hospital, Review } from '../types';

const UniversityMaps: React.FC = () => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [filteredHospitals, setFilteredHospitals] = useState<Hospital[]>([]);
  const [hospitalUniversityMap, setHospitalUniversityMap] = useState<{ [universityId: number]: number[] }>({});
  const [selectedUniversity, setSelectedUniversity] = useState<number | null>(null);
  const [selectedHospital, setSelectedHospital] = useState<number | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState<number>(0);

  useEffect(() => {
    // Fetch universities
    supabase
      .from('universities')
      .select('*')
      .then(({ data, error }) => {
        if (error) console.error('Error fetching universities:', error);
        else {
          setUniversities(data.reverse() || []);
          if (data?.length > 0) {
            // Center map on the first university
            setSelectedUniversity(data[0].id);
            setMapCenter({
              lat: data[0].latitude,
              lng: data[0].longitude
            });
          }
        }
      });

    // Fetch hospitals
    supabase
      .from('hospitals')
      .select('*')
      .then(({ data, error }) => {
        if (error) console.error('Error fetching hospitals:', error);
        else setHospitals(data || []);
      });

    // Fetch hospital-university relationships
    supabase
      .from('hospital_university')
      .select('*')
      .then(({ data, error }) => {
        if (error) console.error('Error fetching hospital-university relationships:', error);
        else {
          const map: { [universityId: number]: number[] } = {};
          data?.forEach(({ hospital_id, university_id }) => {
            if (!map[university_id]) {
              map[university_id] = [];
            }
            map[university_id].push(hospital_id);
          });
          setHospitalUniversityMap(map);
        }
      });
  }, []);

  useEffect(() => {
    if (selectedUniversity) {
      const connectedHospitalIds = hospitalUniversityMap[selectedUniversity] || [];
      const connectedHospitals = hospitals.filter(hospital => connectedHospitalIds.includes(hospital.id));
      setFilteredHospitals(connectedHospitals);

      // Center map on selected university
      const university = universities.find(u => u.id === selectedUniversity);
      if (university) {
        setMapCenter({
          lat: university.latitude,
          lng: university.longitude
        });
      }
    } else {
      setFilteredHospitals(hospitals);
    }
  }, [selectedUniversity, hospitalUniversityMap, hospitals, universities]);

  useEffect(() => {
    if (selectedHospital) {
      const hospital = hospitals.find(h => h.id === selectedHospital);
      if (hospital) {
        // Recenter map on selected hospital
        setMapCenter({
          lat: hospital.latitude,
          lng: hospital.longitude
        });
      }
    }
  }, [selectedHospital, hospitals]);

  const handleUniversityChange = (universityId: number) => {
    setSelectedUniversity(universityId);
    setSelectedHospital(null); // Reset selected hospital when university changes
  };

  const handleHospitalClick = (hospitalId: number) => {
    setSelectedHospital(hospitalId);
    // Fetch reviews for selected hospital
    supabase
      .from('reviews')
      .select('*')
      .eq('hospital_id', hospitalId)
      .then(({ data, error }) => {
        if (error) console.error('Error fetching reviews:', error);
        else setReviews(data || []);
      });
  };

  const fetchReviews = async (hospitalId: number) => {
    const { data: reviewsData, error } = await supabase
      .from('reviews') // Replace with your table name
      .select('*')
      .eq('hospital_id', hospitalId);

    if (error) {
      console.error('Error fetching reviews:', error);
    } else {
      setReviews(reviewsData);
    }
  };

  const handleReviewSubmit = async () => {
    if (selectedHospital && newReviewText) {
      const { error } = await supabase
        .from('reviews') // Replace with your table name
        .insert([
          {
            hospital_id: selectedHospital,
            review_text: newReviewText,
            rating: newReviewRating
          }
        ]);

      if (error) {
        console.error('Error submitting review:', error);
      } else {
        setNewReviewText('');
        setNewReviewRating(0);
        // Refresh reviews by refetching
        fetchReviews(selectedHospital);
      }
    }
  };

  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({
    lat: universities[0]?.latitude || 0,
    lng: universities[0]?.longitude || 0
  });

  return (
    <div className="flex flex-col md:flex-row-reverse">

      <div className="md:w-3/4 p-2 flex-1">
        <Map
          universities={universities}
          hospitals={filteredHospitals}
          selectedUniversity={selectedUniversity}
          onUniversityClick={handleUniversityChange}
          onHospitalClick={handleHospitalClick}
          mapCenter={mapCenter}
          selectedHospitalId={selectedHospital} 
        />
      </div>

      <div className="md:w-1/4 p-2 pb-20 flex flex-col md:max-h-[90vh] pb-4 overflow-y-auto bg-gray-100">
        <div className="bg-white p-4 rounded-lg mb-4 shadow-md">
          {/* University Dropdown */}
          <div className="mb-4">
            <label htmlFor="university-dropdown" className="block text-sm font-medium text-gray-700">University</label>
            <select
              id="university-dropdown"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              value={selectedUniversity || ''}
              onChange={(e) => handleUniversityChange(Number(e.target.value))}
            >
              {universities.map(university => (
                <option key={university.id} value={university.id}>
                  {university.name}
                </option>
              ))}
            </select>
          </div>

          {/* Hospital Dropdown */}
          {selectedUniversity && (
            <div className="mb-4">
              <label htmlFor="hospital-dropdown" className="block text-sm font-medium text-gray-700">Hospital</label>
              <select
                id="hospital-dropdown"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                value={selectedHospital || ''}
                onChange={(e) => handleHospitalClick(Number(e.target.value))}
              >
                <option value="">Select a Hospital</option>
                {hospitalUniversityMap[selectedUniversity]?.map(hospitalId => (
                  <option key={hospitalId} value={hospitalId}>
                    {hospitals.find(h => h.id === hospitalId)?.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Reviews Section */}
        {selectedHospital && (
          <>
            <ReviewsSection reviews={reviews} />
            <ReviewsForm
              newReviewText={newReviewText}
              newReviewRating={newReviewRating}
              setNewReviewText={setNewReviewText}
              setNewReviewRating={setNewReviewRating}
              onReviewSubmit={handleReviewSubmit}
            />
          </>
        )}
      </div>

      
    </div>
  );
};

export default UniversityMaps;
