'use client';

import { useState, useTransition, useRef } from 'react';
import type { AnalyzeResumeAndJobDescriptionOutput, OptimizeContentOutput, ResumeAnalysisOutput } from '@/ai/schemas';
import { performGapAnalysis, performContentOptimization } from './actions';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Icons } from '@/components/icons';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ModernTemplate } from '@/components/resume-templates/modern';
import { ClassicTemplate } from '@/components/resume-templates/classic';

import {
  Briefcase,
  ClipboardCopy,
  FileText,
  Loader2,
  Sparkles,
  Wand2,
  AlertCircle,
  Telescope,
  Download
} from 'lucide-react';


type GapAnalysisResult = AnalyzeResumeAndJobDescriptionOutput | null;
type OptimizedResult = OptimizeContentOutput | null;

const ScoreDonut = ({ score }: { score: number }) => {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative h-40 w-40">
      <svg className="h-full w-full -rotate-90">
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke="hsl(var(--secondary))"
          strokeWidth="12"
          fill="transparent"
        />
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke="hsl(var(--accent))"
          strokeWidth="12"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-in-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-accent">{score}</span>
        <span className="text-sm font-medium text-muted-foreground">ATS Score</span>
      </div>
    </div>
  );
};


export default function ResumeOptimizerPage() {
  const [resume, setResume] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [isFresher, setIsFresher] = useState(false);
  const [gapAnalysisResult, setGapAnalysisResult] = useState<GapAnalysisResult>(null);
  const [optimizedResult, setOptimizedResult] = useState<OptimizedResult>(null);
  const [isAnalyzing, startAnalysisTransition] = useTransition();
  const [isOptimizing, startOptimizationTransition] = useTransition();
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [atsScore, setAtsScore] = useState(100);
  const { toast } = useToast();

  const templateRef = useRef<HTMLDivElement>(null);

  const handleAnalyze = () => {
    if (!resume.trim() || !jobDesc.trim()) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please provide both your resume and the job description.',
      });
      return;
    }
    setOptimizedResult(null);
    startAnalysisTransition(async () => {
      try {
        const result = await performGapAnalysis(resume, jobDesc, isFresher);
        setGapAnalysisResult(result);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Analysis Failed',
          description: error instanceof Error ? error.message : 'An unknown error occurred.',
        });
        setGapAnalysisResult(null);
      }
    });
  };

  const handleOptimize = () => {
    if (!gapAnalysisResult) return;
    const gapsString = `Missing Keywords: ${gapAnalysisResult.missingKeywords.join(', ')}\nMissing Skills: ${gapAnalysisResult.missingSkills.join(', ')}\nMissing Action Verbs: ${gapAnalysisResult.missingActionVerbs.join(', ')}`;
    startOptimizationTransition(async () => {
      try {
        const result = await performContentOptimization(resume, jobDesc, gapsString, isFresher);
        setOptimizedResult(result);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Optimization Failed',
          description: error instanceof Error ? error.message : 'An unknown error occurred.',
        });
        setOptimizedResult(null);
      }
    });
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to clipboard!',
      description: 'You can now paste the optimized resume content.',
    });
  };

  const handleDownload = async () => {
    if (!templateRef.current || !optimizedResult) return;

    setIsDownloading(true);
    try {
      const canvas = await html2canvas(templateRef.current, {
        scale: 2, 
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save('optimized-resume.pdf');
      
      toast({
        title: 'Download Started',
        description: 'Your optimized resume is being downloaded.',
      });

    } catch (error) {
       toast({
        variant: 'destructive',
        title: 'Download Failed',
        description: 'Could not generate PDF. Please try again.',
      });
      console.error(error)
    } finally {
      setIsDownloading(false);
    }
  };
  
  const renderGapAnalysis = (title: string, items: string[]) => (
    items.length > 0 && (
      <div>
        <h4 className="font-semibold text-lg mb-2">{title}</h4>
        <div className="flex flex-wrap gap-2">
          {items.map((item, index) => (
            <Badge key={index} variant="secondary" className="text-sm">
              {item}
            </Badge>
          ))}
        </div>
      </div>
    )
  );

  const ResumeTemplate = ({ data }: { data: ResumeAnalysisOutput }) => {
    const Template = selectedTemplate === 'classic' ? ClassicTemplate : ModernTemplate;
    return <Template ref={templateRef} data={data} />;
  }

  return (
    <>
      {/* Hidden container for rendering the template for PDF generation */}
      {optimizedResult && (
        <div className="absolute left-[-9999px] top-[-9999px] w-[800px] bg-white text-black" >
           <ResumeTemplate data={optimizedResult.optimizedContentStructured} />
        </div>
      )}

      <div className="min-h-screen bg-background text-foreground">
        <header className="container mx-auto py-8 text-center">
          <div className="flex justify-center items-center gap-4 mb-2">
            <Icons.logo className="h-12 w-12" />
            <h1 className="text-5xl font-bold tracking-tight text-primary">ATS ResumeForge</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Craft the perfect, ATS-optimized resume. Our AI analyzes job descriptions to identify key skills and keywords, then rewrites your resume to match.
          </p>
        </header>

        <main className="container mx-auto pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Wand2 className="text-primary" />
                  Start Here
                </CardTitle>
                <CardDescription>
                  Provide your current resume and the job description to begin the optimization process.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="resume" className="flex items-center gap-2 font-medium">
                    <FileText className="text-muted-foreground" />
                    Your Resume
                  </label>
                  <Textarea
                    id="resume"
                    placeholder="Paste your resume content here..."
                    value={resume}
                    onChange={(e) => setResume(e.target.value)}
                    className="min-h-[200px] text-base"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="job-desc" className="flex items-center gap-2 font-medium">
                    <Briefcase className="text-muted-foreground" />
                    Job Description
                  </label>
                  <Textarea
                    id="job-desc"
                    placeholder="Paste the job description here..."
                    value={jobDesc}
                    onChange={(e) => setJobDesc(e.target.value)}
                    className="min-h-[200px] text-base"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="isFresher" checked={isFresher} onCheckedChange={(checked) => setIsFresher(!!checked)} />
                  <Label htmlFor="isFresher" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    I am a Fresher
                  </Label>
                </div>
              </CardContent>
              <CardFooter className="flex-col items-stretch gap-4">
                <Button onClick={handleAnalyze} disabled={isAnalyzing || isOptimizing} size="lg">
                  {isAnalyzing ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Telescope className="mr-2 h-4 w-4" />
                  )}
                  Analyze Gaps
                </Button>
                
                {isAnalyzing && (
                  <Alert variant="default" className="bg-secondary">
                      <AlertCircle className="h-4 w-4"/>
                      <AlertTitle>AI is thinking...</AlertTitle>
                      <AlertDescription>
                        Our AI is analyzing your resume against the job description. This may take a moment.
                      </AlertDescription>
                    </Alert>
                )}

                {gapAnalysisResult && (
                  <Card className="bg-secondary/50">
                    <CardHeader>
                      <CardTitle className="text-xl">Analysis Complete</CardTitle>
                      <CardDescription>Here are the keywords and skills you might be missing.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {renderGapAnalysis('Missing Keywords', gapAnalysisResult.missingKeywords)}
                      {renderGapAnalysis('Missing Skills', gapAnalysisResult.missingSkills)}
                      {renderGapAnalysis('Missing Action Verbs', gapAnalysisResult.missingActionVerbs)}
                    </CardContent>
                    <CardFooter>
                      <Button onClick={handleOptimize} disabled={isOptimizing} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" size="lg">
                        {isOptimizing ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Sparkles className="mr-2 h-4 w-4" />
                        )}
                        Forge My Resume
                      </Button>
                    </CardFooter>
                  </Card>
                )}
              </CardFooter>
            </Card>

            <Card className="shadow-lg sticky top-8">
              <CardHeader>
                <CardTitle className="text-2xl">Your Optimized Resume</CardTitle>
                  <CardDescription>
                    View your new resume, check the ATS score, and compare it with the original.
                  </CardDescription>
              </CardHeader>
              <CardContent className="min-h-[600px]">
                {isOptimizing ? (
                  <div className="space-y-4 pt-4">
                    <div className="flex justify-center">
                      <Skeleton className="h-40 w-40 rounded-full" />
                    </div>
                    <Skeleton className="h-6 w-3/4 mx-auto" />
                    <div className="space-y-2 pt-8">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                    </div>
                  </div>
                ) : optimizedResult ? (
                  <Tabs defaultValue="optimized" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="optimized">Optimized Resume</TabsTrigger>
                      <TabsTrigger value="compare">Side-by-Side</TabsTrigger>
                    </TabsList>
                    <TabsContent value="optimized" className="mt-4">
                      <div className="flex flex-col items-center gap-6 text-center">
                          <ScoreDonut score={atsScore} />
                          <div className="flex flex-wrap justify-center gap-4">
                             <Button onClick={() => handleCopy(optimizedResult.optimizedContent)}>
                              <ClipboardCopy className="mr-2 h-4 w-4" />
                              Copy Resume Text
                            </Button>
                             <Button onClick={handleDownload} disabled={isDownloading}>
                               {isDownloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                               Download PDF
                            </Button>
                          </div>

                           <div className="w-full max-w-sm mx-auto">
                              <Label htmlFor="template-select">Resume Template</Label>
                              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                                <SelectTrigger id="template-select" className="w-full">
                                  <SelectValue placeholder="Select a template" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="modern">Modern</SelectItem>
                                  <SelectItem value="classic">Classic</SelectItem>
                                </SelectContent>
                              </Select>
                          </div>
                      </div>
                      <div className="mt-6 p-6 border rounded-lg bg-white dark:bg-card h-[400px] overflow-y-auto">
                          <pre className="whitespace-pre-wrap text-sm font-sans text-card-foreground">{optimizedResult.optimizedContent}</pre>
                      </div>
                    </TabsContent>
                    <TabsContent value="compare" className="mt-4">
                      <div className="grid grid-cols-2 gap-4 h-[550px]">
                        <div>
                          <h3 className="font-semibold mb-2 text-center">Original</h3>
                          <div className="p-4 border rounded-lg bg-white dark:bg-secondary h-full overflow-y-auto">
                            <pre className="whitespace-pre-wrap text-xs font-sans text-muted-foreground">{resume}</pre>
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2 text-center">Optimized</h3>
                          <div className="p-4 border rounded-lg bg-white dark:bg-secondary h-full overflow-y-auto">
                            <pre className="whitespace-pre-wrap text-xs font-sans text-foreground">{optimizedResult.optimizedContent}</pre>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                    <Icons.logo className="h-24 w-24 opacity-20 mb-4" />
                    <h3 className="text-lg font-semibold">Your masterpiece awaits</h3>
                    <p className="max-w-xs">Your AI-powered, ATS-friendly resume will be forged here once you provide the necessary materials.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </>
  );
}
