import React, { useEffect, useState } from 'react'
import AdvertismentCard from './AdvertismentCard';

export default function DashSaveAd() {
  const [ads, setAds] = useState([]);

  useEffect(() => {
    const fetchAds = async () => {
      const res = await fetch('/api/advertisment/getAds');
      const data = await res.json();
      setAds(data.savedAds);
    };
    fetchAds();
  }, []);
  return (
    <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7'>
        {ads && ads.length > 0 && (
          <div className='flex flex-col gap-6'>
            <h2 className='text-2xl font-semibold text-center'>Your Advertisments</h2>
            <div className='flex flex-wrap gap-4 justify-center'>
              {ads.map((ad) => (
                <AdvertismentCard key={ad._id} ad={ad} />
              ))}
            </div>
          </div>
        )}
      </div>
  )
}
