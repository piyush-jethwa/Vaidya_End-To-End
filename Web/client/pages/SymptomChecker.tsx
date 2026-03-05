import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Brain, AlertTriangle, Clock, CheckCircle, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

export default function SymptomChecker() {
  const [symptoms, setSymptoms] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!symptoms.trim()) return;
    
    setLoading(true);
    
    // Simulate AI analysis - In real implementation, this would call an AI API
    setTimeout(() => {
      const mockAnalysis = {
        condition: getConditionFromSymptoms(symptoms),
        urgency: getUrgencyFromSymptoms(symptoms),
        recommendations: getRecommendations(symptoms),
        relatedConditions: getRelatedConditions(symptoms)
      };
      setAnalysis(mockAnalysis);
      setLoading(false);
    }, 2000);
  };

  const getConditionFromSymptoms = (symptoms: string) => {
    const lowerSymptoms = symptoms.toLowerCase();
    if (lowerSymptoms.includes("fever") && lowerSymptoms.includes("headache")) {
      return {
        name: "Viral Infection",
        confidence: 78,
        description: "Common viral infection causing fever and headache"
      };
    } else if (lowerSymptoms.includes("cough") && lowerSymptoms.includes("sore throat")) {
      return {
        name: "Upper Respiratory Infection",
        confidence: 85,
        description: "Infection affecting the upper respiratory tract"
      };
    } else if (lowerSymptoms.includes("back pain") || lowerSymptoms.includes("backache")) {
      return {
        name: "Musculoskeletal Pain",
        confidence: 70,
        description: "Pain related to muscles, bones, or joints"
      };
    } else {
      return {
        name: "General Health Concern",
        confidence: 60,
        description: "Various symptoms that require professional evaluation"
      };
    }
  };

  const getUrgencyFromSymptoms = (symptoms: string) => {
    const lowerSymptoms = symptoms.toLowerCase();
    const emergencyKeywords = ["chest pain", "difficulty breathing", "severe pain", "blood", "unconscious"];
    const urgentKeywords = ["high fever", "severe headache", "vomiting", "dizziness"];
    
    if (emergencyKeywords.some(keyword => lowerSymptoms.includes(keyword))) {
      return { level: "Emergency", color: "red", description: "Seek immediate medical attention" };
    } else if (urgentKeywords.some(keyword => lowerSymptoms.includes(keyword))) {
      return { level: "Urgent", color: "orange", description: "See a doctor within 24 hours" };
    } else {
      return { level: "Low", color: "green", description: "Schedule routine appointment" };
    }
  };

  const getRecommendations = (symptoms: string) => {
    const lowerSymptoms = symptoms.toLowerCase();
    const recommendations = [];
    
    if (lowerSymptoms.includes("fever")) {
      recommendations.push("Stay hydrated and rest");
      recommendations.push("Monitor temperature regularly");
    }
    if (lowerSymptoms.includes("headache")) {
      recommendations.push("Apply cold or warm compress");
      recommendations.push("Avoid bright lights and loud sounds");
    }
    if (lowerSymptoms.includes("cough")) {
      recommendations.push("Stay hydrated with warm liquids");
      recommendations.push("Use a humidifier if available");
    }
    
    recommendations.push("Consult with a healthcare professional");
    recommendations.push("Keep track of symptom changes");
    
    return recommendations;
  };

  const getRelatedConditions = (symptoms: string) => {
    return [
      "Common Cold",
      "Influenza",
      "Allergic Reaction",
      "Stress-related symptoms"
    ];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100">
      {/* Navigation Header */}
      <div className="bg-white/80 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-purple-600" />
              <span className="text-xl font-bold text-gray-900">VAIDYA AI</span>
            </Link>
            <div className="flex space-x-4">
              <Link to="/book-appointment">
                <Button variant="outline" size="sm">Book Appointment</Button>
              </Link>
              <Link to="/">
                <Button size="sm">Home</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Brain className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            AI Symptom Checker
          </h1>
          <p className="text-xl text-gray-600">
            Get preliminary insights about your symptoms using AI technology
          </p>
        </div>

        {/* Disclaimer */}
        <Card className="bg-yellow-50 border-yellow-200 mb-8">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-800">Important Disclaimer</h3>
                <p className="text-sm text-yellow-700">
                  This tool provides general health information and should not replace professional medical advice. 
                  For serious symptoms or emergencies, contact emergency services immediately.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Symptom Input */}
        <Card className="shadow-2xl mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Describe Your Symptoms</CardTitle>
            <CardDescription>
              Tell us about your symptoms in detail. Be as specific as possible for better analysis.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                placeholder="Please describe your symptoms... For example: 'I have a headache for 2 days, mild fever, and feeling tired'"
                rows={6}
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="text-base"
              />
              <Button 
                onClick={handleAnalyze}
                disabled={!symptoms.trim() || loading}
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Analyzing Symptoms...
                  </div>
                ) : (
                  "Analyze Symptoms"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-6">
            {/* Primary Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                  Analysis Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Possible Condition</h3>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="font-semibold text-blue-900">{analysis.condition.name}</div>
                      <div className="text-sm text-blue-700 mb-2">{analysis.condition.description}</div>
                      <Badge variant="secondary">
                        {analysis.condition.confidence}% confidence
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Urgency Level</h3>
                    <div className={`p-4 rounded-lg ${
                      analysis.urgency.color === 'red' ? 'bg-red-50' :
                      analysis.urgency.color === 'orange' ? 'bg-orange-50' : 'bg-green-50'
                    }`}>
                      <div className={`font-semibold ${
                        analysis.urgency.color === 'red' ? 'text-red-900' :
                        analysis.urgency.color === 'orange' ? 'text-orange-900' : 'text-green-900'
                      }`}>
                        {analysis.urgency.level}
                      </div>
                      <div className={`text-sm ${
                        analysis.urgency.color === 'red' ? 'text-red-700' :
                        analysis.urgency.color === 'orange' ? 'text-orange-700' : 'text-green-700'
                      }`}>
                        {analysis.urgency.description}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-6 w-6 text-purple-600 mr-2" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.recommendations.map((rec: string, index: number) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Related Conditions */}
            <Card>
              <CardHeader>
                <CardTitle>Related Conditions to Consider</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {analysis.relatedConditions.map((condition: string, index: number) => (
                    <Badge key={index} variant="outline">
                      {condition}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card className="bg-purple-50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center text-purple-900">
                  <Calendar className="h-6 w-6 mr-2" />
                  Next Steps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-purple-700 mb-4">
                  Based on your symptoms, we recommend scheduling an appointment with a healthcare professional 
                  for proper diagnosis and treatment.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link to="/book-appointment" className="flex-1">
                    <Button className="w-full bg-purple-600 hover:bg-purple-700">
                      Book Appointment
                    </Button>
                  </Link>
                  <Button variant="outline" className="flex-1" onClick={() => setAnalysis(null)}>
                    Check Other Symptoms
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            This AI symptom checker is for informational purposes only. Always consult with healthcare professionals.
          </p>
          <Link to="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
