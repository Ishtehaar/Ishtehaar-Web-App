import React, { useEffect, useState } from 'react';
import AdvertismentCard from './AdvertismentCard';
import { Loader2 } from 'lucide-react';

export default function DashSaveAd() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await fetch('/api/advertisment/getAds');
        const data = await res.json();
        setAds(data.savedAds);
      } catch (error) {
        console.error('Error fetching ads:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAds();
  }, []);

  return (
    <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7'>
      {loading ? (
        <div className='flex justify-center items-center min-h-[200px]'>
          <Loader2 className='h-8 w-8 animate-spin text-gray-500' />
        </div>
      ) : ads && ads.length > 0 ? (
        <div className='flex flex-col gap-6'>
          <h2 className='text-2xl font-semibold text-center'>Your Advertisements</h2>
          <div className='flex flex-wrap gap-4 justify-center'>
            {ads.map((ad) => (
              <AdvertismentCard key={ad._id} ad={ad} />
            ))}
          </div>
        </div>
      ) : (
        <p className='text-center text-lg'>You haven't started your advertisement campaign yet!</p>
      )}
    </div>
  );
}