import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import {
  Camera,
  FileText,
  Sparkles,
  CheckCircle2,
  ArrowLeft,
  UploadCloud,
  ArrowRight,
  Info,
  RotateCcw,
  Building2,
  ShieldCheck,
  Scale
} from 'lucide-react';
import { useData } from '../../context/DataContext';

export const RegisterInstrumentPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode'); // 'ocr' | 'manual' | null

  const { registerInstrument, runOCR } = useData();

  // Mode Selection: null (Choice Screen), 'ocr' (Upload Photo), 'manual' (Fill Form)
  const [selectedMode, setSelectedMode] = useState(initialMode || null);

  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrResult, setOcrResult] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  // 17 Complete Form Fields as requested
  const [formData, setFormData] = useState({
    // 1. Technical Specifications
    type: 'Heavy Electronic Weighbridge',
    manufacturer: '',
    model: '',
    serialNumber: '',
    maxCapacity: '',
    minCapacity: '',
    unitOfMeasurement: 'kg',
    accuracyClass: 'Class III (Medium Commercial)',
    scaleInterval: '10 g',
    quantity: '1',

    // 2. Premises & Location Details
    premisesName: 'Apex Logistics Warehouse Hub #4',
    installationAddress: 'Plot 45, MIDC Industrial Area, Chakan',
    state: 'Maharashtra',
    district: 'Pune',

    // 3. Verification & Approval Details
    verificationType: 'Initial Verification',
    previousCertificateNo: '',
    modelApprovalNo: 'IND/09/2021/442'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Simulate Photo Upload & OCR Extraction
  const handleOcrExtract = async () => {
    setOcrLoading(true);
    setOcrResult(null);

    const res = await runOCR(previewImage);

    setOcrResult(res);
    setFormData((prev) => ({
      ...prev,
      type: res.extractedData.type || 'Heavy Electronic Weighbridge',
      manufacturer: res.extractedData.manufacturer || 'Avery India Ltd',
      model: res.extractedData.model || 'WB-60T-PRO',
      serialNumber: res.extractedData.serialNumber || 'AV-984210-IN',
      maxCapacity: '60,000',
      minCapacity: '100',
      unitOfMeasurement: 'kg',
      accuracyClass: 'Class III (Medium Commercial)',
      scaleInterval: '10 g',
      quantity: '1',
      premisesName: 'Apex Logistics Warehouse Hub #4',
      installationAddress: 'Plot 45, MIDC Industrial Area, Chakan, Pune, Maharashtra - 410501',
      state: 'Maharashtra',
      district: 'Pune',
      verificationType: 'Initial Verification',
      previousCertificateNo: '',
      modelApprovalNo: 'IND/09/2021/442'
    }));

    setOcrLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    await registerInstrument({
      ...formData,
      capacity: `${formData.maxCapacity} ${formData.unitOfMeasurement}`,
      location: `${formData.premisesName}, ${formData.installationAddress}, ${formData.district}, ${formData.state}`
    });
    setSubmitLoading(false);
    navigate('/business');
  };

  const indianStates = [
    'Maharashtra',
    'Gujarat',
    'Delhi',
    'Karnataka',
    'Tamil Nadu',
    'West Bengal',
    'Uttar Pradesh',
    'Telangana',
    'Rajasthan',
    'Madhya Pradesh',
    'Haryana',
    'Punjab',
    'Kerala',
    'Andhra Pradesh',
    'Odisha',
    'Bihar'
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-7 pb-20 text-[#003943]">
      {/* Change Method Button (Visible when mode selected) */}
      {selectedMode && (
        <div className="flex justify-end border-b border-[#003943]/10 pb-4">
          <button
            type="button"
            onClick={() => {
              setSelectedMode(null);
              setOcrResult(null);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#E0F5F6] text-[#003943] text-xs font-bold hover:bg-[#00959C] hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Change Method</span>
          </button>
        </div>
      )}

      {/* 1. SELECTION SCREEN (CHOICE BETWEEN OPTION 1 & OPTION 2) */}
      {!selectedMode ? (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="space-y-2 text-center max-w-xl mx-auto pt-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#00959C]">
              INSTRUMENT REGISTRATION
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#003943]">
              How would you like to register?
            </h1>
            <p className="text-xs sm:text-sm text-[#003943]/70 font-medium">
              Choose one of the two options below to add your weighing or measuring instrument.
            </p>
          </div>

          {/* TWO OPTIONS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            {/* OPTION 1: Upload Photo (AI Form Fill) */}
            <div
              onClick={() => setSelectedMode('ocr')}
              className="group bg-white rounded-3xl p-7 border-2 border-dashed border-[#003943]/20 hover:border-[#00959C] shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between space-y-6 relative overflow-hidden"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-[#003943] text-[#02B7BF] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                    <Camera className="w-7 h-7 text-[#02B7BF]" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#E0F5F6] text-[#00959C] text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> AI OCR
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-serif font-bold text-[#003943]">
                    Upload photo of the plate
                  </h3>
                  <p className="text-xs text-[#003943]/70 leading-relaxed font-normal">
                    Upload a photo of the nameplate — our AI will automatically read specifications & fill the form for you.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#003943]/10 flex items-center justify-between font-bold text-xs text-[#00959C] group-hover:text-[#003943]">
                <span>Option 1: Upload Photo</span>
                <div className="w-7 h-7 rounded-full bg-[#00959C] group-hover:bg-[#003943] text-white flex items-center justify-center transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* OPTION 2: Fill Form Manually */}
            <div
              onClick={() => setSelectedMode('manual')}
              className="group bg-white rounded-3xl p-7 border-2 border-dashed border-[#003943]/20 hover:border-[#00959C] shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between space-y-6 relative overflow-hidden"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-[#E0F5F6] text-[#003943] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                    <FileText className="w-7 h-7 text-[#00959C]" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-extrabold uppercase tracking-wider">
                    Manual Entry
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-serif font-bold text-[#003943]">
                    Fill the form manually
                  </h3>
                  <p className="text-xs text-[#003943]/70 leading-relaxed font-normal">
                    Enter instrument details such as manufacturer, serial number, capacity, and accuracy class manually into the form.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#003943]/10 flex items-center justify-between font-bold text-xs text-[#00959C] group-hover:text-[#003943]">
                <span>Option 2: Fill Form</span>
                <div className="w-7 h-7 rounded-full bg-[#00959C] group-hover:bg-[#003943] text-white flex items-center justify-center transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* 2. FORM / WORKFLOW PAGE WITH ALL 17 FIELDS */
        <div className="space-y-8 animate-in fade-in duration-150">
          <div className="space-y-1">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#00959C]">
              {selectedMode === 'ocr' ? 'OPTION 1: UPLOAD PHOTO & AI AUTOFILL' : 'OPTION 2: MANUAL FORM ENTRY'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#003943]">
              {selectedMode === 'ocr' ? 'Upload Nameplate Photo' : 'Instrument Registration Form'}
            </h1>
            <p className="text-xs sm:text-sm text-[#003943]/70 font-medium">
              {selectedMode === 'ocr'
                ? 'Upload your nameplate photo to let AI extract specifications, then review & submit.'
                : 'Fill out the mandatory Legal Metrology specifications in the form below.'}
            </p>
          </div>

          {/* AI OCR PHOTO UPLOADER BOX (VISIBLE IN OPTION 1) */}
          {selectedMode === 'ocr' && (
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#003943]/15 shadow-md space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#003943] text-[#02B7BF] flex items-center justify-center shrink-0">
                  <Camera className="w-6 h-6 text-[#02B7BF]" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-[#003943] text-base sm:text-lg">
                    AI Nameplate OCR Photo Scanner
                  </h3>
                  <p className="text-xs text-[#003943]/70">
                    Upload identification plate photo. System reads Manufacturer, Model, Serial No & Capacity automatically.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                <div className="flex-1 w-full border-2 border-dashed border-[#00959C]/30 hover:border-[#00959C] rounded-2xl p-5 bg-[#FDF9F6] text-center cursor-pointer transition-colors">
                  <UploadCloud className="w-8 h-8 text-[#00959C] mx-auto mb-1.5" />
                  <p className="text-xs font-bold text-[#003943]">Click to Select Nameplate Photo</p>
                  <p className="text-[11px] text-[#003943]/60">Supports JPG, PNG up to 10MB</p>
                </div>

                <button
                  type="button"
                  disabled={ocrLoading}
                  onClick={handleOcrExtract}
                  className="w-full sm:w-auto px-6 py-4 rounded-full bg-[#003943] hover:bg-[#002B33] text-white font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 text-[#02B7BF]" />
                  <span>{ocrLoading ? 'Scanning Photo...' : 'Extract Details via AI OCR'}</span>
                </button>
              </div>

              {ocrResult && (
                <div className="p-4 bg-[#E0F5F6] rounded-2xl border border-[#00959C]/40 text-xs text-[#003943] space-y-1 animate-in fade-in">
                  <div className="flex items-center gap-2 font-bold text-[#00959C]">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Details Extracted Successfully! (AI OCR Confidence 96%)</span>
                  </div>
                  <p className="text-[11px] text-[#003943]/80">
                    Form fields below have been pre-filled automatically with OCR data. Please review before saving.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* MAIN 17-FIELD REGISTRATION FORM */}
          <form onSubmit={handleSubmit} className="space-y-7">
            {/* SECTION 1: INSTRUMENT & TECHNICAL SPECIFICATIONS */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#003943]/15 shadow-md space-y-6">
              <div className="pb-3 border-b border-[#003943]/10 flex items-center gap-2.5">
                <Scale className="w-5 h-5 text-[#00959C]" />
                <h3 className="font-serif font-bold text-lg sm:text-xl text-[#003943]">
                  1. Instrument & Technical Specifications
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                {/* Row 1: Category & Quantity */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#003943]/80">
                    Category / Instrument Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#FDF9F6] border border-[#003943]/20 rounded-xl px-4 py-3 text-xs sm:text-sm font-semibold text-[#003943] focus:outline-none focus:border-[#00959C]"
                  >
                    <option value="Heavy Electronic Weighbridge">Heavy Electronic Weighbridge</option>
                    <option value="Retail Digital Counter Scale">Retail Digital Counter Scale</option>
                    <option value="Fuel Dispensing Meter (Multi-Product)">Fuel Dispensing Meter (Multi-Product)</option>
                    <option value="Industrial Automatic Liquid Flowmeter">Industrial Automatic Liquid Flowmeter</option>
                    <option value="Pre-packaged Quantity Check Scale">Pre-packaged Quantity Check Scale</option>
                    <option value="Precision Laboratory Analytical Balance">Precision Laboratory Analytical Balance</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#003943]/80">
                    Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    min="1"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#FDF9F6] border border-[#003943]/20 rounded-xl px-4 py-3 text-xs sm:text-sm font-semibold text-[#003943] focus:outline-none focus:border-[#00959C]"
                  />
                </div>

                {/* Row 2: Manufacturer & Model */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#003943]/80">
                    Manufacturer Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="manufacturer"
                    value={formData.manufacturer}
                    onChange={handleChange}
                    placeholder="e.g. Avery India Ltd / Essae-Teraoka"
                    required
                    className="w-full bg-[#FDF9F6] border border-[#003943]/20 rounded-xl px-4 py-3 text-xs sm:text-sm font-semibold text-[#003943] focus:outline-none focus:border-[#00959C]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#003943]/80">
                    Model Name / Designation <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    placeholder="e.g. WB-60T-PRO"
                    required
                    className="w-full bg-[#FDF9F6] border border-[#003943]/20 rounded-xl px-4 py-3 text-xs sm:text-sm font-semibold text-[#003943] focus:outline-none focus:border-[#00959C]"
                  />
                </div>

                {/* Row 3: Serial Number & Model Approval No */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#003943]/80">
                    Serial Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="serialNumber"
                    value={formData.serialNumber}
                    onChange={handleChange}
                    placeholder="e.g. AV-984210-IN"
                    required
                    className="w-full bg-[#FDF9F6] border border-[#003943]/20 rounded-xl px-4 py-3 text-xs sm:text-sm font-mono font-bold text-[#003943] focus:outline-none focus:border-[#00959C]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#003943]/80">
                    Model Approval No.
                  </label>
                  <input
                    type="text"
                    name="modelApprovalNo"
                    value={formData.modelApprovalNo}
                    onChange={handleChange}
                    placeholder="e.g. IND/09/2021/442"
                    className="w-full bg-[#FDF9F6] border border-[#003943]/20 rounded-xl px-4 py-3 text-xs sm:text-sm font-mono font-bold text-[#003943] focus:outline-none focus:border-[#00959C]"
                  />
                </div>

                {/* Row 4: Max Capacity & Min Capacity */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#003943]/80">
                    Max Capacity / Range <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="maxCapacity"
                    value={formData.maxCapacity}
                    onChange={handleChange}
                    placeholder="e.g. 60,000"
                    required
                    className="w-full bg-[#FDF9F6] border border-[#003943]/20 rounded-xl px-4 py-3 text-xs sm:text-sm font-semibold text-[#003943] focus:outline-none focus:border-[#00959C]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#003943]/80">
                    Min Capacity / Range
                  </label>
                  <input
                    type="text"
                    name="minCapacity"
                    value={formData.minCapacity}
                    onChange={handleChange}
                    placeholder="e.g. 100"
                    className="w-full bg-[#FDF9F6] border border-[#003943]/20 rounded-xl px-4 py-3 text-xs sm:text-sm font-semibold text-[#003943] focus:outline-none focus:border-[#00959C]"
                  />
                </div>

                {/* Row 5: Unit of Measurement & Scale Interval */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#003943]/80">
                    Unit of Measurement <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="unitOfMeasurement"
                    value={formData.unitOfMeasurement}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#FDF9F6] border border-[#003943]/20 rounded-xl px-4 py-3 text-xs sm:text-sm font-semibold text-[#003943] focus:outline-none focus:border-[#00959C]"
                  >
                    <option value="kg">Kilograms (kg)</option>
                    <option value="g">Grams (g)</option>
                    <option value="t (tonnes)">Tonnes (t)</option>
                    <option value="L (litres)">Litres (L)</option>
                    <option value="L/min">Litres per minute (L/min)</option>
                    <option value="m³">Cubic Meters (m³)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#003943]/80">
                    Scale Interval (e)
                  </label>
                  <input
                    type="text"
                    name="scaleInterval"
                    value={formData.scaleInterval}
                    onChange={handleChange}
                    placeholder="e.g. e = 10 g or e = 0.01 L"
                    className="w-full bg-[#FDF9F6] border border-[#003943]/20 rounded-xl px-4 py-3 text-xs sm:text-sm font-semibold text-[#003943] focus:outline-none focus:border-[#00959C]"
                  />
                </div>

                {/* Row 6: Accuracy Class */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#003943]/80">
                    Accuracy Class (Rules 2011)
                  </label>
                  <select
                    name="accuracyClass"
                    value={formData.accuracyClass}
                    onChange={handleChange}
                    className="w-full bg-[#FDF9F6] border border-[#003943]/20 rounded-xl px-4 py-3 text-xs sm:text-sm font-semibold text-[#003943] focus:outline-none focus:border-[#00959C]"
                  >
                    <option value="Class I (Special Precision)">Class I (Special Precision)</option>
                    <option value="Class II (High Accuracy)">Class II (High Accuracy)</option>
                    <option value="Class III (Medium Commercial)">Class III (Medium Commercial)</option>
                    <option value="Class IV (Ordinary Heavy)">Class IV (Ordinary Heavy)</option>
                    <option value="Class 0.5 (Fuel/Liquids)">Class 0.5 (Fuel/Liquids)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* SECTION 2: PREMISES & INSTALLATION LOCATION DETAILS */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#003943]/15 shadow-md space-y-6">
              <div className="pb-3 border-b border-[#003943]/10 flex items-center gap-2.5">
                <Building2 className="w-5 h-5 text-[#00959C]" />
                <h3 className="font-serif font-bold text-lg sm:text-xl text-[#003943]">
                  2. Premises & Installation Details
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#003943]/80">
                    Premises / Installation Name
                  </label>
                  <input
                    type="text"
                    name="premisesName"
                    value={formData.premisesName}
                    onChange={handleChange}
                    placeholder="e.g. Apex Logistics Warehouse Depot 4"
                    className="w-full bg-[#FDF9F6] border border-[#003943]/20 rounded-xl px-4 py-3 text-xs sm:text-sm font-semibold text-[#003943] focus:outline-none focus:border-[#00959C]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#003943]/80">
                    Installation Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="installationAddress"
                    value={formData.installationAddress}
                    onChange={handleChange}
                    placeholder="e.g. Plot 45, MIDC Industrial Area, Chakan"
                    required
                    className="w-full bg-[#FDF9F6] border border-[#003943]/20 rounded-xl px-4 py-3 text-xs sm:text-sm font-semibold text-[#003943] focus:outline-none focus:border-[#00959C]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#003943]/80">
                    State <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#FDF9F6] border border-[#003943]/20 rounded-xl px-4 py-3 text-xs sm:text-sm font-semibold text-[#003943] focus:outline-none focus:border-[#00959C]"
                  >
                    {indianStates.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#003943]/80">
                    District <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    placeholder="e.g. Pune / Thane / Nagpur"
                    required
                    className="w-full bg-[#FDF9F6] border border-[#003943]/20 rounded-xl px-4 py-3 text-xs sm:text-sm font-semibold text-[#003943] focus:outline-none focus:border-[#00959C]"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 3: VERIFICATION TYPE & LEGAL APPROVAL DETAILS */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#003943]/15 shadow-md space-y-6">
              <div className="pb-3 border-b border-[#003943]/10 flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-[#00959C]" />
                <h3 className="font-serif font-bold text-lg sm:text-xl text-[#003943]">
                  3. Verification & Legal Approval Details
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#003943]/80">
                    Verification Type <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3 pt-0.5">
                    <label
                      className={`p-3 rounded-xl border cursor-pointer text-center font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                        formData.verificationType === 'Initial Verification'
                          ? 'border-[#00959C] bg-[#003943] text-white shadow-xs'
                          : 'border-[#003943]/20 bg-[#FDF9F6] text-[#003943]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="verificationType"
                        value="Initial Verification"
                        checked={formData.verificationType === 'Initial Verification'}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <span>Initial</span>
                    </label>

                    <label
                      className={`p-3 rounded-xl border cursor-pointer text-center font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                        formData.verificationType === 'Re-verification'
                          ? 'border-[#00959C] bg-[#003943] text-white shadow-xs'
                          : 'border-[#003943]/20 bg-[#FDF9F6] text-[#003943]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="verificationType"
                        value="Re-verification"
                        checked={formData.verificationType === 'Re-verification'}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <span>Re-verification</span>
                    </label>
                  </div>
                </div>

                {formData.verificationType === 'Re-verification' ? (
                  <div className="space-y-1.5 animate-in fade-in duration-150">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#003943]/80">
                      Previous Certificate No. <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="previousCertificateNo"
                      value={formData.previousCertificateNo}
                      onChange={handleChange}
                      placeholder="e.g. CERT-2025-8891"
                      required
                      className="w-full bg-[#FDF9F6] border border-[#003943]/20 rounded-xl px-4 py-3 text-xs sm:text-sm font-mono font-bold text-[#003943] focus:outline-none focus:border-[#00959C]"
                    />
                  </div>
                ) : (
                  <div className="space-y-1.5 opacity-50 select-none">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#003943]/60">
                      Previous Certificate No.
                    </label>
                    <div className="w-full bg-[#FDF9F6] border border-[#003943]/10 rounded-xl px-4 py-3 text-xs font-medium text-[#003943]/60 italic flex items-center justify-between">
                      <span>Not required for Initial Verification</span>
                      <span className="text-[10px] font-bold uppercase bg-[#003943]/10 px-2 py-0.5 rounded">Initial</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 bg-[#E0F5F6] rounded-2xl border border-[#00959C]/30 text-xs text-[#003943] flex items-center gap-3">
                <Info className="w-5 h-5 text-[#00959C] shrink-0" />
                <span className="font-bold text-[#003943]">
                  Once saved, this instrument will be registered in your account registry and available for Legal Metrology Officers (LMO) verification.
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#003943]/10">
                <Link
                  to="/business"
                  className="px-6 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-[#003943] font-bold text-xs sm:text-sm transition-colors"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={submitLoading}
                  className="px-7 py-3.5 rounded-full bg-[#003943] hover:bg-[#002B33] text-white font-extrabold text-xs sm:text-sm transition-all shadow-md flex items-center gap-2 group"
                >
                  <span>{submitLoading ? 'Saving Specifications...' : 'Save & Register Instrument'}</span>
                  <ArrowRight className="w-4 h-4 text-[#02B7BF] group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
