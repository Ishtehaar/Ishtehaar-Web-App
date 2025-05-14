import React, { useState, useEffect } from 'react';
import { Card, Button, Select, Radio, TextInput, Spinner, Alert, Badge, Progress } from 'flowbite-react';
import { HiInformationCircle, HiOutlineArrowRight, HiCheckCircle, HiArrowLeft, HiRefresh, HiSearch, HiTemplate, HiBookOpen } from 'react-icons/hi';
import axios from 'axios';

const BusinessDomainAssessment = () => {
  // States
  const [businessDomains, setBusinessDomains] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState('');
  const [surveys, setSurveys] = useState([]);
  const [currentSurvey, setCurrentSurvey] = useState(null);
  const [surveyResponses, setSurveyResponses] = useState({});
  const [loading, setLoading] = useState({
    domains: true,
    surveys: false,
    submission: false,
  });
  const [error, setError] = useState({
    domains: '',
    surveys: '',
    submission: '',
  });
  const [step, setStep] = useState(1); // 1: Domain Selection, 2: Survey, 3: Results
  const [userAssessment, setUserAssessment] = useState(null);
  const [expertiseLevels] = useState([
    { id: 'beginner', name: 'Beginner', color: 'blue' },
    { id: 'intermediate', name: 'Intermediate', color: 'indigo' },
    { id: 'advanced', name: 'Advanced', color: 'purple' },
    { id: 'expert', name: 'Expert', color: 'pink' },
  ]);

  // Fetch business domains on component mount
  useEffect(() => {
    const fetchBusinessDomains = async () => {
      try {
        const response = await axios.get('/api/business-domain/get-business-domains');
        setBusinessDomains(response.data);
        setLoading(prev => ({ ...prev, domains: false }));
      } catch (err) {
        setError(prev => ({ ...prev, domains: 'Failed to load business domains' }));
        setLoading(prev => ({ ...prev, domains: false }));
      }
    };
    
    // Fetch current user assessment
    const fetchUserAssessment = async () => {
      try {
        const response = await axios.get('/api/user/get-user-assessment');
        setUserAssessment(response.data);
        
        // If user already has a business domain, set it as selected
        if (response.data.businessDomain) {
          setSelectedDomain(response.data.businessDomain._id);
        }
      } catch (err) {
        console.error('Failed to fetch user assessment:', err);
      }
    };

    fetchBusinessDomains();
    fetchUserAssessment();
  }, []);

  // Fetch surveys when a domain is selected
  const fetchSurveys = async (domainId = null) => {
    setLoading(prev => ({ ...prev, surveys: true }));
    try {
      // Use the provided domainId parameter or fallback to selectedDomain from state
      const domainToUse = domainId || selectedDomain;
      
      // Add domain parameter to the API call to get domain-specific surveys
      const response = await axios.get(`/api/survey/get-surveys?domain=${domainToUse}`);
      setSurveys(response.data);
      
      // Start with the first survey if available
      if (response.data.length > 0) {
        await fetchSurveyDetails(response.data[0]._id);
      } else {
        console.log('No surveys available for the selected domain');
      }
      setLoading(prev => ({ ...prev, surveys: false }));
    } catch (err) {
      console.error('Failed to load surveys:', err);
      setError(prev => ({ ...prev, surveys: 'Failed to load surveys' }));
      setLoading(prev => ({ ...prev, surveys: false }));
    }
  };

  // Fetch specific survey details
  const fetchSurveyDetails = async (surveyId) => {
    try {
      const response = await axios.get(`/api/survey/get-survey/${surveyId}`);
      
      // Debug logging
      console.log('Survey details received:', response.data);
      
      // Check if the survey has questions
      if (!response.data.questions || response.data.questions.length === 0) {
        console.log('Survey has no questions:', response.data);
      }
      
      setCurrentSurvey(response.data);
      
      // Initialize responses for this survey
      const initialResponses = {};
      if (response.data.questions && Array.isArray(response.data.questions)) {
        response.data.questions.forEach(question => {
          initialResponses[question._id] = '';
        });
      }
      setSurveyResponses(initialResponses);
    } catch (err) {
      console.error('Failed to fetch survey details:', err);
    }
  };

  // Handle domain selection
  const handleDomainSelection = async () => {
    if (!selectedDomain) {
      setError(prev => ({ ...prev, domains: 'Please select a business domain' }));
      return;
    }

    try {
      await axios.post('/api/user/update-business-domain', {
        businessDomainId: selectedDomain
      });
      
      setStep(2);
      fetchSurveys();
    } catch (err) {
      setError(prev => ({ ...prev, domains: 'Failed to update business domain' }));
    }
  };

  // Handle survey response changes
  const handleResponseChange = (questionId, answer) => {
    setSurveyResponses(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  // Submit survey responses
  const handleSurveySubmission = async () => {
    // Check if all questions are answered
    const unansweredQuestions = Object.values(surveyResponses).filter(response => !response).length;
    if (unansweredQuestions > 0) {
      setError(prev => ({ ...prev, submission: `Please answer all questions (${unansweredQuestions} remaining)` }));
      return;
    }

    setLoading(prev => ({ ...prev, submission: true }));
    try {
      // Format responses for submission
      const formattedResponses = Object.keys(surveyResponses).map(questionId => ({
        question: questionId,
        answer: surveyResponses[questionId]
      }));

      const response = await axios.post(`/api/survey/submit-survey/${currentSurvey._id}`, {
        responses: formattedResponses
      });

      // After successful submission, refresh user assessment
      const assessmentResponse = await axios.get('/api/user/get-user-assessment');
      setUserAssessment(assessmentResponse.data);
      
      // Find next survey if available
      const currentIndex = surveys.findIndex(s => s._id === currentSurvey._id);
      if (currentIndex < surveys.length - 1) {
        await fetchSurveyDetails(surveys[currentIndex + 1]._id);
      } else {
        // If this was the last survey, show results
        setStep(3);
      }

      setError(prev => ({ ...prev, submission: '' }));
    } catch (err) {
      setError(prev => ({ ...prev, submission: 'Failed to submit survey responses' }));
    } finally {
      setLoading(prev => ({ ...prev, submission: false }));
    }
  };

  // Change business domain
  const handleChangeDomain = () => {
    setStep(1);
  };

  // Restart assessment
  const handleRestartAssessment = () => {
    setStep(2);
    fetchSurveys();
  };

  // Get expertise level badge based on score
  const getExpertiseLevel = (score) => {
    if (!score && score !== 0) return expertiseLevels[0];
    
    if (score > 80) return expertiseLevels[3]; // Expert
    if (score > 60) return expertiseLevels[2]; // Advanced
    if (score > 40) return expertiseLevels[1]; // Intermediate
    return expertiseLevels[0]; // Beginner
  };

  // Render domain selection step
  const renderDomainSelection = () => (
    <Card className="max-w-2xl mx-auto border-gray-700 shadow-lg">
      <h3 className="text-xl font-semibold mb-4   ">Select Your Business Domain</h3>
      
      {error.domains && (
        <Alert color="failure" icon={HiInformationCircle} className="mb-4">
          {error.domains}
        </Alert>
      )}
      
      <div className="mb-6">
        <p className="text-gray-400 mb-4">
          The more specific details you provide about your business, the more accurate and valuable
          your SEO recommendations will be.
        </p>
        <Select
          id="domain"
          value={selectedDomain}
          onChange={(e) => {
            setSelectedDomain(e.target.value);
            setError(prev => ({ ...prev, domains: '' }));
          }}
          disabled={loading.domains}
          required
          className=" border-gray-600 "
        >
          <option value="">Select business domain</option>
          {businessDomains.map((domain) => (
            <option key={domain._id} value={domain._id} className="">
              {domain.name}
            </option>
          ))}
        </Select>
      </div>
      
      <div className="flex justify-end">
        <Button 
          gradientDuoTone="purpleToBlue"
          disabled={loading.domains || !selectedDomain}
          onClick={handleDomainSelection}
          className="w-full"
        >
          Continue <HiOutlineArrowRight className="ml-2" />
        </Button>
      </div>
    </Card>
  );

  // Render survey step
  const renderSurvey = () => {
    if (loading.surveys) {
      return (
        <div className="flex justify-center my-8">
          <Spinner size="xl" color="purple" />
        </div>
      );
    }
    
    if (!currentSurvey) {
      return (
        <Card className="max-w-3xl mx-auto  border-gray-700 shadow-lg">
          <Alert color="failure" icon={HiInformationCircle}>
            No survey found. Please try selecting a different business domain.
          </Alert>
          <div className="flex justify-end mt-4">
            <Button gradientDuoTone="purpleToBlue" onClick={() => setStep(1)}>
              Back to Domain Selection
            </Button>
          </div>
        </Card>
      );
    }

    return (
      <Card className="max-w-3xl mx-auto border-gray-700 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">{currentSurvey.title}</h3>
          {surveys.length > 1 && (
            <Badge color="purple">
              Survey {surveys.findIndex(s => s._id === currentSurvey._id) + 1} of {surveys.length}
            </Badge>
          )}
        </div>
        
        <p className="mb-6">{currentSurvey.description}</p>
        
        {error.submission && (
          <Alert color="failure" icon={HiInformationCircle} className="mb-4">
            {error.submission}
          </Alert>
        )}
        
        <div className="space-y-6">
          {currentSurvey.questions && Array.isArray(currentSurvey.questions) && currentSurvey.questions.length > 0 ? (
            currentSurvey.questions.map((question, index) => (
              <div key={question._id} className="p-4 border border-gray-700 rounded-lg ">
                <p className="font-medium mb-3 ">
                  {index + 1}. {question.questionText}
                </p>
                
                <div className="ml-4">
                  {question.questionType === 'multiple-choice' && question.options && Array.isArray(question.options) && (
                    <div className="space-y-2">
                      {question.options.map(option => (
                        <div key={option._id} className="flex items-center">
                          <Radio
                            id={`option-${option._id}`}
                            name={`question-${question._id}`}
                            value={option._id}
                            checked={surveyResponses[question._id] === option._id}
                            onChange={() => handleResponseChange(question._id, option._id)}
                            className="mr-2"
                          />
                          <label htmlFor={`option-${option._id}`} className="">{option.text}</label>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {question.questionType === 'likert-scale' && (
                    <div className="flex flex-wrap gap-4">
                      {[1, 2, 3, 4, 5].map(value => (
                        <div key={value} className="flex flex-col items-center">
                          <Radio
                            id={`likert-${question._id}-${value}`}
                            name={`question-${question._id}`}
                            value={value.toString()}
                            checked={surveyResponses[question._id] === value.toString()}
                            onChange={() => handleResponseChange(question._id, value.toString())}
                            className="mb-1"
                          />
                          <label htmlFor={`likert-${question._id}-${value}`} className="">{value}</label>
                        </div>
                      ))}
                      <div className="w-full flex justify-between text-xs mt-1 ">
                        <span>Strongly Disagree</span>
                        <span>Strongly Agree</span>
                      </div>
                    </div>
                  )}
                  
                  {question.questionType === 'open-ended' && (
                    <TextInput
                      placeholder="Your answer"
                      value={surveyResponses[question._id] || ''}
                      onChange={(e) => handleResponseChange(question._id, e.target.value)}
                      className="w-full border-gray-600 text-white"
                    />
                  )}
                </div>
              </div>
            ))
          ) : (
            <Alert color="warning" icon={HiInformationCircle}>
              No questions available for this survey. Please contact support.
            </Alert>
          )}
        </div>
        
        <div className="flex justify-between mt-6">
          <Button 
            color="gray" 
            onClick={handleChangeDomain}
          >
            <HiArrowLeft className="mr-2" /> Change Domain
          </Button>
          
          {currentSurvey.questions && currentSurvey.questions.length > 0 && (
            <Button 
              gradientDuoTone="purpleToBlue"
              onClick={handleSurveySubmission}
              disabled={loading.submission}
            >
              {loading.submission ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Responses <HiOutlineArrowRight className="ml-2" />
                </>
              )}
            </Button>
          )}
        </div>
      </Card>
    );
  };

  // Render assessment results
  const renderResults = () => {
    if (!userAssessment) {
      return (
        <div className="flex justify-center my-8">
          <Spinner size="xl" color="purple" />
        </div>
      );
    }

    const marketingExpertise = getExpertiseLevel(userAssessment.marketingKnowledge);
    const domainExpertise = getExpertiseLevel(userAssessment.domainKnowledge);
    const overallExpertise = getExpertiseLevel(userAssessment.expertiseLevel);

    return (
      <Card className="max-w-3xl mx-auto  border-gray-700 shadow-lg">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-2 bg-purple-900 rounded-full mb-4">
            <HiCheckCircle className="h-12 w-12 text-purple-400" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Assessment Results</h3>
          <p className="">
            Here's a summary of your expertise levels based on your assessment.
          </p>
        </div>
        
        <div className="space-y-8 mb-8">
          <div>
            <div className="flex justify-between mb-1">
              <span className="font-medium text-white">Business Domain</span>
              {userAssessment.businessDomain && (
                <span className="text-purple-600">{userAssessment.businessDomain.name}</span>
              )}
            </div>
            {userAssessment.businessDomain && (
              <p className="text-sm  mb-4">{userAssessment.businessDomain.description}</p>
            )}
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium ">Marketing Knowledge</span>
              <Badge color={marketingExpertise.color}>{marketingExpertise.name}</Badge>
            </div>
            <Progress 
              progress={userAssessment.marketingKnowledge} 
              color={marketingExpertise.color} 
              className="mb-4"
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium ">Domain Knowledge</span>
              <Badge color={domainExpertise.color}>{domainExpertise.name}</Badge>
            </div>
            <Progress 
              progress={userAssessment.domainKnowledge} 
              color={domainExpertise.color}
              className="mb-4"
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium ">Overall Expertise Level</span>
              <Badge color={overallExpertise.color}>{overallExpertise.name}</Badge>
            </div>
            <Progress 
              progress={userAssessment.expertiseLevel} 
              color={overallExpertise.color}
            />
          </div>
        </div>
        
        <Alert color="purple" icon={HiInformationCircle} className="mb-4  border-blue-800">
          <div>
            <span className="font-medium ">What happens next?</span>
            <p className="mt-1 ">
              Based on your assessment results, our system will now tailor marketing strategies and recommendations 
              specifically for your business domain and expertise level.
            </p>
          </div>  
        </Alert>
        
        <div className="flex justify-between mt-6">
          <div className="space-x-2">
            <Button color="gray" onClick={handleChangeDomain}>
              <HiArrowLeft className="mr-2" /> Change Domain
            </Button>
          </div>
          
          <Button gradientDuoTone="purpleToBlue" onClick={() => window.location.href = '/dashboard'}>
            Go to Dashboard
          </Button>
        </div>
      </Card>
    );
  };

  // Main render function
  return (
    <div className="container mx-auto px-4 py-8 ">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2 ">Business Domain Assessment</h2>
        <p className=" max-w-xl mx-auto">
          Optimize your website's search engine visibility with AI-powered SEO recommendations
          tailored specifically for your business domain.
        </p>
      </div>
      
      <div className="max-w-3xl mx-auto mb-8">
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className={`p-4 text-center rounded-lg ${step >= 1 ? 'bg-blue-900 ' : 'bg-gray-800'}`}>
            <div className={`flex items-center justify-center mb-2 ${step >= 1 ? 'text-blue-300' : 'text-gray-500'}`}>
              <HiSearch className="w-6 h-6" />
            </div>
            <h3 className={`text-sm font-medium ${step >= 1 ? 'text-blue-500' : 'text-gray-500'}`}>Business Domain</h3>
          </div>
          
          <div className={`p-4 text-center rounded-lg ${step >= 2 ? 'bg-blue-900' : 'bg-gray-800'}`}>
            <div className={`flex items-center justify-center mb-2 ${step >= 2 ? 'text-blue-300' : 'text-gray-500'}`}>
              <HiTemplate className="w-6 h-6" />
            </div>
            <h3 className={`text-sm font-medium ${step >= 2 ? 'text-blue-300' : 'text-gray-500'}`}>Assessment</h3>
          </div>
          
          <div className={`p-4 text-center rounded-lg ${step >= 3 ? 'bg-blue-900 ' : 'bg-gray-800'}`}>
            <div className={`flex items-center justify-center mb-2 ${step >= 3 ? 'text-blue-300' : 'text-gray-500'}`}>
              <HiBookOpen className="w-6 h-6" />
            </div>
            <h3 className={`text-sm font-medium ${step >= 3 ? 'text-blue-300' : 'text-gray-500'}`}>Results</h3>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        {step === 1 && renderDomainSelection()}
        {step === 2 && renderSurvey()}
        {step === 3 && renderResults()}
      </div>
    </div>
  );
};

export default BusinessDomainAssessment;