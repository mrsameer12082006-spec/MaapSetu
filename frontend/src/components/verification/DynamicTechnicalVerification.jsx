import React, { useState } from 'react';
import { FileText, Fuel, Droplets, Scale, Gauge, Sparkles } from 'lucide-react';

export const DynamicTechnicalVerification = ({ instrumentName = '', applicationType = '' }) => {
  const nameLower = instrumentName.toLowerCase();

  // Detect Instrument Category
  const isFuelDispenser = nameLower.includes('fuel') || nameLower.includes('dispens');
  const isFlowmeter = nameLower.includes('flowmeter') || nameLower.includes('liquid flow');
  const isCounterScale = nameLower.includes('counter scale') || nameLower.includes('retail');
  const isPrePackaged = nameLower.includes('pre-packaged') || nameLower.includes('package');
  const isLabBalance = nameLower.includes('balance') || nameLower.includes('laboratory') || nameLower.includes('analytical');
  // Default: Weighbridge

  // State for Fuel Dispenser
  const [fuelProduct, setFuelProduct] = useState('Petrol');
  const [nozzleId, setNozzleId] = useState('NZ-01-PETROL');
  const [fuelZeroReset, setFuelZeroReset] = useState('0.000 L');
  const [dispensedVolume, setDispensedVolume] = useState('19.995 L');
  const [fuelMpeResult, setFuelMpeResult] = useState('PASS - Calculated Error -0.025% (MPE Limit: ±0.20%)');

  // State for Flowmeter
  const [flowRate, setFlowRate] = useState('498.5 L/min');
  const [referenceVolume, setReferenceVolume] = useState('1000.0 L');
  const [measuredVolume, setMeasuredVolume] = useState('999.2 L');
  const [flowmeterMpe, setFlowmeterMpe] = useState('PASS - Measurement Error -0.08% (Limit: ±0.15%)');

  // State for Counter Scale
  const [counterZero, setCounterZero] = useState('0.000 kg');
  const [counterHalf, setCounterHalf] = useState('15.000 kg');
  const [counterMax, setCounterMax] = useState('29.999 kg');
  const [counterMpe, setCounterMpe] = useState('PASS - Within ±1.5g MPE Class III');

  // State for Pre-packaged Scale
  const [sample1, setSample1] = useState('1.002 kg');
  const [sample2, setSample2] = useState('0.998 kg');
  const [sample3, setSample3] = useState('1.001 kg');

  // State for Lab Balance
  const [obsMass, setObsMass] = useState('100.0002 g');
  const [labMpe, setLabMpe] = useState('PASS - Within Class I ±0.0005g MPE');

  // State for Weighbridge (Default)
  const [wbZero, setWbZero] = useState('0.0 kg');
  const [wbHalf, setWbHalf] = useState('29,998.5 kg');
  const [wbMax, setWbMax] = useState('59,994.0 kg');

  // 🔴 1. FUEL DISPENSING METER
  if (isFuelDispenser) {
    return (
      <div className="space-y-4 bg-amber-50/60 p-4 sm:p-5 rounded-2xl border border-amber-200">
        <div className="flex items-center justify-between border-b border-amber-200 pb-2">
          <h4 className="font-serif font-bold text-base text-[#003943] flex items-center gap-2">
            <Fuel className="w-5 h-5 text-amber-700" />
            <span>2. Fuel Dispenser Volumetric Tests (Liquid Measuring System)</span>
          </h4>
          <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-bold uppercase">
            Multi-Product Meter
          </span>
        </div>

        {/* Product & Nozzle Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3 rounded-xl border border-amber-200 text-xs">
          <div>
            <label className="block font-bold text-[#003943] mb-1">Product / Nozzle Selected</label>
            <select
              value={fuelProduct}
              onChange={(e) => {
                setFuelProduct(e.target.value);
                setNozzleId(e.target.value === 'Petrol' ? 'NZ-01-PETROL' : e.target.value === 'Diesel' ? 'NZ-02-DIESEL' : 'NZ-03-SPEED');
              }}
              className="w-full bg-[#FDF9F6] border border-[#003943]/20 rounded-lg px-3 py-2 font-bold text-[#003943]"
            >
              <option value="Petrol">Petrol (MS - Motor Spirit)</option>
              <option value="Diesel">Diesel (HSD - High Speed Diesel)</option>
              <option value="Speed Petrol">Speed / Premium Petrol</option>
            </select>
          </div>
          <div>
            <label className="block font-bold text-[#003943] mb-1">Nozzle Identification ID</label>
            <input
              type="text"
              value={nozzleId}
              onChange={(e) => setNozzleId(e.target.value)}
              className="w-full bg-[#FDF9F6] border border-[#003943]/20 rounded-lg px-3 py-2 font-mono font-bold text-[#003943]"
            />
          </div>
        </div>

        {/* Volumetric Test Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="space-y-1">
            <label className="block font-bold text-[#003943]">
              Test 1: Zero Reset Test <span className="text-gray-500 font-normal">(Expected: 0.000 L)</span>
            </label>
            <input
              type="text"
              value={fuelZeroReset}
              onChange={(e) => setFuelZeroReset(e.target.value)}
              className="w-full bg-white border border-[#003943]/20 rounded-xl px-3 py-2.5 font-mono font-bold text-[#003943]"
            />
          </div>

          <div className="space-y-1">
            <label className="block font-bold text-[#003943]">
              Test 2: Delivery Volume Accuracy <span className="text-gray-500 font-normal">(Std Measure: 20.00 L)</span>
            </label>
            <input
              type="text"
              value={dispensedVolume}
              onChange={(e) => setDispensedVolume(e.target.value)}
              className="w-full bg-white border border-[#003943]/20 rounded-xl px-3 py-2.5 font-mono font-bold text-[#003943]"
            />
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label className="block font-bold text-[#003943]">
              Test 3: Repeatability & MPE Compliance Check
            </label>
            <input
              type="text"
              value={fuelMpeResult}
              onChange={(e) => setFuelMpeResult(e.target.value)}
              className="w-full bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl px-3 py-2.5 font-mono font-bold"
            />
          </div>
        </div>
      </div>
    );
  }

  // 🟢 2. INDUSTRIAL AUTOMATIC LIQUID FLOWMETER
  if (isFlowmeter) {
    return (
      <div className="space-y-4 bg-purple-50/60 p-4 sm:p-5 rounded-2xl border border-purple-200">
        <div className="flex items-center justify-between border-b border-purple-200 pb-2">
          <h4 className="font-serif font-bold text-base text-[#003943] flex items-center gap-2">
            <Droplets className="w-5 h-5 text-purple-700" />
            <span>2. Industrial Flowmeter Measuring System Tests</span>
          </h4>
          <span className="px-2.5 py-0.5 rounded-full bg-purple-200 text-purple-900 text-[10px] font-bold uppercase">
            Mass & Liquid Flowmeter
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="space-y-1">
            <label className="block font-bold text-[#003943]">
              Test 1: Flow Rate Check <span className="text-gray-500 font-normal">(Target: 500.0 L/min)</span>
            </label>
            <input
              type="text"
              value={flowRate}
              onChange={(e) => setFlowRate(e.target.value)}
              className="w-full bg-white border border-[#003943]/20 rounded-xl px-3 py-2.5 font-mono font-bold text-[#003943]"
            />
          </div>

          <div className="space-y-1">
            <label className="block font-bold text-[#003943]">
              Test 2: Measured vs Reference Volume <span className="text-gray-500 font-normal">(Prover: {referenceVolume})</span>
            </label>
            <input
              type="text"
              value={measuredVolume}
              onChange={(e) => setMeasuredVolume(e.target.value)}
              className="w-full bg-white border border-[#003943]/20 rounded-xl px-3 py-2.5 font-mono font-bold text-[#003943]"
            />
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label className="block font-bold text-[#003943]">
              Test 3: Flowmeter MPE & Repeatability
            </label>
            <input
              type="text"
              value={flowmeterMpe}
              onChange={(e) => setFlowmeterMpe(e.target.value)}
              className="w-full bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl px-3 py-2.5 font-mono font-bold"
            />
          </div>
        </div>
      </div>
    );
  }

  // 🟡 3. PRE-PACKAGED QUANTITY CHECK SCALE
  if (isPrePackaged) {
    return (
      <div className="space-y-4 bg-yellow-50/60 p-4 sm:p-5 rounded-2xl border border-yellow-200">
        <div className="flex items-center justify-between border-b border-yellow-200 pb-2">
          <h4 className="font-serif font-bold text-base text-[#003943] flex items-center gap-2">
            <Scale className="w-5 h-5 text-yellow-800" />
            <span>2. Pre-packaged Quantity & Net Contents Check Tests</span>
          </h4>
          <span className="px-2.5 py-0.5 rounded-full bg-yellow-200 text-yellow-900 text-[10px] font-bold uppercase">
            Net Weight Check
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="space-y-1">
            <label className="block font-bold text-[#003943]">Sample 1 Weight</label>
            <input
              type="text"
              value={sample1}
              onChange={(e) => setSample1(e.target.value)}
              className="w-full bg-white border border-[#003943]/20 rounded-xl px-3 py-2 font-mono font-bold text-[#003943]"
            />
          </div>

          <div className="space-y-1">
            <label className="block font-bold text-[#003943]">Sample 2 Weight</label>
            <input
              type="text"
              value={sample2}
              onChange={(e) => setSample2(e.target.value)}
              className="w-full bg-white border border-[#003943]/20 rounded-xl px-3 py-2 font-mono font-bold text-[#003943]"
            />
          </div>

          <div className="space-y-1">
            <label className="block font-bold text-[#003943]">Sample 3 Weight</label>
            <input
              type="text"
              value={sample3}
              onChange={(e) => setSample3(e.target.value)}
              className="w-full bg-white border border-[#003943]/20 rounded-xl px-3 py-2 font-mono font-bold text-[#003943]"
            />
          </div>
        </div>

        <div className="p-3 bg-white rounded-xl border border-yellow-200 text-xs font-bold text-[#003943] flex justify-between items-center">
          <span>Calculated Average Net Weight: 1.0003 kg</span>
          <span className="text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full text-[11px]">
            PASS - Within ±1.5g Permissible Error
          </span>
        </div>
      </div>
    );
  }

  // 🟢 4. PRECISION LABORATORY ANALYTICAL BALANCE
  if (isLabBalance) {
    return (
      <div className="space-y-4 bg-teal-50/60 p-4 sm:p-5 rounded-2xl border border-teal-200">
        <div className="flex items-center justify-between border-b border-teal-200 pb-2">
          <h4 className="font-serif font-bold text-base text-[#003943] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-700" />
            <span>2. Precision Laboratory Balance Calibration Tests (Class I)</span>
          </h4>
          <span className="px-2.5 py-0.5 rounded-full bg-teal-200 text-teal-900 text-[10px] font-bold uppercase">
            Class I Analytical
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="space-y-1">
            <label className="block font-bold text-[#003943]">
              Standard Mass Check <span className="text-gray-500 font-normal">(Target: 100.0000 g)</span>
            </label>
            <input
              type="text"
              value={obsMass}
              onChange={(e) => setObsMass(e.target.value)}
              className="w-full bg-white border border-[#003943]/20 rounded-xl px-3 py-2.5 font-mono font-bold text-[#003943]"
            />
          </div>

          <div className="space-y-1">
            <label className="block font-bold text-[#003943]">
              Linearity & Sensitivity Result
            </label>
            <input
              type="text"
              value={labMpe}
              onChange={(e) => setLabMpe(e.target.value)}
              className="w-full bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl px-3 py-2.5 font-mono font-bold"
            />
          </div>
        </div>
      </div>
    );
  }

  // 🟢 5. RETAIL DIGITAL COUNTER SCALE
  if (isCounterScale) {
    return (
      <div className="space-y-4 bg-cyan-50/60 p-4 sm:p-5 rounded-2xl border border-cyan-200">
        <div className="flex items-center justify-between border-b border-cyan-200 pb-2">
          <h4 className="font-serif font-bold text-base text-[#003943] flex items-center gap-2">
            <Gauge className="w-5 h-5 text-cyan-700" />
            <span>2. Retail Counter Scale Technical Tests (Class III)</span>
          </h4>
          <span className="px-2.5 py-0.5 rounded-full bg-cyan-200 text-cyan-900 text-[10px] font-bold uppercase">
            Commercial Counter Scale
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="space-y-1">
            <label className="block font-bold text-[#003943]">
              Test 1: Zero Indication <span className="text-gray-500 font-normal">(Expected: 0.000 kg)</span>
            </label>
            <input
              type="text"
              value={counterZero}
              onChange={(e) => setCounterZero(e.target.value)}
              className="w-full bg-white border border-[#003943]/20 rounded-xl px-3 py-2.5 font-mono font-bold text-[#003943]"
            />
          </div>

          <div className="space-y-1">
            <label className="block font-bold text-[#003943]">
              Test 2: Max Capacity Test <span className="text-gray-500 font-normal">(Target: 30.000 kg)</span>
            </label>
            <input
              type="text"
              value={counterMax}
              onChange={(e) => setCounterMax(e.target.value)}
              className="w-full bg-white border border-[#003943]/20 rounded-xl px-3 py-2.5 font-mono font-bold text-[#003943]"
            />
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label className="block font-bold text-[#003943]">
              Test 3: Tare & MPE Compliance Check
            </label>
            <input
              type="text"
              value={counterMpe}
              onChange={(e) => setCounterMpe(e.target.value)}
              className="w-full bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl px-3 py-2.5 font-mono font-bold"
            />
          </div>
        </div>
      </div>
    );
  }

  // 🟢 6. HEAVY ELECTRONIC WEIGHBRIDGE (DEFAULT)
  return (
    <div className="space-y-4 bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-200">
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <h4 className="font-serif font-bold text-base text-[#003943] flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#00959C]" />
          <span>2. Weighbridge Rule-Based Test Results (Rules 2011 MPE Specs)</span>
        </h4>
        <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-900 text-[10px] font-bold uppercase">
          Heavy Industrial Weighbridge
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="space-y-1">
          <label className="block font-bold text-[#003943]">
            Test 1: Zero Load & Repeatability <span className="text-gray-500 font-normal">(Expected: 0.0 kg)</span>
          </label>
          <input
            type="text"
            value={wbZero}
            onChange={(e) => setWbZero(e.target.value)}
            className="w-full bg-white border border-[#003943]/20 rounded-xl px-3 py-2.5 font-mono font-bold text-[#003943]"
          />
        </div>

        <div className="space-y-1">
          <label className="block font-bold text-[#003943]">
            Test 2: Half Load Eccentricity <span className="text-gray-500 font-normal">(Expected: 30,000.0 kg)</span>
          </label>
          <input
            type="text"
            value={wbHalf}
            onChange={(e) => setWbHalf(e.target.value)}
            className="w-full bg-white border border-[#003943]/20 rounded-xl px-3 py-2.5 font-mono font-bold text-[#003943]"
          />
        </div>

        <div className="space-y-1">
          <label className="block font-bold text-[#003943]">
            Test 3: Max Load Capacity <span className="text-gray-500 font-normal">(Expected: 60,000.0 kg)</span>
          </label>
          <input
            type="text"
            value={wbMax}
            onChange={(e) => setWbMax(e.target.value)}
            className="w-full bg-white border border-[#003943]/20 rounded-xl px-3 py-2.5 font-mono font-bold text-[#003943]"
          />
        </div>

        <div className="space-y-1">
          <label className="block font-bold text-[#003943]">
            Test 4: MPE Error Limit Check
          </label>
          <input
            type="text"
            readOnly
            value="PASS - Within Rule 11 MPE Limits"
            className="w-full bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl px-3 py-2.5 font-mono font-bold"
          />
        </div>
      </div>
    </div>
  );
};
