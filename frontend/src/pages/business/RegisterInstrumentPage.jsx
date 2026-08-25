import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Camera, Sparkles, CheckCircle, ArrowLeft, UploadCloud, AlertCircle, Info, Loader2 } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Badge } from '../../components/common/Badge';

export const RegisterInstrumentPage = () => {
  const navigate = useNavigate();
  const { registerInstrument, runOCR } = useData();

  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrResult, setOcrResult] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const [formData, setFormData] = useState({
    type: 'Heavy Electronic Weighbridge',
    manufacturer: '',
    model: '',
    serialNumber: '',
    capacity: '',
    accuracyClass: 'Class III (Medium)',
    location: 'Plot 45, MIDC Logistics Hub, Pune, Maharashtra',
    ownerName: 'Apex Logistics & Freight Corp'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Simulate Photo Upload & OCR Extraction
  const handleOcrExtract = async () => {
    setOcrLoading(true);
    setOcrResult(null);

    // Call isolated mock API service through DataContext
    const res = await runOCR(previewImage);

    setOcrResult(res);
    setFormData((prev) => ({
      ...prev,
      type: res.extractedData.type,
      manufacturer: res.extractedData.manufacturer,
      model: res.extractedData.model,
      serialNumber: res.extractedData.serialNumber,
      capacity: res.extractedData.capacity,
      accuracyClass: res.extractedData.accuracyClass
    }));

    setOcrLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    await registerInstrument(formData);
    setSubmitLoading(false);
    navigate('/business');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Breadcrumb */}
      <div>
        <Link to="/business" className="inline-flex items-center gap-1 text-xs text-neutral-600 hover:text-neutral-900 mb-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Business Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-neutral-900">Register Weighing / Measuring Instrument</h1>
        <p className="text-xs text-neutral-600">
          Add new instrument specifications into the Legal Metrology Registry. You can upload a photo of the nameplate for instant AI-assisted OCR autofill.
        </p>
      </div>

      {/* AI OCR Scanner Box */}
      <Card className="bg-primary-light/40 border-primary/30 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary text-white flex items-center justify-center shrink-0">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-neutral-900">AI Nameplate OCR Scanner</h3>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-600" /> AI OCR Feature
                </span>
              </div>
              <p className="text-xs text-neutral-600">
                Upload identification plate photo. The system extracts Manufacturer, Model, Serial No & Capacity automatically.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
          {/* File input mockup */}
          <div className="flex-1 w-full border-2 border-dashed border-primary/30 hover:border-primary rounded-lg p-4 bg-white text-center cursor-pointer transition-colors">
            <UploadCloud className="w-6 h-6 text-primary mx-auto mb-1" />
            <p className="text-xs font-semibold text-neutral-900">Select Nameplate Photo or Sample</p>
            <p className="text-[11px] text-neutral-600">JPG, PNG up to 5MB</p>
          </div>

          <Button
            type="button"
            variant="accent"
            size="md"
            loading={ocrLoading}
            onClick={handleOcrExtract}
            icon={Sparkles}
            className="w-full sm:w-auto shrink-0"
          >
            Extract Details via OCR
          </Button>
        </div>

        {/* OCR Result Indicator Banner */}
        {ocrResult && (
          <div className="p-3 bg-white rounded-md border border-accent/40 text-xs text-neutral-900 space-y-1.5 animate-in fade-in">
            <div className="flex items-center justify-between text-accent font-semibold">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" /> Details Extracted Successfully (OCR Confidence 96%)
              </span>
              <Badge status="approved">OCR Suggested</Badge>
            </div>
            <p className="text-neutral-600 text-[11px]">
              Form fields below have been pre-filled with OCR values. <strong className="text-neutral-900">Please review and edit any fields if needed before final saving.</strong>
            </p>
          </div>
        )}
      </Card>

      {/* Main Registration Form */}
      <Card title="Instrument Specifications" subtitle="All fields marked with * are mandatory">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Category / Instrument Type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              options={[
                'Heavy Electronic Weighbridge',
                'Retail Digital Counter Scale',
                'Fuel Dispensing Meter (Multi-Product)',
                'Industrial Automatic Liquid Flowmeter',
                'Pre-packaged Quantity Check Scale',
                'Precision Laboratory Analytical Balance'
              ]}
            />

            <Input
              label="Manufacturer Name"
              name="manufacturer"
              placeholder="e.g. Avery India Ltd / Essae-Teraoka"
              value={formData.manufacturer}
              onChange={handleChange}
              required
              helperText={ocrResult ? 'OCR Extracted: High confidence' : undefined}
            />

            <Input
              label="Model Name / Designation"
              name="model"
              placeholder="e.g. WB-60T-PRO"
              value={formData.model}
              onChange={handleChange}
              required
            />

            <Input
              label="Serial Number (Nameplate ID)"
              name="serialNumber"
              placeholder="e.g. AV-984210-IN"
              value={formData.serialNumber}
              onChange={handleChange}
              required
              helperText="Must match physical metal plate stamped on instrument"
            />

            <Input
              label="Max Capacity / Range"
              name="capacity"
              placeholder="e.g. 60,000 kg / 30 kg / 80 L/min"
              value={formData.capacity}
              onChange={handleChange}
              required
            />

            <Select
              label="Accuracy Class (Rules 2011)"
              name="accuracyClass"
              value={formData.accuracyClass}
              onChange={handleChange}
              required
              options={[
                'Class I (Special High Precision)',
                'Class II (High Accuracy)',
                'Class III (Medium Commercial Standard)',
                'Class IV (Ordinary Heavy Industrial)',
                'Class 0.5 (Fuel Dispensers & Liquids)',
                'Class 0.3 (High Precision Flowmeter)'
              ]}
            />
          </div>

          <Input
            label="Installed Location / Facility Address"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            helperText="Address where physical verification inspection will take place"
          />

          <div className="p-3 bg-neutral-100 rounded-md border border-neutral-300 text-xs text-neutral-600 flex items-center gap-2">
            <Info className="w-4 h-4 text-primary shrink-0" />
            <span>
              Once registered, this instrument will be assigned a permanent Instrument ID and added to your business verification queue.
            </span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-300">
            <Link to="/business">
              <Button variant="ghost">Cancel</Button>
            </Link>
            <Button type="submit" variant="primary" loading={submitLoading} icon={CheckCircle}>
              Save & Register Instrument
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
