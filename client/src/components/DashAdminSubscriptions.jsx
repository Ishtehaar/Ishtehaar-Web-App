import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { 
  Button,
  Card,
  Checkbox,
  Label,
  TextInput,
  Table,
  Badge,
  Spinner,
  Alert,
  Modal
} from 'flowbite-react';

export default function DashAdminSubscriptions() {
  const { currentUser } = useSelector((state) => state.user);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [formData, setFormData] = useState({
    planName: '',
    planPrice: 0,
    features: [],
    isRecommended: false,
    buttonText: '',
    buttonUrl: '',
  });
  const [feature, setFeature] = useState('');
  
  // Modal state
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);

  // Fetch all subscription plans
  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        setPageLoading(true);
        const res = await fetch('/api/subscription/get-subscriptions', {
          headers: {
            'Authorization': `Bearer ${currentUser.token}`
          }
        });
        const data = await res.json();
        
        if (data.success) {
          setSubscriptions(data.data);
        } else {
          toast.error(data.message || 'Failed to fetch subscriptions');
        }
      } catch (error) {
        toast.error('Error fetching subscriptions');
      } finally {
        setPageLoading(false);
      }
    };

    if (currentUser?.isAdmin) {
      fetchSubscriptions();
    } else {
      setPageLoading(false);
    }
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleFeatureAdd = () => {
    if (feature.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, feature.trim()]
      });
      setFeature('');
    }
  };

  const handleFeatureDelete = (index) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures.splice(index, 1);
    setFormData({
      ...formData,
      features: updatedFeatures
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      let url = '/api/subscription/create-subscription';
      let method = 'POST';
      
      if (editMode && selectedPlan) {
        url = `/api/subscription/update-subscription/${selectedPlan._id}`;
        method = 'PUT';
      }
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (data.success || (method === 'POST' && data.savedPlan)) {
        toast.success(data.message || 'Subscription plan updated successfully');
        
        // Refresh subscriptions list
        const refreshRes = await fetch('/api/subscription/get-subscriptions', {
          headers: {
            'Authorization': `Bearer ${currentUser.token}`
          }
        });
        const refreshData = await refreshRes.json();
        
        if (refreshData.success) {
          setSubscriptions(refreshData.data);
        }
        
        resetForm();
      } else {
        toast.error(data.message || 'Operation failed');
      }
    } catch (error) {
      toast.error('Error processing your request');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (plan) => {
    setEditMode(true);
    setSelectedPlan(plan);
    setFormData({
      planName: plan.planName,
      planPrice: plan.planPrice,
      features: plan.features || [],
      isRecommended: plan.isRecommended,
      buttonText: plan.buttonText,
      buttonUrl: plan.buttonUrl,
    });
  };

  const openDeleteConfirmation = (plan) => {
    setPlanToDelete(plan);
    setOpenDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!planToDelete) return;
    
    try {
      setLoading(true);
      const res = await fetch(`/api/subscription/delete-subscription/${planToDelete._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${currentUser.token}`
        }
      });
      
      const data = await res.json();
      
      if (data.success) {
        toast.success(data.message || 'Plan deleted successfully');
        setSubscriptions(subscriptions.filter(plan => plan._id !== planToDelete._id));
        setOpenDeleteModal(false);
        setPlanToDelete(null);
      } else {
        toast.error(data.message || 'Failed to delete plan');
      }
    } catch (error) {
      toast.error('Error deleting subscription plan');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      planName: '',
      planPrice: 0,
      features: [],
      isRecommended: false,
      buttonText: '',
      buttonUrl: '',
    });
    setEditMode(false);
    setSelectedPlan(null);
  };

  if (!currentUser?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert color="failure" className="max-w-md w-full">
          <span className="font-medium">Access denied.</span> Admin privileges required.
        </Alert>
      </div>
    );
  }

  if (pageLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center mx-auto">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-t-purple-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-md text-gray-500">Loading subscription data...</p>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-4 w-full max-w-6xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8 text-center mt-4">Subscription Plan Management</h1>
      
      <Card className="mb-6 sm:mb-10 overflow-hidden">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 border-b pb-2">
          {editMode ? 'Edit Subscription Plan' : 'Create New Subscription Plan'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="planName" value="Plan Name*" />
              </div>
              <TextInput
                id="planName"
                name="planName"
                value={formData.planName}
                onChange={handleInputChange}
                required
                className="w-full"
              />
            </div>
            
            <div>
              <div className="mb-2 block">
                <Label htmlFor="planPrice" value="Price*" />
              </div>
              <TextInput
                id="planPrice"
                name="planPrice"
                type="number"
                min="0"
                value={formData.planPrice}
                onChange={handleInputChange}
                required
                className="w-full"
              />
            </div>
            
            <div>
              <div className="mb-2 block">
                <Label htmlFor="buttonText" value="Button Text*" />
              </div>
              <TextInput
                id="buttonText"
                name="buttonText"
                value={formData.buttonText}
                onChange={handleInputChange}
                required
                className="w-full"
              />
            </div>
            
            <div>
              <div className="mb-2 block">
                <Label htmlFor="buttonUrl" value="Button URL*" />
              </div>
              <TextInput
                id="buttonUrl"
                name="buttonUrl"
                value={formData.buttonUrl}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
          </div>
          
          <div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="isRecommended"
                name="isRecommended"
                checked={formData.isRecommended}
                onChange={handleInputChange}
              />
              <Label htmlFor="isRecommended">
                Recommended Plan
              </Label>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              This plan will be highlighted on the pricing page
            </p>
          </div>
          
          <div>
            <Label value="Plan Features" className="mb-2 block" />
            
            <div className="flex mb-2 gap-2">
              <TextInput
                value={feature}
                onChange={(e) => setFeature(e.target.value)}
                placeholder="Add a feature"
                className="rounded-r-none flex-grow"
              />
              <Button 
                gradientDuoTone="purpleToBlue" 
                onClick={handleFeatureAdd}
                className="rounded-l-none"
              >
                Add
              </Button>
            </div>
            
            <Card className="bg-gray-50">
              {formData.features.length === 0 ? (
                <p className="text-gray-500 text-sm">No features added yet</p>
              ) : (
                <ul className="list-disc pl-5 space-y-1 max-h-40 overflow-y-auto">
                  {formData.features.map((feat, index) => (
                    <li key={index} className="flex justify-between items-center text-gray-500 break-words pr-2">
                      <span className="mr-2">{feat}</span>
                      <Button
                        size="xs"
                        color="failure"
                        onClick={() => handleFeatureDelete(index)}
                        className="shrink-0"
                      >
                        ✕
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              type="submit"
              gradientDuoTone="purpleToPink"
              disabled={loading}
              className="flex-1 w-full"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="mr-3">
                    <div className="h-4 w-4 border-2 border-current border-r-transparent rounded-full animate-spin"></div>
                  </div>
                  Processing...
                </div>
              ) : (
                editMode ? 'Update Plan' : 'Create Plan'
              )}
            </Button>
            
            {editMode && (
              <Button
                color="gray"
                onClick={resetForm}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Card>
      
      <Card className="overflow-hidden">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 border-b pb-2">Existing Subscription Plans</h2>
        
        {loading && !subscriptions.length ? (
          <div className="py-10 text-center text-gray-500 flex flex-col items-center">
            <div className="relative w-12 h-12">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full"></div>
              <div className="absolute top-0 left-0 w-full h-full border-4 border-t-purple-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            </div>
            <p className="mt-2">Loading plans...</p>
          </div>
        ) : subscriptions.length === 0 ? (
          <div className="py-10 text-center text-gray-500">No subscription plans found</div>
        ) : (
          <div className="overflow-x-auto">
            <Table striped>
              <Table.Head>
                <Table.HeadCell>Plan Name</Table.HeadCell>
                <Table.HeadCell>Price</Table.HeadCell>
                <Table.HeadCell className="hidden sm:table-cell">Recommended</Table.HeadCell>
                <Table.HeadCell className="hidden md:table-cell">Features</Table.HeadCell>
                <Table.HeadCell>Actions</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {subscriptions.map((plan) => (
                  <Table.Row key={plan._id} className="bg-white">
                    <Table.Cell className="whitespace-nowrap font-medium">
                      {plan.planName}
                      <div className="sm:hidden mt-1">
                        ${plan.planPrice} {plan.isRecommended && <Badge color="success" className="ml-2">Recommended</Badge>}
                      </div>
                    </Table.Cell>
                    <Table.Cell className="hidden sm:table-cell">${plan.planPrice}</Table.Cell>
                    <Table.Cell className="hidden sm:table-cell">
                      {plan.isRecommended ? (
                        <Badge color="success">
                          Recommended
                        </Badge>
                      ) : (
                        <Badge color="gray">
                          Standard
                        </Badge>
                      )}
                    </Table.Cell>
                    <Table.Cell className="hidden md:table-cell">
                      <div className="max-h-20 overflow-y-auto">
                        {plan.features && plan.features.length > 0 ? (
                          <ul className="list-disc pl-5 text-sm">
                            {plan.features.slice(0, 3).map((feature, idx) => (
                              <li key={idx}>{feature}</li>
                            ))}
                            {plan.features.length > 3 && (
                              <li className="text-gray-500">
                                +{plan.features.length - 3} more...
                              </li>
                            )}
                          </ul>
                        ) : (
                          <span className="text-gray-500 text-sm">No features</span>
                        )}
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex gap-2">
                        <Button
                          color="info"
                          size="xs"
                          onClick={() => handleEdit(plan)}
                        >
                          Edit
                        </Button>
                        <Button
                          color="failure"
                          size="xs"
                          onClick={() => openDeleteConfirmation(plan)}
                        >
                          Delete
                        </Button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        show={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <h3 className="mb-5 text-lg font-normal text-gray-500">
              Are you sure you want to delete the "{planToDelete?.planName}" plan?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="h-4 w-4 border-2 border-current border-r-transparent rounded-full animate-spin"></div>
                    <span className="ml-2">Deleting...</span>
                  </div>
                ) : "Yes, I'm sure"}
              </Button>
              <Button
                color="gray"
                onClick={() => setOpenDeleteModal(false)}
              >
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}