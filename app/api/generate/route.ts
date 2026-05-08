'use client';
import { useState } from 'react';

const DENIAL_TEMPLATES: Record<string, { deniedItems: string; denialReason: string }> = {
  '': { deniedItems: '', denialReason: '' },
  'aftermarket_parts': {
    deniedItems: 'Insurer denied OEM parts and authorized aftermarket/non-OEM replacements instead',
    denialReason: 'Insurer states aftermarket parts meet OEM specifications and are sufficient for repair',
  },
  'labor_rate': {
    deniedItems: 'Insurer reduced our posted labor rate without justification or contract',
    denialReason: 'Insurer states our labor rate exceeds their "prevailing market rate" without providing supporting data',
  },
  'not_related': {
    deniedItems: 'Insurer denied certain repair line items claiming damage is not related to the loss',
    denialReason: 'Insurer states the denied damage was pre-existing or not caused by the reported incident',
  },
  'betterment': {
    deniedItems: 'Insurer applied betterment deductions to parts and materials without justification',
    denialReason: 'Insurer claims betterment applies due to vehicle age and prior wear on replaced components',
  },
  'labor_hours': {
    deniedItems: 'Insurer reduced approved labor hours below what is required per OEM repair procedures',
    denialReason: 'Insurer states labor time exceeds their estimating system guidelines',
  },
  'storage_fees': {
    deniedItems: 'Insurer refused to pay accrued storage fees during claim processing delays',
    denialReason: 'Insurer states storage fees are excessive or were not pre-authorized',
  },
  'sublet_repairs': {
    deniedItems: 'Insurer denied sublet repair charges for specialized work (e.g. alignment, glass, ADAS calibration)',
    denialReason: 'Insurer states sublet operations are included in labor rate or not necessary',
  },
};

export default function Home() {
  const [form, setForm] = useState({
    shopName: '', shopAddress: '', adjusterName: '', insurerName: '',
    claimNumber: '', vehicleYear: '', vehicleMake: '', vehicleModel: '',
    dateOfLoss: '', laborHours: '', disputedAmount: '',
    repairsPerformed: '', deniedItems: '', denialReason: '',
  });
  const [letter, setLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTemplateSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const key = e.target.value;
    setSelectedTemplate(key);
    if (DENIAL_TEMPLATES[key]) {
      setForm(prev => ({
        ...prev,
        deniedItems: DENIAL_TEMPLATES[key].deniedItems,
        denialReason: DENIAL_TEMPLATES[key].denialReason,
      }));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setLetter('');
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLetter(data.letter);
    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const inputStyle = {
    width: '100%',
    padding: '9px 12px',
    border: '1px solid #333',
    borderRadius: 6,
    fontSize: 14,
    boxSizing: 'border-box' as const,
    background: '#1a1a1a',
    color: '#f0f0f0',
    outline: 'none',
  };

  const labelStyle = {
    fontSize: 12,
    fontWeight: 500,
    display: 'block',
    marginBottom: 5,
    color: '#888',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  };

  const topFields = [
    { name: 'shopName', label: 'Shop Name' },
    { name: 'shopAddress', label: 'Shop Address' },
    { name: 'adjusterName', label: 'Adjuster Name' },
    { name: 'insurerName', label: 'Insurance Company' },
    { name: 'claimNumber', label: 'Claim Number' },
    { name: 'dateOfLoss', label: 'Date of Loss' },
    { name: 'vehicleYear', label: 'Vehicle Year' },
    { name: 'vehicleMake', label: 'Vehicle Make' },
    { name: 'vehicleModel', label: 'Vehicle Model' },
    { name: 'laborHours', label: 'Total Labor Hours' },
    { name: 'disputedAmount', label: 'Disputed Amount ($)' },
  ];

  return (
    <main style={{ maxWidth: 740, margin: '0 auto', padding: '48px 24px', fontFamily: 'system-ui, sans-serif', background: '#0d0d0d', minHeight: '100vh', color: '#f0f0f0' }}>

      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 30, fontWeight: 700, margin: '0 0 6px', letterSpacing: '-0.02em' }}>Rebuttal</h1>
        <p style={{ color: '#666', margin: 0, fontSize: 15 }}>Generate professional insurance dispute letters in seconds.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        {topFields.map(f => (
          <div key={f.name}>
            <label style={labelStyle}>{f.label}</label>
            <input
              name={f.name}
              value={(form as any)[f.name]}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>Repairs Performed</label>
        <textarea name="repairsPerformed" value={form.repairsPerformed} onChange={handleChange} rows={3}
          placeholder="e.g. Replaced front bumper, repainted hood, aligned frame..."
          style={{ ...inputStyle, resize: 'vertical' }} />
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>Denial Type — select to auto-fill</label>
        <select value={selectedTemplate} onChange={handleTemplateSelect}
          style={{ ...inputStyle }}>
          <option value="">— Select a denial type —</option>
          <option value="aftermarket_parts">Aftermarket / Non-OEM Parts</option>
          <option value="labor_rate">Labor Rate Reduction</option>
          <option value="not_related">Damage Not Related to Loss</option>
          <option value="betterment">Betterment Deductions</option>
          <option value="labor_hours">Labor Hours Reduction</option>
          <option value="storage_fees">Storage Fee Denial</option>
          <option value="sublet_repairs">Sublet Repair Denial</option>
        </select>
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>Denied / Underpaid Items</label>
        <textarea name="deniedItems" value={form.deniedItems} onChange={handleChange} rows={3}
          placeholder="e.g. Insurer denied OEM bumper, reduced labor rate from $75 to $52/hr..."
          style={{ ...inputStyle, resize: 'vertical' }} />
      </div>

      <div style={{ marginBottom: 28 }}>
        <label style={labelStyle}>Denial Reason Given</label>
        <textarea name="denialReason" value={form.denialReason} onChange={handleChange} rows={2}
          placeholder="e.g. Insurer states aftermarket parts meet OEM specs..."
          style={{ ...inputStyle, resize: 'vertical' }} />
      </div>

      <p style={{ fontSize: 12, color: '#555', marginBottom: 16, lineHeight: 1.6 }}>
        This tool generates draft dispute letters for review purposes. Always verify compliance with your provincial or state insurance regulations before sending. Not legal advice.
      </p>

      <button onClick={handleSubmit} disabled={loading}
        style={{
          background: loading ? '#333' : '#fff',
          color: loading ? '#666' : '#000',
          border: 'none',
          padding: '12px 28px',
          borderRadius: 6,
          fontSize: 15,
          fontWeight: 600,
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'all 0.15s',
        }}>
        {loading ? 'Generating...' : 'Generate Dispute Letter'}
      </button>

      {letter && (
        <div style={{ marginTop: 48 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Dispute Letter</h2>
            <button onClick={copyToClipboard}
              style={{
                background: copied ? '#1a3a1a' : 'none',
                border: `1px solid ${copied ? '#2d6a2d' : '#333'}`,
                color: copied ? '#4caf50' : '#aaa',
                padding: '6px 16px',
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: 13,
                transition: 'all 0.2s',
              }}>
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <pre style={{
            background: '#111',
            border: '1px solid #222',
            borderRadius: 8,
            padding: '28px 32px',
            fontSize: 14,
            lineHeight: 1.8,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            color: '#e0e0e0',
            fontFamily: 'Georgia, serif',
          }}>
            {letter}
          </pre>
        </div>
      )}
    </main>
  );
}