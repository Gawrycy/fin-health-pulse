import { useState, useCallback } from "react";
import { Upload, FileText, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { IndustryType } from "@/lib/mockParser";

interface FileUploadZoneProps {
  onUpload: (industry: IndustryType) => void;
  isLoading?: boolean;
}

export function FileUploadZone({ onUpload, isLoading = false }: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryType>("manufacturing");
  const [uploadState, setUploadState] = useState<"idle" | "uploading" | "parsing" | "complete">("idle");
  
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);
  
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);
  
  const simulateUpload = useCallback(async () => {
    setUploadState("uploading");
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setUploadState("parsing");
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    setUploadState("complete");
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onUpload(selectedIndustry);
    setUploadState("idle");
  }, [selectedIndustry, onUpload]);
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    simulateUpload();
  }, [simulateUpload]);
  
  const handleFileSelect = useCallback(() => {
    simulateUpload();
  }, [simulateUpload]);
  
  const isProcessing = uploadState !== "idle" || isLoading;
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Wgraj plik JPK_KR</h3>
        <Select
          value={selectedIndustry}
          onValueChange={(value) => setSelectedIndustry(value as IndustryType)}
          disabled={isProcessing}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Wybierz branżę" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="manufacturing">Produkcja (SME)</SelectItem>
            <SelectItem value="it_services">IT Services</SelectItem>
            <SelectItem value="ecommerce">E-commerce</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div
        className={cn(
          "upload-zone cursor-pointer",
          isDragging && "active",
          isProcessing && "pointer-events-none opacity-70"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleFileSelect}
      >
        <div className="flex flex-col items-center justify-center text-center">
          {uploadState === "idle" && !isLoading && (
            <>
              <div className="rounded-full bg-muted p-4 mb-4">
                <Upload className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-lg font-medium text-foreground mb-1">
                Przeciągnij plik JPK_KR tutaj
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                lub kliknij, aby wybrać plik (XML/JSON)
              </p>
              <Button variant="outline" size="sm" onClick={(e) => {
                e.stopPropagation();
                handleFileSelect();
              }}>
                <FileText className="mr-2 h-4 w-4" />
                Symuluj parsing
              </Button>
            </>
          )}
          
          {uploadState === "uploading" && (
            <>
              <Loader2 className="h-12 w-12 text-emerald-500 animate-spin mb-4" />
              <p className="text-lg font-medium">Wgrywanie pliku...</p>
            </>
          )}
          
          {uploadState === "parsing" && (
            <>
              <div className="relative mb-4">
                <FileText className="h-12 w-12 text-emerald-500" />
                <div className="absolute -bottom-1 -right-1">
                  <Loader2 className="h-5 w-5 text-emerald-500 animate-spin" />
                </div>
              </div>
              <p className="text-lg font-medium">Analizowanie danych finansowych...</p>
              <div className="mt-4 w-64 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 animate-pulse" style={{ width: "70%" }} />
              </div>
            </>
          )}
          
          {uploadState === "complete" && (
            <>
              <div className="rounded-full bg-emerald-500/10 p-4 mb-4">
                <Check className="h-8 w-8 text-emerald-500" />
              </div>
              <p className="text-lg font-medium text-emerald-500">Gotowe!</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
