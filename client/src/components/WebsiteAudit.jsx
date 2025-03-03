import { useState, useEffect } from "react";
import {
  Card,
  Button,
  TextInput,
  Alert,
  Progress,
  Spinner,
  Badge,
  Modal,
} from "flowbite-react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

export default function LighthouseAudit() {
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [auditResult, setAuditResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageSrc, setImageSrc] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentMetric, setCurrentMetric] = useState({
    title: "",
    description: "",
  });

  const runAudit = async () => {
    if (!websiteUrl) return;
    setLoading(true);
    setError(null);
    setAuditResult(null);
    try {
      const response = await fetch("/api/audit/website-audit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ websiteUrl }),
      });
      const data = await response.json();
      if (response.ok) {
        setAuditResult(data.result);
        console.log("Audit result:", data.result); // For debugging
        if (
          data.result.fullPageScreenshot &&
          data.result.fullPageScreenshot.screenshot
        ) {
          setImageSrc(data.result.fullPageScreenshot.screenshot.data);
        }
      } else {
        setError(data.error || "Failed to analyze website");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Function to show metric explanation in modal
  const showMetricExplanation = (title, key) => {
    const explanation = getMetricExplanation(key);
    setCurrentMetric({
      title: title,
      description: explanation,
    });
    setShowModal(true);
  };

  // Metric explanations
  const getMetricExplanation = (key) => {
    const explanations = {
      // Core Web Vitals
      performance:
        "Performance measures how quickly the page loads and becomes interactive. It considers First Contentful Paint, Speed Index, Largest Contentful Paint, Time to Interactive, Total Blocking Time, and Cumulative Layout Shift.",
      accessibility:
        "Accessibility measures how usable your site is for users with disabilities or impairments. It checks for proper use of ARIA attributes, sufficient color contrast, correct heading structure, and more.",
      "best-practices":
        "Best Practices evaluates the site's adherence to modern web development standards. It checks for secure HTTPS usage, proper image aspect ratios, avoidance of deprecated APIs, and more.",
      seo: "SEO (Search Engine Optimization) measures how well your site can be discovered through search engines. It checks for proper meta tags, crawlable links, mobile-friendly design, and descriptive text content.",

      // Lab Data Metrics
      "first-contentful-paint":
        "First Contentful Paint (FCP) measures the time from when the page starts loading to when any part of the page's content is rendered on the screen. A good FCP score is under 1.8 seconds.",
      "speed-index":
        "Speed Index measures how quickly content is visually displayed during page load. It shows how quickly the contents of a page are visibly populated. A good score is under 3.4 seconds.",
      "largest-contentful-paint":
        "Largest Contentful Paint (LCP) measures the time when the largest text or image is rendered on the page. A good LCP is under 2.5 seconds and is a Core Web Vital.",
      interactive:
        "Time to Interactive (TTI) measures how long it takes for the page to become fully interactive. A good TTI score is under 3.8 seconds.",
      "total-blocking-time":
        "Total Blocking Time (TBT) measures the total amount of time that a page is blocked from responding to user input, such as mouse clicks or screen taps. A good TBT score is under 200 milliseconds.",
      "cumulative-layout-shift":
        "Cumulative Layout Shift (CLS) measures the sum of all unexpected layout shifts that occur during the loading of a page. A good CLS score is under 0.1 and is a Core Web Vital.",
    };

    return explanations[key] || "No explanation available for this metric.";
  };

  // Function to determine color based on score
  const getColorByScore = (score) => {
    if (score >= 90) return "success";
    if (score >= 50) return "warning";
    return "failure";
  };

  // Function to determine background color class based on score
  const getBgColorClass = (score) => {
    if (score >= 90) return "bg-green-500";
    if (score >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  // Function to determine text color class based on score
  const getTextColorClass = (score) => {
    if (score >= 90) return "text-green-700";
    if (score >= 50) return "text-yellow-700";
    return "text-red-700";
  };

  // Function to determine the stroke dasharray for circle filling
  const getCircleProgress = (score) => {
    // Circumference of the circle with r=30
    const circumference = 2 * Math.PI * 30;
    // Calculate filled portion
    const filled = (score / 100) * circumference;
    return `${filled} ${circumference}`;
  };

  // Sample metrics for the empty state visualization
  const emptyStateMetrics = [
    {
      icon: "⚡",
      title: "Performance",
      description: "Page load speed and responsiveness",
    },
    {
      icon: "♿",
      title: "Accessibility",
      description: "How accessible your site is to all users",
    },
    {
      icon: "✅",
      title: "Best Practices",
      description: "Adherence to web development standards",
    },
    { icon: "🔍", title: "SEO", description: "Search engine discoverability" },
  ];

  // Fallback data for example view or when partial data is available
  const sampleResult = auditResult || {
    categories: {
      performance: { title: "Performance", score: 0.95 },
      accessibility: { title: "Accessibility", score: 0.82 },
      "best-practices": { title: "Best Practices", score: 0.92 },
      seo: { title: "SEO", score: 0.98 },
    },
    audits: {
      "first-contentful-paint": {
        title: "First Contentful Paint",
        score: 0.9,
        displayValue: "0.8 s",
      },
      "speed-index": {
        title: "Speed Index",
        score: 0.88,
        displayValue: "1.2 s",
      },
      "largest-contentful-paint": {
        title: "Largest Contentful Paint",
        score: 0.92,
        displayValue: "1.5 s",
      },
      interactive: {
        title: "Time to Interactive",
        score: 0.85,
        displayValue: "1.3 s",
      },
      "total-blocking-time": {
        title: "Total Blocking Time",
        score: 1,
        displayValue: "0 ms",
      },
      "cumulative-layout-shift": {
        title: "Cumulative Layout Shift",
        score: 0.95,
        displayValue: "0.004",
      },
    },
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header with search */}
      <div className="rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-3xl font-bold mb-4 text-center">Website Audit Tool</h2>
        <p className="text-gray-500  mb-6">
          Analyze your website performance, accessibility, SEO, and best
          practices using Ishtehaar's Website Audit Tool
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-grow">
            <TextInput
              type="url"
              required
              placeholder="https://ishtehaar.com"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              sizing="md"
              className="w-full"
              id="url-input"
            />
          </div>
          <Button gradientDuoTone="purpleToPink" onClick={runAudit} disabled={loading}>
            {loading ? <>Analyzing...</> : "Analyze"}
          </Button>
        </div>
      </div>

      {error && (
        <Alert color="failure" className="mb-4">
          {error}
        </Alert>
      )}

      {loading && (
        <div className="text-center py-12">
          <Spinner size="xl" />
          <p className="mt-4 text-gray-600">Analyzing {websiteUrl}</p>
          <p className="text-sm text-gray-500">This may take a minute...</p>
        </div>
      )}

      {/* Empty state - What you'll see before analysis */}
      {!loading && !auditResult && (
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <div className="p-6 text-center border-b">
              <h3 className="text-xl font-medium mb-2">What We Analyze</h3>
              <p className="text-gray-500">
                Our website audit tool provides a comprehensive analysis of your
                site's performance and user experience
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
              {emptyStateMetrics.map((metric, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow"
                >
                  <div className="text-3xl mb-3">{metric.icon}</div>
                  <h4 className="font-semibold mb-2">{metric.title}</h4>
                  <p className="text-sm text-gray-500">{metric.description}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h3 className="text-lg font-medium mb-4">How It Works</h3>

              <div className="space-y-4">
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 mr-3">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium">Enter Your URL</h4>
                    <p className="text-sm text-gray-500">
                      Paste the full URL of the page you want to analyze
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 mr-3">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium">We Analyze Your Site</h4>
                    <p className="text-sm text-gray-500">
                      Our tool runs a comprehensive audit on your
                      page
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 mr-3">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium">Get Detailed Results</h4>
                    <p className="text-sm text-gray-500">
                      View performance metrics and actionable recommendations
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4  rounded-lg border border-blue-100">
                <div className="flex items-start">
                  <div className="flex-shrink-0 text-blue-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h5 className="font-medium">Pro Tip</h5>
                    <p className="text-sm">
                      For the most accurate results, analyze your live
                      production site rather than a development or staging
                      environment.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Explanation Modal */}
      <Modal show={showModal} onClose={() => setShowModal(false)} size="md">
        <Modal.Header>{currentMetric.title}</Modal.Header>
        <Modal.Body>
          <div className="space-y-3">
            <p>{currentMetric.description}</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {auditResult && (
        <div className="space-y-6">
          {/* Main metrics */}
          <Card className="overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="font-medium">Core Web Vitals Assessment</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
              {Object.entries(sampleResult.categories).map(
                ([key, category]) => {
                  const score = Math.round(category.score * 100);
                  const bgColorClass = getBgColorClass(score);
                  const textColorClass = getTextColorClass(score);
                  const strokeDasharray = getCircleProgress(score);

                  return (
                    <div
                      key={key}
                      className="text-center p-4 rounded-lg border"
                    >
                      <div className="inline-flex justify-center items-center mb-2">
                        <div className="relative w-20 h-20">
                          {/* Background circle */}
                          <svg className="w-full h-full" viewBox="0 0 100 100">
                            <circle
                              cx="50"
                              cy="50"
                              r="30"
                              fill="transparent"
                              stroke="#e6e6e6"
                              strokeWidth="8"
                            />
                            {/* Progress circle */}
                            <circle
                              cx="50"
                              cy="50"
                              r="30"
                              fill="transparent"
                              stroke={
                                score >= 90
                                  ? "#22c55e"
                                  : score >= 50
                                  ? "#f59e0b"
                                  : "#ef4444"
                              }
                              strokeWidth="8"
                              strokeDasharray={strokeDasharray}
                              strokeLinecap="round"
                              transform="rotate(-90 50 50)"
                            />
                          </svg>
                          {/* Score text */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span
                              className={`text-xl font-bold ${textColorClass}`}
                            >
                              {score}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <h4 className="font-medium text-sm">
                          {category.title}
                        </h4>
                        <button
                          onClick={() =>
                            showMetricExplanation(category.title, key)
                          }
                          className="text-blue-500 hover:text-blue-700"
                          aria-label={`Learn more about ${category.title}`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-4 h-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="mt-1">
                        <Badge
                          color={getColorByScore(score)}
                          className="px-2 py-1"
                        >
                          {score >= 90
                            ? "Good"
                            : score >= 50
                            ? "Needs Improvement"
                            : "Poor"}
                        </Badge>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </Card>

          {/* Detailed scores - Enhanced Performance Metrics */}
          <Card>
            <div className="p-4 border-b">
              <h3 className="font-medium">Performance Metrics</h3>
            </div>

            <div className="p-4 space-y-6">
              {Object.entries(sampleResult.categories).map(
                ([key, category]) => {
                  const score = category.score * 100;
                  const color = getColorByScore(score);
                  const textColorClass = getTextColorClass(score);

                  return (
                    <div key={key} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{category.title}</h4>
                          <button
                            onClick={() =>
                              showMetricExplanation(category.title, key)
                            }
                            className="text-blue-500 hover:text-blue-700"
                            aria-label={`Learn more about ${category.title}`}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-4 h-4"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                              />
                            </svg>
                          </button>
                          <p className="text-xs text-gray-500">
                            {score >= 90
                              ? "Good"
                              : score >= 50
                              ? "Needs Improvement"
                              : "Poor"}
                          </p>
                        </div>
                        <div className={textColorClass}>
                          <span className="font-bold">{score.toFixed(0)}</span>
                        </div>
                      </div>

                      <div className="relative pt-1">
                        <div className="overflow-hidden h-4 text-xs flex rounded bg-gray-200">
                          <div
                            style={{ width: `${score}%` }}
                            className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ${
                              score >= 90
                                ? "bg-green-500"
                                : score >= 50
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </Card>

          {/* Lab data */}
          <Card>
            <div className="p-4 border-b">
              <h3 className="font-medium">Lab Data</h3>
              <p className="text-xs text-gray-500">
                Data collected in a controlled environment
              </p>
            </div>

            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {auditResult && auditResult.audits
                ? Object.entries(auditResult.audits)
                    .filter(([key, audit]) =>
                      [
                        "first-contentful-paint",
                        "speed-index",
                        "largest-contentful-paint",
                        "interactive",
                        "total-blocking-time",
                        "cumulative-layout-shift",
                      ].includes(key)
                    )
                    .map(([key, audit]) => {
                      const score = audit.score * 100;
                      const color = getColorByScore(score);

                      return (
                        <div key={key} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <div className="flex items-center space-x-2">
                              <span>{audit.title}</span>
                              <button
                                onClick={() =>
                                  showMetricExplanation(audit.title, key)
                                }
                                className="text-blue-500 hover:text-blue-700"
                                aria-label={`Learn more about ${audit.title}`}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="w-4 h-4"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                                  />
                                </svg>
                              </button>
                            </div>
                            <span className="font-medium">
                              {audit.displayValue}
                            </span>
                          </div>
                          <div className="relative pt-1">
                            <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                              <div
                                style={{ width: `${score}%` }}
                                className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ${
                                  score >= 90
                                    ? "bg-green-500"
                                    : score >= 50
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                                }`}
                              ></div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                : // Fallback to sample data if no audit data available
                  Object.entries(sampleResult.audits).map(([key, audit]) => {
                    const score = audit.score * 100;

                    return (
                      <div key={key} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <div className="flex items-center space-x-2">
                            <span>{audit.title}</span>
                            <button
                              onClick={() =>
                                showMetricExplanation(audit.title, key)
                              }
                              className="text-blue-500 hover:text-blue-700"
                              aria-label={`Learn more about ${audit.title}`}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-4 h-4"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                                />
                              </svg>
                            </button>
                          </div>
                          <span className="font-medium">
                            {audit.displayValue}
                          </span>
                        </div>
                        <div className="relative pt-1">
                          <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                            <div
                              style={{ width: `${score}%` }}
                              className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ${
                                score >= 90
                                  ? "bg-green-500"
                                  : score >= 50
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                              }`}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
            </div>
          </Card>

          {/* Additional insights */}
          {auditResult && auditResult.opportunities && (
            <Card>
              <div className="p-4 border-b">
                <h3 className="font-medium">Opportunities</h3>
                <p className="text-xs text-gray-500">
                  Ways to improve page performance
                </p>
              </div>

              <div className="p-4 space-y-4">
                {auditResult.opportunities.map((opportunity, index) => (
                  <div key={index} className="p-3 border rounded">
                    <h4 className="font-medium">{opportunity.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {opportunity.description}
                    </p>
                    {opportunity.savings && (
                      <div className="mt-2 text-xs">
                        <span className="font-medium">Potential savings: </span>
                        <span>{opportunity.savings}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}
          {/* Screenshot if available */}
          {imageSrc && (
            <Card>
              <div className="p-4 border-b">
                <h3 className="font-medium">Page Screenshot</h3>
              </div>
              <div className="p-4">
                <img
                  src={imageSrc}
                  alt="Full page screenshot"
                  className="w-full rounded shadow-sm"
                />
              </div>
            </Card>
          )}

          <div className="text-center text-sm text-gray-500">
            Analysis generated for {websiteUrl} on {new Date().toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
}
