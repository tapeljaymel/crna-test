import React, { useEffect, useRef, useState } from 'react';
import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api';

interface MapProps {
  universities: { id: number; name: string; latitude: number; longitude: number }[];
  hospitals: { id: number; name: string; address: string; latitude: number; longitude: number }[];
  selectedUniversity: number | null;
  onUniversityClick: (universityId: number) => void;
  onHospitalClick: (hospitalId: number) => void;
  mapCenter: { lat: number; lng: number };
  selectedHospitalId: number | null; // Prop to handle dropdown selection
}

const containerStyle = {
  width: '100%',
  height: 'calc(100vh - 100px)' // Default height for large screens
};

const mobileContainerStyle = {
  width: '100%',
  height: '400px' // Specific height for mobile screens
};

const UniversityIcon = {
    path: 'M12,2A10,10 0 1,0 12,22A10,10 0 1,0 12,2Z',
  scale: 1,
  fillColor: 'blue',
  fillOpacity: 1,
  strokeColor: 'black',
  strokeWeight: 1,
  // Adjust the path to be a circle
};

const Map: React.FC<MapProps> = ({
  universities,
  hospitals,
  selectedUniversity,
  onUniversityClick,
  onHospitalClick,
  mapCenter,
  selectedHospitalId
}) => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const [activeHospital, setActiveHospital] = useState<number | null>(null);
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(null);

  useEffect(() => {
    console.log(activeHospital);
    if (mapRef.current && selectedUniversity !== null) {
      const university = universities.find(u => u.id === selectedUniversity);
      if (university) {
        mapRef.current.setCenter({ lat: university.latitude, lng: university.longitude });
        setActiveHospital(null);
        // Close existing InfoWindow if any
        if (infoWindow) {
          infoWindow.close();
          setInfoWindow(null);
        }
      }
    }
  }, [selectedUniversity, universities]);

  useEffect(() => {
    if (selectedHospitalId !== null) {
      const hospital = hospitals.find(h => h.id === selectedHospitalId);
      if (hospital) {
        if (infoWindow) {
          infoWindow.close();
        }

        // Create new InfoWindow
        const newInfoWindow = new google.maps.InfoWindow({
          content: createInfoWindowContent(hospital),
          position: { lat: hospital.latitude+0.01, lng: hospital.longitude }
        });

        newInfoWindow.open(mapRef.current!);
        setInfoWindow(newInfoWindow);
        setActiveHospital(hospital.id);

        // Center map on the selected hospital
        mapRef.current?.setCenter({ lat: hospital.latitude, lng: hospital.longitude });
      }
    } else {
      // Close existing InfoWindow if no hospital is selected
      if (infoWindow) {
        infoWindow.close();
        setInfoWindow(null);
      }
    }
  }, [selectedHospitalId, hospitals]);

  const createInfoWindowContent = (hospital: { name: string; address: string }) => {
    return `
      <div style="font-family: Arial, sans-serif; font-size: 14px; max-width: 200px;">
        <div style="font-weight: bold; margin-bottom: 5px;">${hospital.name}</div>
        <div>${hospital.address}</div>
      </div>
    `;
  };

  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
    >
      <div className="relative">
        <GoogleMap
          mapContainerStyle={window.innerWidth < 768 ? mobileContainerStyle : containerStyle}
          center={mapCenter}
          zoom={12}
          onLoad={(map: google.maps.Map) => { mapRef.current = map; }}
        >
          {universities.map(university => (
            <Marker
              key={university.id}
              position={{ lat: university.latitude, lng: university.longitude }}
              icon={UniversityIcon}
              onClick={() => onUniversityClick(university.id)}
            />
          ))}
          {hospitals.map(hospital => (
            <Marker
              key={hospital.id}
              position={{ lat: hospital.latitude, lng: hospital.longitude }}
              onClick={() => {
                onHospitalClick(hospital.id);
                setActiveHospital(hospital.id);
              }}
            />
          ))}
        </GoogleMap>
      </div>
    </LoadScript>
  );
};

export default Map;
