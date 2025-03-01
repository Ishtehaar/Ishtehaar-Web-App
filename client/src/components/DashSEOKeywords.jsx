import React, { useState } from 'react';
import { Button, Card, Label, TextInput, Spinner, Alert } from 'flowbite-react';

export default function DashSEOKeywords() {
  const [domain, setDomain] = useState('');
  const [seoContent, setSeoContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateKeywords = async () => {
    if (!domain.trim()) {
      setError('Please enter your business domain');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Your tested API endpoint
      const response = await fetch('/api/keywords/generate-keywords', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: domain }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate SEO recommendations');
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        setSeoContent(data.data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while generating SEO recommendations');
    } finally {
      setLoading(false);
    }
  };

  // Parse the sections from the content string
  const parseContentSections = () => {
    if (!seoContent) return {};
    
    const sections = {};
    
    // Try to extract main sections using headers as delimiters
    const titleMatch = seoContent.match(/### Title:(.*?)(?=###|$)/s);
    const headingsMatch = seoContent.match(/### Headings:(.*?)(?=###|$)/s);
    const metaMatch = seoContent.match(/### Meta Description:(.*?)(?=###|$)/s);
    const bodyMatch = seoContent.match(/### Body Content:(.*?)(?=###|$)/s);
    const tipsMatch = seoContent.match(/### Additional Tips:(.*?)(?=###|$)/s);
    
    if (titleMatch) sections.title = titleMatch[1].trim();
    if (headingsMatch) sections.headings = headingsMatch[1].trim();
    if (metaMatch) sections.meta = metaMatch[1].trim();
    if (bodyMatch) sections.body = bodyMatch[1].trim();
    if (tipsMatch) sections.tips = tipsMatch[1].trim();
    
    return sections;
  };

  const sections = parseContentSections();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header section */}
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold  mb-2">SEO Assistant</h1>
        <p className=" max-w-2xl mx-auto">
          Optimize your website's search engine visibility with AI-powered SEO recommendations 
          tailored specifically for your business domain.
        </p>
      </div>

      <Card className="mb-6 shadow-sm">
        <div className="mb-4">
          <div className="mb-2 block">
            <Label htmlFor="domain" value="Business Domain" className="text-base font-medium" />
          </div>
          <TextInput
            id="domain"
            placeholder="e.g. Food truck business, Digital marketing agency, E-commerce store"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            required
            className="w-full"
            sizing="lg"
          />
          <p className="mt-2 text-sm text-gray-500">
            Provide details about your business to receive more accurate recommendations
          </p>
        </div>
        
        <Button 
          color="blue" 
          onClick={handleGenerateKeywords}
          disabled={loading}
          className="w-full"
          size="lg"
        >
          {loading ? (
            <>
              <Spinner size="sm" className="mr-2" />
              Generating SEO Recommendations...
            </>
          ) : (
            'Generate SEO Recommendations'
          )}
        </Button>
      </Card>

      {error && (
        <Alert color="failure" className="mb-6 shadow-sm">
          {error}
        </Alert>
      )}

      {seoContent && (
        <Card className="shadow-sm">
          <div className="border-b pb-3 mb-4">
            <h3 className="text-xl font-bold ">SEO Content Recommendations</h3>
            <p className="text-sm text-gray-500">Based on your business domain information</p>
          </div>
          
          <div className="space-y-5">
            {sections.title && (
              <div className="border border-gray-200 rounded-lg p-4 ">
                <h4 className="font-bold text-lg mb-2 ">Title Suggestions</h4>
                <div className="whitespace-pre-line text-sm ">{sections.title}</div>
              </div>
            )}
            
            {sections.headings && (
              <div className="border border-gray-200 rounded-lg p-4 ">
                <h4 className="font-bold text-lg mb-2 ">Heading Suggestions</h4>
                <div className="whitespace-pre-line text-sm">{sections.headings}</div>
              </div>
            )}
            
            {sections.meta && (
              <div className="border border-gray-200 rounded-lg p-4 ">
                <h4 className="font-bold text-lg mb-2">Meta Description</h4>
                <div className="whitespace-pre-line text-sm">{sections.meta}</div>
              </div>
            )}
            
            {sections.body && (
              <div className="border border-gray-200 rounded-lg p-4 ">
                <h4 className="font-bold text-lg mb-2 ">Body Content Structure</h4>
                <div className="whitespace-pre-line text-sm">{sections.body}</div>
              </div>
            )}
            
            {sections.tips && (
              <div className="border border-gray-200 rounded-lg p-4 ">
                <h4 className="font-bold text-lg mb-2 ">Additional Tips</h4>
                <div className="whitespace-pre-line text-sm">{sections.tips}</div>
              </div>
            )}
          </div>
          
          <div className="mt-6 flex gap-3 justify-end">
            <Button 
              color="light" 
              onClick={() => {
                navigator.clipboard.writeText(seoContent);
              }}
              className="font-medium"
            >
              Copy All Content
            </Button>
            
            <Button 
              color="gray" 
              onClick={() => setSeoContent('')}
              className="font-medium"
            >
              Clear Results
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}