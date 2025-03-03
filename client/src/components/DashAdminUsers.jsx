import { Modal, Table, Button, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { HiOutlineExclamationCircle, HiOutlineTrash } from "react-icons/hi";
import { FaCheck, FaTimes, FaChevronDown } from "react-icons/fa";

export default function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState("");
  const [screenSize, setScreenSize] = useState({
    isMobile: window.innerWidth < 640,
    isMedium: window.innerWidth >= 640 && window.innerWidth < 1024
  });

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Handle responsive layout
    const handleResize = () => {
      setScreenSize({
        isMobile: window.innerWidth < 640,
        isMedium: window.innerWidth >= 640 && window.innerWidth < 1024
      });
    };
    
    window.addEventListener('resize', handleResize);
    
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/user/getusers`);
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          if (data.users.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (currentUser.isAdmin) {
      fetchUsers();
    }
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = users.length;
    setLoading(true);
    try {
      const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => [...prev, ...data.users]);
        if (data.users.length < 1) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/user/admin-delete/${userIdToDelete}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  if (!currentUser.isAdmin) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 dark:text-gray-400">
          You don't have permission to view this page.
        </p>
      </div>
    );
  }

  // Mobile card view component for each user
  const MobileUserCard = ({ user }) => (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow mb-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <img
            src={user.profilePicture}
            alt={user.username}
            className="w-10 h-10 object-cover bg-gray-200 rounded-full"
          />
          <span className="font-medium text-gray-900 dark:text-white">{user.username}</span>
        </div>
        <Button
          color="failure"
          size="xs"
          pill
          onClick={() => {
            setShowModal(true);
            setUserIdToDelete(user._id);
          }}
          className="flex items-center"
        >
          <HiOutlineTrash className="mr-1" />
          Delete
        </Button>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="grid grid-cols-3">
          <span className="text-gray-500 dark:text-gray-400">Email:</span>
          <span className="col-span-2 text-gray-700 dark:text-gray-300 break-all">{user.email}</span>
        </div>
        
        <div className="grid grid-cols-3">
          <span className="text-gray-500 dark:text-gray-400">Status:</span>
          <span className="col-span-2">
            {user.isAdmin ? (
              <span className="flex items-center text-green-600">
                <FaCheck className="mr-1" /> Admin
              </span>
            ) : (
              <span className="flex items-center text-gray-500">
                <FaTimes className="mr-1" /> Regular User
              </span>
            )}
          </span>
        </div>
        
        <div className="grid grid-cols-3">
          <span className="text-gray-500 dark:text-gray-400">Joined:</span>
          <span className="col-span-2 text-gray-700 dark:text-gray-300">
            {new Date(user.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );

  // Medium screen card view component for each user (more compact than mobile, less detailed than desktop)
  const MediumUserCard = ({ user }) => (
    <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow mb-3 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-start">
        <div className="flex space-x-3">
          <img
            src={user.profilePicture}
            alt={user.username}
            className="w-10 h-10 object-cover bg-gray-200 rounded-full"
          />
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{user.username}</p>
            <p className="text-sm text-gray-700 dark:text-gray-300 break-all">{user.email}</p>
            <div className="flex items-center mt-1 text-sm">
              <span className="text-gray-500 dark:text-gray-400 mr-2">Joined:</span>
              <span className="text-gray-700 dark:text-gray-300">
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end">
          <div className="mb-2">
            {user.isAdmin ? (
              <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                <FaCheck className="mr-1" /> Admin
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                <FaTimes className="mr-1" /> Regular
              </span>
            )}
          </div>
          <Button
            color="failure"
            size="xs"
            pill
            onClick={() => {
              setShowModal(true);
              setUserIdToDelete(user._id);
            }}
            className="flex items-center"
          >
            <HiOutlineTrash className="mr-1" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-screen mx-auto pt-0 px-2 sm:px-4 lg:px-6 pb-4">
      <div className="mb-4 mt-0">
        <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white text-center mt-12">
          User Management
        </h2>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 text-center">
          Manage registered users and their permissions
        </p>
      </div>

      {loading && users.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="xl" />
        </div>
      ) : users.length > 0 ? (
        <>
          {/* Desktop table view (large screens) */}
          {!screenSize.isMobile && !screenSize.isMedium && (
            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-md">
              <Table hoverable>
                <Table.Head className="bg-gray-50 dark:bg-gray-700">
                  <Table.HeadCell className="py-3">Date</Table.HeadCell>
                  <Table.HeadCell>User</Table.HeadCell>
                  <Table.HeadCell>Email</Table.HeadCell>
                  <Table.HeadCell>Admin</Table.HeadCell>
                  <Table.HeadCell>Actions</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y divide-gray-200 dark:divide-gray-700">
                  {users.map((user) => (
                    <Table.Row 
                      key={user._id}
                      className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex items-center space-x-3">
                          <img
                            src={user.profilePicture}
                            alt={user.username}
                            className="w-10 h-10 object-cover bg-gray-200 rounded-full"
                          />
                          <span className="font-medium">{user.username}</span>
                        </div>
                      </Table.Cell>
                      <Table.Cell className="text-gray-700 dark:text-gray-300">
                        {user.email}
                      </Table.Cell>
                      <Table.Cell>
                        {user.isAdmin ? (
                          <span className="flex items-center text-green-600">
                            <FaCheck className="mr-2" /> Admin
                          </span>
                        ) : (
                          <span className="flex items-center text-gray-500">
                            <FaTimes className="mr-2" /> Regular User
                          </span>
                        )}
                      </Table.Cell>
                      <Table.Cell>
                        <Button
                          color="failure"
                          size="sm"
                          pill
                          onClick={() => {
                            setShowModal(true);
                            setUserIdToDelete(user._id);
                          }}
                          className="flex items-center"
                        >
                          <HiOutlineTrash className="mr-2" />
                          Delete
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
          )}
          
          {/* Medium screen card view (tablets, small laptops) */}
          {screenSize.isMedium && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {users.map((user) => (
                <MediumUserCard key={user._id} user={user} />
              ))}
            </div>
          )}
          
          {/* Small mobile card view */}
          {screenSize.isMobile && (
            <div className="space-y-4">
              {users.map((user) => (
                <MobileUserCard key={user._id} user={user} />
              ))}
            </div>
          )}
          
          {showMore && (
            <div className="flex justify-center p-3 sm:p-4 mt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                outline
                gradientDuoTone="cyanToBlue"
                onClick={handleShowMore}
                disabled={loading}
                className="w-full max-w-sm"
              >
                {loading ? (
                  <Spinner size="sm" className="mr-2" />
                ) : (
                  <FaChevronDown className="mr-2" />
                )}
                Load More Users
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="flex justify-center items-center h-64 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">
            No users found in the system.
          </p>
        </div>
      )}

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
            <h3 className="mb-5 text-lg font-medium text-gray-900 dark:text-white">
              Confirm User Deletion
            </h3>
            <p className="mb-6 text-sm sm:text-base text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteUser}>
                Yes, delete
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}