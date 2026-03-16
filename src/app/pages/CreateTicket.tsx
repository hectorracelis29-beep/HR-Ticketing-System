import { useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { useTickets } from "../contexts/TicketContext";
import { EmployeeSidebar } from "../components/EmployeeSidebar";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Upload, X, Loader2 } from "lucide-react";
import { categories } from "../data/mockData";
import { supabase } from "../../lib/supabase";
import { v4 as uuidv4 } from "uuid";

export default function CreateTicket() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createTicket } = useTickets();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const subcategories = categories.find((c) => c.name === selectedCategory)?.subcategories || [];

  const handlePriorityChange = (value: string) => {
    if (["low", "medium", "high"].includes(value)) {
      setPriority(value as "low" | "medium" | "high");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter((file) => {
        if (file.size > 10 * 1024 * 1024) {
          setError(`File ${file.name} too large (max 10MB)`);
          return false;
        }
        const allowedTypes = ['image/*', 'application/pdf', '.doc', '.docx'];
        if (!allowedTypes.some(type => file.type.match(type.replace('*', '.*')) || file.name.match(/\\.docx?$/))) {
          setError(`Unsupported file type: ${file.name}`);
          return false;
        }
        return true;
      });
      setFiles((prev) => [...prev, ...newFiles]);
      if (newFiles.length < e.target.files!.length) setError("Some files skipped due to size/type limits");
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const uploadFiles = useCallback(async (): Promise<string[]> => {
    if (files.length === 0) return [];
    setUploading(true);
    setUploadProgress(0);
    setError("");
    const downloadURLs: string[] = [];
    const ticketId = uuidv4();

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const timestamp = Date.now();
      const path = `attachments/${ticketId}/${timestamp}-${file.name}`;

      // Upload to both buckets in parallel
      const [ticketRes, adminRes] = await Promise.all([
        supabase.storage.from('ticket').upload(path, file, { upsert: true }),
        supabase.storage.from('admin-ticket').upload(path, file, { upsert: true }),
      ]);

      if (ticketRes.error) {
        throw new Error(`Ticket bucket upload failed: ${ticketRes.error.message}`);
      }
      if (adminRes.error) {
        console.warn(`Admin-ticket bucket upload failed: ${adminRes.error.message}`);
      }

      // Get public URL from ticket bucket
      const { data: urlData } = supabase.storage.from('ticket').getPublicUrl(path);
      downloadURLs.push(urlData.publicUrl);

      // Progress
      setUploadProgress(Math.round(((i + 1) / files.length) * 100));
    }

    setUploading(false);
    setUploadProgress(0);
    setFiles([]);
    return downloadURLs;
  }, [files]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory || !selectedSubcategory || !title || !description || !user?.uid) {
      setError("Please fill all required fields");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const attachments = await uploadFiles();

      const ticketId = await createTicket({
        title,
        description,
        category: selectedCategory,
        subcategory: selectedSubcategory,
        priority,
        status: "open" as const,
        createdByUid: user.uid,
        createdBy: user.name,
        attachments,
        comments: [],
      });

      if (ticketId) {
        navigate("/employee");
      }
    } catch (err: any) {
      setError(err.message || "Failed to create ticket");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <EmployeeSidebar />
      <div className="flex-1 ml-64 p-0 overflow-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-gray-900">Create New Ticket</h1>
            <p className="text-gray-600 mt-1">Submit a request to HR</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
              {error}
            </div>
          )}

          <Card className="shadow-sm border-gray-200">
            <CardHeader className="border-b border-gray-200">
              <CardTitle>Ticket Details</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Employee Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Label className="text-xs text-gray-500">Name</Label>
                    <div>{user?.name}</div>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Employee ID</Label>
                    <div>{user?.uid}</div>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Department</Label>
                    <div>{user?.department || "N/A"}</div>
                  </div>
                </div>

                {/* Category & Subcategory */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Request Category *</Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.name} value={cat.name}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Subcategory *</Label>
                    <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory} disabled={!selectedCategory}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select subcategory" />
                      </SelectTrigger>
                      <SelectContent>
                        {subcategories.map((sub) => (
                          <SelectItem key={sub} value={sub}>
                            {sub}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <Label>Subject *</Label>
                  <Input
                    placeholder="Brief description of your request"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="h-11"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label>Description *</Label>
                  <Textarea
                    placeholder="Provide detailed information about your request..."
                    rows={6}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="resize-none"
                  />
                </div>

                {/* File Upload */}
                <div className="space-y-2">
                  <Label>Attachments (Optional, max 10MB/file, PDF/Images/Docs)</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors">
                    <div className="flex flex-col items-center justify-center text-center">
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 mb-1">Drag and drop or click to browse</p>
                      <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        disabled={uploading}
                        className="mt-4 hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md text-sm font-medium">
                        Choose Files
                      </label>
                    </div>
                  </div>

                  {files.length > 0 && (
                    <div className="space-y-2 mt-4">
                      {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-700 truncate flex-1 mr-2">
                            {file.name} ({(file.size / 1024 / 1024).toFixed(1)}MB)
                          </span>
                          <button type="button" onClick={() => removeFile(index)} className="text-gray-400 hover:text-red-600">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {uploading && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center">
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        <span>Uploading files... {uploadProgress}%</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Priority */}
                <div className="space-y-2">
                  <Label>Priority *</Label>
                  <Select value={priority} onValueChange={handlePriorityChange}>
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={submitting || uploading}
                    style={{ backgroundColor: 'rgb(176, 191, 0)', borderColor: 'rgb(191, 0)' }}
                    className="hover:bg-opacity-90 h-11 px-8 text-white flex-1"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating Ticket...
                      </>
                    ) : (
                      "Submit Ticket"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/employee")}
                    disabled={submitting || uploading}
                    className="h-11 px-8"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
