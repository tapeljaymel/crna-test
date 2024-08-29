import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { University } from '../types';

const Universities: React.FC = () => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUniversities = async () => {
      const { data, error } = await supabase
        .from('universities')
        .select('*');
      
      if (error) {
        setError(error.message);
        console.error(error);
      } else {
        setUniversities(data as University[]);
      }
    };

    fetchUniversities();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">Universities</h2>
      {error && <p className="text-red-500">{error}</p>}
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Latitude</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Longitude</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience Tags</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {universities.map((university) => (
            <tr key={university.id}>
              <td className="px-6 py-4 whitespace-nowrap">{university.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{university.latitude}</td>
              <td className="px-6 py-4 whitespace-nowrap">{university.longitude}</td>
              <td className="px-6 py-4 whitespace-nowrap">{university.experience_tags}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Universities;
