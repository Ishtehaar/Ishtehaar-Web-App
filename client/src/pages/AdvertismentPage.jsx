import React, { useEffect, useState } from "react";

import { Link, useParams } from "react-router-dom";
import { Button, Spinner } from "flowbite-react";

export default function AdvertismentPage() {
  const { adSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [ad, setAd] = useState(null);
  console.log("adSlug:", adSlug);


  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/advertisment/getAd/${adSlug}`);
        const data = await res.json();
        if (!res.ok) {
          setError(true);   
          setLoading(false);
        }
        if (res.ok) {
          setAd(data.ad);
          setLoading(false);
          setError(false);
        }
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchPost();
  }, [adSlug]);
  

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  return (
    <main className="p-3 flex flex-col max-w-6xl m-auto min-h-screen">
      <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
        {ad && ad.title}
      </h1>
      <Link
         to={`/update-ad/${ad._id}`}
        className="self-center mt-5"
      >
        <Button color="gray" pill size="xs">
          Edit
        </Button>
      </Link>
      <Button color="red" pill size="xs"className="self-center mt-5">
        Delete
      </Button>

      <img
        src={ad && (ad.finalAd) ||(ad.backgroundImage)}
        alt={ad && ad.title}
        className="mt-10 p-3 max-h-[600px] max-w-[600px] object-cover justify-center items-center mx-auto"
      />
      <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
        <span>{ad && new Date(ad.createdAt).toLocaleDateString()}</span>
        {/* <span className="italic">
          {post && (post.content.length / 1000).toFixed(0)} mins read
        </span> */}
      </div>

      {/* <div
        className="p-3 max-w-2xl mx-auto w-full post-content"
        dangerouslySetInnerHTML={{ __html: post && post.content }}
      ></div> */}

    

      {/* <div className="flex flex-col justify-center items-center mb-5">
        <h1 className="text-xl mt-5">Recent Articles</h1>
        <div className="flex flex-wrap gap-5 mt-5 justify-center">
          {recentPosts &&
            recentPosts.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
      </div> */}
    </main>
  );
}
