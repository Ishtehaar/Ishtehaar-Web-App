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
        body: JSON.stringify({ prompt   : domain }),
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
    <div className="p-4 max-w-3xl mx-auto">
      <Card className="mb-4">
        <h2 className="text-2xl font-bold mb-4">SEO Content Generator</h2>
        <p className="mb-4 text-gray-600">
          Enter your business domain and we'll generate SEO content recommendations using AI.
        </p>
        
        <div className="mb-4">
          <div className="mb-2 block">
            <Label htmlFor="domain" value="Business Domain" />
          </div>
          <TextInput
            id="domain"
            placeholder="e.g. Food truck business, Digital marketing agency"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            required
          />
        </div>
        
        <Button 
          color="blue" 
          onClick={handleGenerateKeywords}
          disabled={loading}
          className="w-full"
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
        <Alert color="failure" className="mb-4">
          {error}
        </Alert>
      )}

      {seoContent && (
        <Card>
          <h3 className="text-xl font-bold mb-3">SEO Content Recommendations</h3>
          
          <div className="space-y-4">
            {sections.title && (
              <div className="border rounded p-3">
                <h4 className="font-bold text-lg mb-2">Title Suggestions</h4>
                <div className="whitespace-pre-line">{sections.title}</div>
              </div>
            )}
            
            {sections.headings && (
              <div className="border rounded p-3">
                <h4 className="font-bold text-lg mb-2">Heading Suggestions</h4>
                <div className="whitespace-pre-line">{sections.headings}</div>
              </div>
            )}
            
            {sections.meta && (
              <div className="border rounded p-3">
                <h4 className="font-bold text-lg mb-2">Meta Description</h4>
                <div className="whitespace-pre-line">{sections.meta}</div>
              </div>
            )}
            
            {sections.body && (
              <div className="border rounded p-3">
                <h4 className="font-bold text-lg mb-2">Body Content Structure</h4>
                <div className="whitespace-pre-line">{sections.body}</div>
              </div>
            )}
            
            {sections.tips && (
              <div className="border rounded p-3">
                <h4 className="font-bold text-lg mb-2">Additional Tips</h4>
                <div className="whitespace-pre-line">{sections.tips}</div>
              </div>
            )}
          </div>
          
          <div className="mt-4 flex gap-2">
            <Button color="light" onClick={() => {
              navigator.clipboard.writeText(seoContent);
            }}>
              Copy All Content
            </Button>
            
            <Button color="gray" onClick={() => setSeoContent('')}>
              Clear Results
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}