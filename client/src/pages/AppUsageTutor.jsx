import React, { useState, useEffect } from 'react';
import { Button, Card, Carousel, Modal, Spinner } from 'flowbite-react';
import { BookOpen, Video, Trophy, Users, ChevronRight, AlertCircle } from 'lucide-react';
import axios from 'axios';

const AppUsageTutor = () => {
  const [openModal, setOpenModal] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  
  // State for data
  const [tutorials, setTutorials] = useState([]);
  const [videoTutorials, setVideoTutorials] = useState([]);
  const [successStories, setSuccessStories] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  
  // Loading states
  const [tutorialsLoading, setTutorialsLoading] = useState(true);
  const [videosLoading, setVideosLoading] = useState(true);
  const [storiesLoading, setStoriesLoading] = useState(true);
  const [blogsLoading, setblogsLoading] = useState(true);
  
  // Error states
  const [tutorialsError, setTutorialsError] = useState(null);
  const [videosError, setVideosError] = useState(null);
  const [storiesError, setStoriesError] = useState(null);
  const [blogsError, setBlogsError] = useState(null);

  // Fetch tutorials data
  useEffect(() => {
    const fetchTutorials = async () => {
      try {
        setTutorialsLoading(true);
        const res = await axios.get('/api/tutorials/get-tutorials');
        setTutorials(res.data);
        setTutorialsError(null);
      } catch (err) {
        console.error('Error fetching tutorials:', err);
        setTutorialsError('Failed to load tutorials. Please try again later.');
      } finally {
        setTutorialsLoading(false);
      }
    };

    fetchTutorials();
  }, []);

  // Fetch video tutorials data
  useEffect(() => {
    const fetchVideoTutorials = async () => {
      try {
        setVideosLoading(true);
        const res = await axios.get('/api/video-tutorials/get-video-tutorials');
        setVideoTutorials(res.data);
        setVideosError(null);
      } catch (err) {
        console.error('Error fetching video tutorials:', err);
        setVideosError('Failed to load video tutorials. Please try again later.');
      } finally {
        setVideosLoading(false);
      }
    };

    fetchVideoTutorials();
  }, []);

  // Fetch success stories data
  useEffect(() => {
    const fetchSuccessStories = async () => {
      try {
        setStoriesLoading(true);
        const res = await axios.get('/api/success-story/get-success-stories');
        setSuccessStories(res.data);
        setStoriesError(null);
      } catch (err) {
        console.error('Error fetching success stories:', err);
        setStoriesError('Failed to load success stories. Please try again later.');
      } finally {
        setStoriesLoading(false);
      }
    };

    fetchSuccessStories();
  }, []);

  // Fetch blog posts data
  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setblogsLoading(true);
        const res = await axios.get('/api/blog-post/get-blog-posts');
        setBlogPosts(res.data);
        setBlogsError(null);
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setBlogsError('Failed to load blog posts. Please try again later.');
      } finally {
        setblogsLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  const openVideoModal = (video) => {
    setCurrentVideo(video);
    setOpenModal(true);
  };

  // Custom tab navigation
  const tabItems = [
    { name: 'App Tutorial', icon: <BookOpen size={20} /> },
    { name: 'Video Education', icon: <Video size={20} /> },
    { name: 'Success Stories', icon: <Trophy size={20} /> },
    { name: 'Community & Blogs', icon: <Users size={20} /> }
  ];

  // Loading component
  const LoadingState = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <Spinner size="xl" color="purple" />
      <p className="mt-4 text-gray-300">Loading content...</p>
    </div>
  );

  // Error component
  const ErrorState = ({ message }) => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <AlertCircle size={48} className="text-red-500 mb-4" />
      <p className="text-red-400">{message}</p>
      <Button color="purple" className="mt-4" onClick={() => window.location.reload()}>
        Retry
      </Button>
    </div>
  );

  // Render tab content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 0: // App Tutorial
        if (tutorialsLoading) return <LoadingState />;
        if (tutorialsError) return <ErrorState message={tutorialsError} />;
        if (!tutorials.length) return <ErrorState message="No tutorials available" />;
        
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {tutorials.map((tutorial) => (
              <Card key={tutorial._id} className="bg-gray-800 text-white">
                <h3 className="text-xl font-bold text-purple-400">{tutorial.title}</h3>
                <p className="text-gray-300 mb-4">{tutorial.description}</p>
                <ol className="list-decimal pl-5 space-y-2">
                  {tutorial.steps.map((step, i) => (
                    <li key={i} className="text-gray-300">{step}</li>
                  ))}
                </ol>
                <Button gradientDuoTone="purpleToBlue" className="mt-4">
                  Start Tutorial <ChevronRight size={16} className="ml-2" />
                </Button>
              </Card>
            ))}
          </div>
        );

      case 1: // Video Education
        if (videosLoading) return <LoadingState />;
        if (videosError) return <ErrorState message={videosError} />;
        if (!videoTutorials.length) return <ErrorState message="No video tutorials available" />;
        
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {videoTutorials.map((video) => (
              <Card key={video._id} className="bg-gray-800 text-white">
                <div className="relative">
                  <img src={video.thumbnail || '/api/placeholder/600/400'} alt={video.title} className="rounded-lg" />
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 px-2 py-1 rounded">
                    {video.duration}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-purple-400 mt-3">{video.title}</h3>
                <p className="text-gray-300">{video.description}</p>
                <Button color="purple" onClick={() => openVideoModal(video)} className="mt-3">
                  Watch Video
                </Button>
              </Card>
            ))}
          </div>
        );

      case 2: // Success Stories
        if (storiesLoading) return <LoadingState />;
        if (storiesError) return <ErrorState message={storiesError} />;
        if (!successStories.length) return <ErrorState message="No success stories available" />;
        
        // Fixed success stories display - using cards instead of carousel
        return (
          <div className="mt-6">
            {/* Display success stories in a grid for better compatibility */}
            <div className="grid grid-cols-1 gap-6">
              {successStories.map((story) => (
                <Card key={story._id} className="bg-gray-800 text-white">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <img src={story.image || '/api/placeholder/300/200'} alt={story.client} className="rounded-lg w-full md:w-64 h-auto" />
                    <div>
                      <h3 className="text-2xl font-bold text-purple-400">{story.client}</h3>
                      <p className="text-gray-300">Industry: {story.industry}</p>
                      <p className="text-green-400 font-bold text-lg mt-2">{story.result}</p>
                      <blockquote className="border-l-4 border-purple-500 pl-4 mt-4 italic">
                        "{story.quote}"
                      </blockquote>
                      {story.fullCaseStudyUrl && (
                        <Button outline gradientDuoTone="purpleToPink" className="mt-4" onClick={() => window.open(story.fullCaseStudyUrl, '_blank')}>
                          Read Full Case Study
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            
            {/* Alternative: Simple carousel implementation that doesn't rely on Flowbite's Carousel */}
            <div className="mt-8">
              <h3 className="text-2xl font-bold mb-6 text-center">More Success Stories</h3>
              <div className="flex overflow-x-auto gap-6 pb-4">
                {successStories.map((story) => (
                  <div key={`scroll-${story._id}`} className="flex-shrink-0 w-full max-w-md bg-gray-800 p-6 rounded-lg">
                    <h3 className="text-xl font-bold text-purple-400">{story.client}</h3>
                    <p className="text-green-400">{story.result}</p>
                    <p className="text-gray-300 mt-2 italic">"{story.quote.substring(0, 120)}..."</p>
                    <Button color="purple" size="sm" className="mt-3">View Details</Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 3: // Community & Blogs
        if (blogsLoading) return <LoadingState />;
        if (blogsError) return <ErrorState message={blogsError} />;
        if (!blogPosts.length) return <ErrorState message="No blog posts available" />;
        
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              {blogPosts.map((post) => (
                <Card key={post._id} className="bg-gray-800 text-white">
                  <h3 className="text-xl font-bold text-purple-400">{post.title}</h3>
                  <p className="text-gray-300 mb-4">{post.excerpt}</p>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>By {post.author}</span>
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                  </div>
                  {post.readMoreUrl && (
                    <Button color="light" className="mt-4" onClick={() => window.open(post.readMoreUrl, '_blank')}>
                      Read Article
                    </Button>
                  )}
                </Card>
              ))}
            </div>
            <div className="mt-10 text-center">
              <h3 className="text-2xl font-bold mb-4">Join Our Community</h3>
              <p className="text-gray-300 mb-6">
                Connect with other marketers and digital advertising professionals to share insights,
                ask questions, and grow together.
              </p>
              <div className="flex justify-center gap-4">
                <Button gradientDuoTone="purpleToBlue">Join Forum</Button>
                <Button outline gradientDuoTone="purpleToPink">Upcoming Webinars</Button>
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-900 text-white p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold mb-4">App Usage Tutor</h1>
          <p className="text-lg text-gray-300">
            Learn how to make the most of Ishtehaar's digital marketing platform
          </p>
        </div>

        {/* Custom Tab Navigation */}
        <div className="border-b border-gray-700">
          <div className="flex overflow-x-auto">
            {tabItems.map((tab, index) => (
              <button
                key={index}
                className={`flex items-center py-4 px-6 ${
                  activeTab === index
                    ? 'text-purple-400 border-b-2 border-purple-400 font-medium'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
                onClick={() => setActiveTab(index)}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {renderTabContent()}
        </div>
      </div>

      {/* Video Modal */}
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>
          {currentVideo?.title}
        </Modal.Header>
        <Modal.Body>
          <div className="relative aspect-video">
            {currentVideo?.videoUrl ? (
              <iframe
                src={currentVideo.videoUrl}
                className="w-full h-full rounded"
                title={currentVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <>
                <img 
                  src={currentVideo?.thumbnail || '/api/placeholder/600/400'} 
                  alt={currentVideo?.title} 
                  className="w-full h-full object-cover rounded"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-purple-600 rounded-full p-4">
                    <Video size={32} />
                  </div>
                </div>
              </>
            )}
          </div>
          <p className="mt-4 text-gray-700">{currentVideo?.description}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={() => setOpenModal(false)}>
            Close
          </Button>
          <Button color="purple">
            Download Resources
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AppUsageTutor;