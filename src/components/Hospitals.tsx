import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Hospital } from '../types';

const Hospitals: React.FC = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHospitals = async () => {
      const { data, error } = await supabase
        .from('hospitals')
        .select('*');
      
      if (error) {
        setError(error.message);
        console.error(error);
      } else {
        setHospitals(data as Hospital[]);
      }
    };

    fetchHospitals();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">Hospitals</h2>
      {error && <p className="text-red-500">{error}</p>}
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Latitude</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Longitude</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {hospitals.map((hospital) => (
            <tr key={hospital.id}>
              <td className="px-6 py-4 whitespace-nowrap">{hospital.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{hospital.address}</td>
              <td className="px-6 py-4 whitespace-nowrap">{hospital.latitude}</td>
              <td className="px-6 py-4 whitespace-nowrap">{hospital.longitude}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Hospitals;
