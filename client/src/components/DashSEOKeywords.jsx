import React, { useState } from "react";
import { Button, Card, Label, TextInput, Spinner, Alert } from "flowbite-react";
import { Info, Search, Copy, X } from "lucide-react";

export default function DashSEOKeywords() {
  const [domain, setDomain] = useState("");
  const [seoContent, setSeoContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerateKeywords = async () => {
    if (!domain.trim()) {
      setError("Please enter your business domain");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Your tested API endpoint

      const response = await fetch("/api/keywords/generate-keywords", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: domain }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate SEO recommendations");
      }

      const data = await response.json();

      if (data.success && data.data) {
        setSeoContent(data.data);
      } else {
        throw new Error("Invalid response format");
      }
      const manipulateResponse = await fetch(
        "/api/keywords/manipulate-keywords",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (err) {
      setError(
        err.message || "An error occurred while generating SEO recommendations"
      );
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
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-4">SEO Assistant</h1>
        <p className="max-w-2xl mx-auto text-gray-500">
          Optimize your website's search engine visibility with AI-powered SEO
          recommendations tailored specifically for your business domain.
        </p>
      </div>

      {!seoContent && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-sm col-span-1">
            <div className="flex items-center mb-2">
              <Search className="w-5 h-5 mr-2" />
              <h3 className="font-semibold">Keyword Optimization</h3>
            </div>
            <p className="text-sm text-gray-500">
              Discover high-performing keywords that align with your business
              goals and users search intent.
            </p>
          </Card>

          <Card className="shadow-sm col-span-1">
            <div className="flex items-center mb-2">
              <Info className="w-5 h-5 mr-2" />
              <h3 className="font-semibold">Content Strategy</h3>
            </div>
            <p className="text-sm text-gray-500">
              Get structured recommendations for titles, headings, and meta
              descriptions that drive engagement.
            </p>
          </Card>

          <Card className="shadow-sm col-span-1">
            <div className="flex items-center mb-2">
              <Info className="w-5 h-5 mr-2" />
              <h3 className="font-semibold">SEO Best Practices</h3>
            </div>
            <p className="text-sm text-gray-500">
              Learn industry-specific tips to improve your website's visibility
              and ranking in search results across browsers.
            </p>
          </Card>
        </div>
      )}

      <Card className="mb-6 shadow-md border-t-4 border-blue-500">
        <div className="mb-5">
          <div className="mb-3 block">
            <Label
              htmlFor="domain"
              value="What's your business about?"
              className="text-lg font-medium"
            />
          </div>
          <TextInput
            id="domain"
            placeholder="e.g. Organic skincare products, Real estate agency in Miami, Custom guitar shop"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            required
            sizing="md"
            className="w-full"
          />
          <div className="mt-3 flex items-start">
            <Info className="w-4 h-4 text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-sm text-gray-500">
              The more specific details you provide about your business,
              location, and target audience, the more accurate and valuable your
              SEO recommendations will be.
            </p>
          </div>
        </div>

        <Button
          gradientDuoTone="purpleToPink"
          onClick={handleGenerateKeywords}
          disabled={loading}
          className="w-full font-medium"
          size="md"
        >
          {loading ? (
            <>
              <Spinner size="sm" className="mr-2" />
              Generating SEO Recommendations...
            </>
          ) : (
            "Generate SEO Recommendations"
          )}
        </Button>
      </Card>

      {error && (
        <Alert color="failure" className="mb-6 shadow-sm">
          {error}
        </Alert>
      )}

      {seoContent && (
        <Card className="shadow-md">
          <div className="border-b pb-4 mb-6">
            <h3 className="text-xl font-bold">SEO Content Recommendations</h3>
            <p className="text-sm text-gray-500 mt-1">
              Based on your business domain:{" "}
              <span className="font-medium">{domain}</span>
            </p>
          </div>

          <div className="space-y-6">
            {sections.title && (
              <div className="border border-gray-200 rounded-lg p-5">
                <h4 className="font-bold text-lg mb-3 ">Title Suggestions</h4>
                <div className="whitespace-pre-line text-gray-500">
                  {sections.title}
                </div>
              </div>
            )}

            {sections.headings && (
              <div className="border border-gray-200 rounded-lg p-5">
                <h4 className="font-bold text-lg mb-3 ">Heading Suggestions</h4>
                <div className="whitespace-pre-line text-gray-500">
                  {sections.headings}
                </div>
              </div>
            )}

            {sections.meta && (
              <div className="border border-gray-200 rounded-lg p-5">
                <h4 className="font-bold text-lg mb-3 ">Meta Description</h4>
                <div className="whitespace-pre-line text-gray-500">
                  {sections.meta}
                </div>
              </div>
            )}

            {sections.body && (
              <div className="border border-gray-200 rounded-lg p-5">
                <h4 className="font-bold text-lg mb-3 ">
                  Body Content Structure
                </h4>
                <div className="whitespace-pre-line text-gray-500">
                  {sections.body}
                </div>
              </div>
            )}

            {sections.tips && (
              <div className="border border-gray-200 rounded-lg p-5">
                <h4 className="font-bold text-lg mb-3 ">Additional Tips</h4>
                <div className="whitespace-pre-line text-gray-500">
                  {sections.tips}
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 flex gap-3 justify-end">
            <Button
              color="light"
              onClick={() => {
                navigator.clipboard.writeText(seoContent);
              }}
              className="font-medium flex items-center"
            >
              <Copy className="w-4 h-4 mr-2" /> Copy All Content
            </Button>

            <Button
              color="gray"
              onClick={() => setSeoContent("")}
              className="font-medium flex items-center"
            >
              <X className="w-4 h-4 mr-2" /> Clear Results
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
