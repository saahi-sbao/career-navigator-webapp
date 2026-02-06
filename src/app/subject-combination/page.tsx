'use client';

import { useState } from 'react';
import Header from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { BookOpen, Loader2, Wand2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { getSubjectCombinationSuggestions, type SubjectCombinationOutput } from '@/ai/flows/subject-combination-flow';

const SUBJECTS = [
  'Mathematics', 'English', 'Kiswahili', 'Physics', 'Chemistry', 'Biology',
  'History', 'Geography', 'CRE', 'Business Studies', 'Agriculture', 'Computer Studies',
  'Art & Design', 'Music', 'Home Science', 'Physical Education'
];

const stemCombinations = [
    {
      subjects: "Biology – Chemistry – Physics",
      careers: [
        "Physician / Surgeon (pre-med sciences)", "Dentist / Dental Surgeon", "Pharmacist", "Nurse / Nurse Practitioner / Midwife", "Medical Laboratory Scientist / Technologist", "Radiographer / Imaging Technologist (e.g., MRI, CT)", "Physiotherapist / Occupational Therapist", "Biochemist / Biophysicist (research)", "Environmental Scientist / Specialist", "Chemical Engineer (process industries, pharma, energy)", "Forensic Science Technician", "Laboratory Technician (bio/chem)", "Natural Sciences Manager (R&D leadership)", "Military medical & science roles (e.g., Preventive Medicine Officer; Special Forces Medic; Medical/Nursing Corps)",
      ],
    },
    {
      subjects: "Biology – Chemistry – Business Studies",
      careers: [
        "Pharmaceutical / Medical Sales Representative", "Biotech / Scientific Sales & Marketing, Product Specialist", "Food & Drug Quality / Regulatory Affairs, Inspector/Analyst", "Health Services Manager / Hospital Administration", "Environmental Consultant (industry compliance)", "Clinical Trial Associate / Medical Device Sales", "Military medical administration & logistics (Medical Service Corps–style roles)",
      ],
    },
    {
      subjects: "Biology – Agriculture – Physics",
      careers: [
        "Agricultural Biologist (plant/animal systems)", "Agronomist / Crop Scientist / Seed Technologist", "Soil Scientist / Conservation Scientist", "Wildlife Biologist / Conservation Biologist", "Agricultural Engineer / Irrigation Systems Technician (physics applications)", "Environmental Scientist (farm ecosystems, water/soil)", "Military environmental science / veterinary support (public health, sanitation, zoonotic surveillance)",
      ],
    },
    {
      subjects: "Biology – Agriculture – Business Studies",
      careers: [
        "Agribusiness Manager / Farm Manager (production & markets)", "Agricultural Extension Officer / Farm Consultant", "Food Production & Quality Control / Food Safety Auditor", "Supply-Chain & Agri-Logistics Coordinator / Commodity Trader", "Rural Development / Agri-project Officer", "Military logistics / supply & procurement (food, rations, cold chain)",
      ],
    },
    {
      subjects: "Biology – Computer Science – Physics",
      careers: [
        "Bioinformatics Analyst / Computational Biologist", "Machine Learning Specialist (Ag-tech/biotech)", "Biomedical Equipment Technician / Clinical Engineering Tech", "Medical/Scientific Software Developer (imaging, lab systems)", "Medical Data Scientist / Health Analytics", "Military biomedical tech & cyber-health analytics (biomedical equipment, telemedicine support)",
      ],
    },
    {
      subjects: "Biology – Computer Science – Business Studies",
      careers: [
        "Health Informatics Specialist / EHR Systems Analyst", "Biotech Product Manager / Product Owner (digital health)", "Data Analyst (public health, hospitals, pharma, NGOs)", "Digital Health / Telemedicine Consultant", "Health Tech Sales (SaaS, devices)", "Military medical IT / health information systems",
      ],
    },
    {
      subjects: "Geography – Chemistry – Physics",
      careers: [
        "Geochemist (field & lab; resources, water, remediation)", "Geoscientist / Environmental Scientist", "Climatologist / Hydrologist", "Environmental Chemist / Toxicologist (environmental analysis)", "Disaster Risk & Hazard Analyst (earth systems focus)", "Military CBRN (Chemical, Biological, Radiological & Nuclear) specialist tracks",
      ],
    },
    {
      subjects: "Geography – Chemistry – Business Studies",
      careers: [
        "Environmental Consultant / EIA Practitioner", "Sustainability / ESG Consultant", "Environmental Health & Safety (EHS) Manager", "Natural Resources / Compliance Manager", "Waste & Pollution Control Manager (industrial)", "Military environmental compliance / base EHS roles",
      ],
    },
    {
      subjects: "Geography – Agriculture – Physics",
      careers: [
        "Soil Scientist / Land Resource Specialist", "Climate & Weather Analyst (agro-meteorology)", "Irrigation Engineer / Hydrology Technician", "Disaster Risk Management Specialist (drought/flood)", "Precision Agriculture Technologist (sensing, UAVs)", "Military engineering (bridging, water, survey) with geo/physics inputs",
      ],
    },
    {
      subjects: "Geography – Agriculture – Business Studies",
      careers: [
        "Agribusiness Consultant / Value-chain Specialist", "Agricultural Supply-Chain & Logistics Officer", "Rural Development / Food Security Officer", "Sustainability Program Manager (agri-sourcing)", "Agricultural Marketing / Commodity Trading Associate", "Military logistics & procurement (food, fuels, transport)",
      ],
    },
    {
      subjects: "Geography – Computer Science – Physics",
      careers: [
        "GIS Developer / Geospatial Software Engineer", "Remote Sensing Specialist (satellite/aerial analytics)", "Climate Modelling / Environmental Simulation Technician", "Geospatial Systems Engineer / Sensor Integration", "Military GEOINT / Geospatial Intelligence & mapping",
      ],
    },
    {
      subjects: "Geography – Computer Science – Business Studies",
      careers: [
        "GIS Business Analyst (site selection, retail/NGO planning)", "Urban & Regional Planner (tech-driven planning)", "Market Research / Location Analytics Specialist", "Logistics / Network Optimization Analyst", "Military logistics planning / movement control with GIS",
      ],
    },
];

const socialSciencesCombinations = [
    { 
        subjects: "History – Business Studies – Geography", 
        careers: [
            "International Relations / Diplomat", "Urban & Regional Planner", "Logistics & Supply Chain Manager", "Geopolitical / Market Research Analyst", "Tourism & Travel Management", "Environmental Policy Analyst", "Public Administrator"
        ] 
    },
    { 
        subjects: "History – Business Studies – Fasihi", 
        careers: [
            "Public Relations Specialist", "Corporate Communications Officer", "Journalist / News Anchor", "Publisher / Editor", "Marketing & Advertising Executive", "Government Administrator", "Cultural Heritage Manager"
        ] 
    },
    { 
        subjects: "History – Business Studies – Arabic", 
        careers: [
            "International Business Consultant (MENA focus)", "Diplomat / Foreign Service Officer", "Translator / Interpreter", "International Journalist", "NGO Manager (Middle East)", "Cross-Cultural Business Liaison"
        ] 
    },
    { 
        subjects: "History – CRE/IRE – Geography", 
        careers: [
            "Social Worker", "Community Development Officer", "NGO Program Officer", "Teacher (History, Geography, CRE/IRE)", "Social Policy Analyst", "Humanitarian Aid Worker", "Disaster Management Specialist"
        ] 
    },
    { 
        subjects: "History – CRE/IRE – Fasihi", 
        careers: [
            "Teacher (History, Fasihi, CRE/IRE)", "Cultural Journalist / Critic", "Museum Curator / Archivist", "Community Outreach Coordinator", "Social Researcher", "Writer / Author", "Communications Officer for NGOs"
        ] 
    },
    { 
        subjects: "History – CRE/IRE – Arabic", 
        careers: [
            "Islamic Studies Scholar / Researcher", "Teacher (History, IRE, Arabic)", "Chaplain / Community Religious Leader", "Interfaith Dialogue Coordinator", "Translator (Historical/Religious Texts)", "Work in Faith-Based Organizations"
        ] 
    },
    { 
        subjects: "Literature – Business Studies – Geography", 
        careers: [
            "Marketing Strategist", "Brand Manager", "Travel Writer / Tourism Marketer", "Real Estate Developer / Marketer", "Corporate Storyteller / Communications", "Publisher", "Location Scout (Film/Media)"
        ] 
    },
    { 
        subjects: "Literature – Business Studies – Fasihi", 
        careers: [
            "Copywriter / Content Creator", "Editor / Proofreader", "Public Relations Manager", "Media Producer / Scriptwriter", "Brand Storyteller", "Corporate Trainer", "Marketing Communications Manager"
        ] 
    },
    { 
        subjects: "Literature – Business Studies – Arabic", 
        careers: [
            "International Marketing Specialist (MENA)", "Cross-Cultural Communications Consultant", "Corporate Translator", "Public Relations for International Firms", "Global Brand Manager", "Business Development in Arabic Markets"
        ] 
    },
    { 
        subjects: "Literature – CRE/IRE – Geography", 
        careers: [
            "Teacher (English, Literature, CRE, Geography)", "Journalist / Social Commentator", "Policy Advisor for NGOs", "Community Educator", "Development Communications Officer", "Ethicist / Social Critic"
        ] 
    },
    { 
        subjects: "Literature – CRE/IRE – Fasihi", 
        careers: [
            "Teacher (Literature, Fasihi, CRE)", "Writer / Poet / Playwright", "Editor for Cultural Publications", "Religious / Cultural Correspondent", "Communications for Faith-Based NGOs", "Scriptwriter for local content"
        ] 
    },
    { 
        subjects: "Literature – CRE/IRE – Arabic", 
        careers: [
            "Scholar in Comparative Literature/Religion", "Translator (Literary/Religious Texts)", "Educator in Humanities", "Cultural Advisor", "Content creator for religious media", "Librarian/Archivist for special collections"
        ] 
    },
];

export default function SubjectCombinationPage() {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<SubjectCombinationOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubjectToggle = (subject: string) => {
    setSelectedSubjects(prev =>
      prev.includes(subject) ? prev.filter(s => s !== subject) : [...prev, subject]
    );
    setSuggestions(null);
  };

  const handleGetSuggestions = async () => {
    if (selectedSubjects.length < 3) {
        toast({ variant: 'destructive', title: 'Not enough subjects', description: 'Please select at least 3 subjects.' });
        return;
    }
    setIsLoading(true);
    setSuggestions(null);
    try {
        const result = await getSubjectCombinationSuggestions({ subjects: selectedSubjects });
        setSuggestions(result);
    } catch (error: any) {
        toast({ variant: 'destructive', title: 'Failed to get suggestions', description: error.message });
    } finally {
        setIsLoading(false);
    }
  };


  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <Card className="max-w-5xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-extrabold text-primary">Subject Combination Explorer</CardTitle>
            <CardDescription className="text-lg">
              Select subjects you excel at to get AI-powered career suggestions, or explore common combinations below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 text-center">Get Personalized Suggestions</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {SUBJECTS.map(subject => (
                  <div
                    key={subject}
                    className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedSubjects.includes(subject)
                        ? 'bg-primary/10 border-primary'
                        : 'hover:bg-accent'
                    }`}
                    onClick={() => handleSubjectToggle(subject)}
                  >
                    <Checkbox
                      id={subject}
                      checked={selectedSubjects.includes(subject)}
                      onCheckedChange={() => handleSubjectToggle(subject)}
                    />
                    <Label htmlFor={subject} className="cursor-pointer flex-1">{subject}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center my-8">
              <Button 
                size="lg" 
                onClick={handleGetSuggestions} 
                disabled={isLoading || selectedSubjects.length < 3}
              >
                {isLoading ? <Loader2 className="mr-2 animate-spin" /> : <Wand2 className="mr-2" />}
                Get AI Career Suggestions
              </Button>
              {selectedSubjects.length < 3 && <p className="text-xs text-muted-foreground mt-2">Select at least 3 subjects to get suggestions.</p>}
            </div>

            {suggestions && (
                <Card className="mt-8 p-6 bg-secondary/50 animate-in fade-in-50">
                    <h3 className="text-xl font-bold mb-4 text-primary">AI Generated Suggestions</h3>
                    <div className="space-y-6">
                        <div>
                            <h4 className="font-semibold text-lg">Reasoning</h4>
                            <p className="text-muted-foreground">{suggestions.reasoning}</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-lg">Recommended Careers</h4>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {suggestions.recommendedCareers.map(career => <Badge key={career}>{career}</Badge>)}
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold text-lg">Further Studies</h4>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {suggestions.furtherStudies.map(study => <Badge variant="secondary" key={study}>{study}</Badge>)}
                            </div>
                        </div>
                    </div>
                </Card>
            )}

            <Separator className="my-12" />

            <div className="text-center">
                <h3 className="text-2xl font-extrabold text-primary flex items-center justify-center gap-3"><BookOpen /> Explore Common Subject Combinations</h3>
                <p className="text-muted-foreground mt-2">Discover popular subject combinations and the career paths they can lead to.</p>
            </div>

            <Tabs defaultValue="stem" className="w-full mt-8">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="stem">STEM Pathway</TabsTrigger>
                    <TabsTrigger value="social-sciences">Social Sciences Pathway</TabsTrigger>
                </TabsList>
                <TabsContent value="stem" className="mt-6">
                    <Accordion type="single" collapsible className="w-full">
                        {stemCombinations.map((combo, index) => (
                            <AccordionItem value={`stem-${index}`} key={`stem-${index}`}>
                                <AccordionTrigger className="text-base hover:no-underline">
                                    <div className="flex flex-wrap gap-2 text-left">
                                      {combo.subjects.split(' – ').map(s => <Badge key={s} className="text-sm">{s}</Badge>)}
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <h4 className="font-semibold mb-3 text-foreground">Potential Careers:</h4>
                                    <ul className="list-disc list-inside space-y-1.5 text-muted-foreground">
                                        {combo.careers.map((career, i) => <li key={i}>{career}</li>)}
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </TabsContent>
                <TabsContent value="social-sciences" className="mt-6">
                    <Accordion type="single" collapsible className="w-full">
                        {socialSciencesCombinations.map((combo, index) => (
                            <AccordionItem value={`ss-${index}`} key={`ss-${index}`}>
                                <AccordionTrigger className="text-base hover:no-underline">
                                     <div className="flex flex-wrap gap-2 text-left">
                                      {combo.subjects.split(' – ').map(s => <Badge key={s} variant="secondary" className="text-sm">{s}</Badge>)}
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <h4 className="font-semibold mb-3 text-foreground">Potential Careers:</h4>
                                    <ul className="list-disc list-inside space-y-1.5 text-muted-foreground">
                                        {combo.careers.map((career, i) => <li key={i}>{career}</li>)}
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </TabsContent>
            </Tabs>

          </CardContent>
        </Card>
      </main>
    </div>
  );
}
