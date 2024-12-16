import React, { useEffect, useState } from "react";

import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Modal, Spinner } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function AdvertismentPage() {
  const navigate = useNavigate();
  const { adSlug } = useParams();
  const [showModal, setShowModal] = useState(false);
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

  const handleDeletePost = async () => {
    try {
      const res = await fetch(`/api/advertisment/delete-ad/${ad._id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setShowModal(false);
        navigate("/dashboard?tab=saved-ads");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      setError(error);
    }
  };

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
      <Link to={`/update-ad/${ad._id}`} className="self-center mt-5">
        <Button color="gray" pill size="xs">
          Edit
        </Button>
      </Link>
      <Button
        color="red"
        pill
        size="xs"
        className="self-center mt-5"
        onClick={() => {
          setShowModal(true);
        }}
      >
        Delete
      </Button>

      <img
        src={(ad && ad.finalAd) || ad.backgroundImage}
        alt={ad && ad.title}
        className="mt-10 p-3 max-h-[600px] max-w-[600px] object-cover justify-center items-center mx-auto"
      />
      <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
        <span>{ad && new Date(ad.createdAt).toLocaleDateString()}</span>
      </div>

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this post?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeletePost}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </main>
  );
}
