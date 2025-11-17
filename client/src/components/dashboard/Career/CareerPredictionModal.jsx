import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { usePredictCareerMutation } from "@/features/career/careerApi";
import {
  setPrediction,
  setFormData,
  resetPrediction,
  setStatus,
  setError,
} from "@/features/career/careerSlice";
import { useGenerateRoadmapMutation } from "@/features/rodemap/roadmapApi";
import { X, Sparkles, TrendingUp, Loader2 } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { toast } from "@/lib/toast";

export default function CareerPredictionModal({ open, onOpenChange }) {
  const { user } = useUser();
  const userId = user ? user.id : null;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { lastPrediction } = useSelector((state) => state.career);
  const [predictCareer, { isLoading }] = usePredictCareerMutation();
  const [generateRoadmap, { isLoading: isGeneratingRoadmap }] =
    useGenerateRoadmapMutation();

  const [localForm, setLocalForm] = useState({
    course: "",
    specialization: "",
    skills: "",
    interests: "",
  });

  // Don't sync from Redux formData automatically - it causes persistence issues
  // useEffect(() => {
  //   if (formData) {
  //     setLocalForm(formData);
  //   }
  // }, [formData]);

  // Clean up state when modal closes
  useEffect(() => {
    if (!open) {
      // Small delay to ensure cleanup happens after modal animation
      const timer = setTimeout(() => {
        setLocalForm({
          course: "",
          specialization: "",
          skills: "",
          interests: "",
        });
        dispatch(resetPrediction());
        dispatch(setFormData(null));
        dispatch(setError(null));
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [open, dispatch]);

  // Reset form when dialog closes
  const handleDialogChange = (isOpen) => {
    onOpenChange(isOpen);
    if (!isOpen) {
      // Clear immediately when closing
      setLocalForm({
        course: "",
        specialization: "",
        skills: "",
        interests: "",
      });
      dispatch(resetPrediction());
      dispatch(setFormData(null));
      dispatch(setError(null));
    }
  };

  const handleChange = (field, value) => {
    const updated = { ...localForm, [field]: value };
    setLocalForm(updated);
    // Don't save to Redux on every change - it persists across modal opens
    // dispatch(setFormData(updated));
  };

  const handlePredict = async (e) => {
    e.preventDefault();

    // Validate
    if (
      !localForm.course ||
      !localForm.specialization ||
      !localForm.skills ||
      !localForm.interests
    ) {
      dispatch(setError("Please fill all fields"));
      return;
    }

    dispatch(setStatus("loading"));

    const body = {
      course: localForm.course,
      specialization: localForm.specialization,
      skills: localForm.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      interests: localForm.interests
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      const res = await predictCareer(body).unwrap();
      const prediction =
        res.predicted_career ||
        res.career ||
        res.data?.career ||
        "Career Prediction";
      dispatch(setPrediction(prediction));
    } catch (err) {
      console.error("Prediction error", err);
      dispatch(setError(err.message || "Failed to predict career"));
    }
  };

  const handleReset = () => {
    dispatch(resetPrediction());
    setLocalForm({
      course: "",
      specialization: "",
      skills: "",
      interests: "",
    });
  };

  const handleGenerateRoadmap = async () => {
    if (!lastPrediction || !userId) return;

    try {
      // Call mutation and wait for complete generation
      const result = await generateRoadmap({
        career: lastPrediction,
        userId,
      }).unwrap();

      // Only navigate if generation was successful and we have an _id
      if (result.success && result.data?._id) {
        // Clear form and prediction state
        setLocalForm({
          course: "",
          specialization: "",
          skills: "",
          interests: "",
        });
        dispatch(resetPrediction());
        dispatch(setFormData(null));

        // Close the modal
        onOpenChange(false);

        // Navigate to the roadmap page with the MongoDB _id
        navigate(`/dashboard/roadmaps/${result.data._id}`);
      } else {
        toast.error("Failed to generate roadmap. Please try again.");
      }
    } catch (error) {
      console.error("Failed to generate roadmap:", error);
      toast.error(
        error.data?.message || "Failed to generate roadmap. Please try again."
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent
        className="max-w-3xl max-h-[90vh] p-0 overflow-hidden flex flex-col"
        showCloseButton={false}
      >
        {/* Fixed Header Section */}
        <div className="flex-shrink-0 px-6 pt-5 pb-3 border-b border-gray-200 bg-white">
          {/* Close Button */}
          <DialogClose className="absolute right-4 top-4 z-10 rounded-full p-1.5 hover:bg-purple-100 transition-colors">
            <X className="h-4 w-4 text-gray-600" />
          </DialogClose>

          {/* Header with Gradient */}
          <DialogHeader className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 via-purple-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-left">
                  AI Career Prediction
                </DialogTitle>
                <DialogDescription className="text-left mt-1">
                  Fill in your details and let our AI predict the perfect career
                  path for you
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Scrollable Content Section */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {/* Form */}
          <form onSubmit={handlePredict} className="space-y-6 px-6 pb-5">
            {/* Course & Specialization Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="course"
                  className="text-sm font-semibold text-gray-700"
                >
                  Course / Degree <span className="text-pink-500">*</span>
                </Label>
                <Input
                  id="course"
                  placeholder="e.g., Computer Science, Business, Engineering"
                  value={localForm.course}
                  onChange={(e) => handleChange("course", e.target.value)}
                  className="h-12 border-gray-300 focus-visible:border-purple-500 focus-visible:ring-purple-200"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="specialization"
                  className="text-sm font-semibold text-gray-700"
                >
                  Specialization <span className="text-pink-500">*</span>
                </Label>
                <Input
                  id="specialization"
                  placeholder="e.g., AI/ML, Marketing, Mechanical"
                  value={localForm.specialization}
                  onChange={(e) =>
                    handleChange("specialization", e.target.value)
                  }
                  className="h-12 border-gray-300 focus-visible:border-purple-500 focus-visible:ring-purple-200"
                />
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <Label
                htmlFor="skills"
                className="text-sm font-semibold text-gray-700"
              >
                Skills <span className="text-pink-500">*</span>
              </Label>
              <Textarea
                id="skills"
                placeholder="e.g., Python, JavaScript, Machine Learning, Data Analysis (comma separated)"
                value={localForm.skills}
                onChange={(e) => handleChange("skills", e.target.value)}
                rows={3}
                className="border-gray-300 focus:border-purple-500 focus:ring-purple-200"
              />
              <p className="text-xs text-gray-500">
                Separate multiple skills with commas
              </p>
            </div>

            {/* Interests */}
            <div className="space-y-2">
              <Label
                htmlFor="interests"
                className="text-sm font-semibold text-gray-700"
              >
                Interests <span className="text-pink-500">*</span>
              </Label>
              <Textarea
                id="interests"
                placeholder="e.g., AI, Web Development, Data Science, Cloud Computing (comma separated)"
                value={localForm.interests}
                onChange={(e) => handleChange("interests", e.target.value)}
                rows={3}
                className="border-gray-300 focus:border-purple-500 focus:ring-purple-200"
              />
              <p className="text-xs text-gray-500">
                Separate multiple interests with commas
              </p>
            </div>

            {/* Predict Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-pink-500 via-purple-500 to-violet-600 hover:from-pink-600 hover:via-purple-600 hover:to-violet-700 text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Predicting...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Predict My Career
                </>
              )}
            </Button>
          </form>

          {/* Prediction Result */}
          {lastPrediction && (
            <div className="mt-8 space-y-4 px-6 pb-5">
              <div className="bg-gradient-to-r from-pink-50 via-purple-50 to-violet-50 border-2 border-purple-200 rounded-2xl p-6 shadow-md">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-purple-900 mb-2">
                      🎯 Your Predicted Career Path
                    </h3>
                    <p className="text-2xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-violet-600 bg-clip-text text-transparent capitalize">
                      {lastPrediction}
                    </p>
                  </div>
                </div>

                {/* Generate Roadmap Button */}
                <Button
                  onClick={handleGenerateRoadmap}
                  disabled={isGeneratingRoadmap}
                  className="w-full mt-6 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold shadow-md hover:shadow-lg transition-all"
                >
                  {isGeneratingRoadmap ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Initializing...
                    </>
                  ) : (
                    <>
                      <TrendingUp className="w-5 h-5 mr-2" />
                      Generate Career Roadmap
                    </>
                  )}
                </Button>
              </div>

              {/* Reset Button */}
              <Button
                onClick={handleReset}
                variant="outline"
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Try Another Prediction
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
