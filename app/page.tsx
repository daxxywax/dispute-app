'use client';
import { useState } from 'react';

export default function Home() {
  const [form, setForm] = useState({
    shopName: '', shopAddress: '', adjusterName: '', insurerName: '',
    claimNumber: '', vehicleYear: '', vehicleMake: '', vehicleModel: '',
    repairsPerformed: '', deniedItems: '', denialReason: '',
  });
  const [letter, setLetter] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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

  const copyToClipboard = () => navigator.clipboard.writeText(letter);

  const fields = [
    { name: 'shopName', label: 'Shop Name' },
    { name: 'shopAddress', label: 'Shop Address' },
    { name: 'adjusterName', label: 'Adjuster Name' },
    { name: 'insurerName', label: 'Insurance Company' },
    { name: 'claimNumber', label: 'Claim Number' },
    { name: 'vehicleYear', label: 'Vehicle Year' },
    { name: 'vehicleMake', label: 'Vehicle Make' },
    { name: 'vehicleModel', label: 'Vehicle Model' },
  ];

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '40px 24px', fontFamily: 'system-ui, sans-serif', background: '#0f0f0f', minHeight: '100vh', color: '#f0f0f0' }}>
      
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, margin: '0 0 6px', color: '#ffffff', letterSpacing: '-0.5px' }}>Rebuttal</h1>
        <p style={{ color: '#888', margin: 0, fontSize: 15 }}>Generate professional insurance dispute letters in seconds.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        {fields.map(f => (
          <div key={f.name}>
            <label style={{ fontSize: 12, fontWeight: 500, display: 'block', marginBottom: 6, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{f.label}</label>
            <input
              name={f.name}
              value={(form as any)[f.name]}
              onChange={handleChange}
              style={{ width: '100%', padding: '10px 12px', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8, fontSize: 14, boxSizing: 'border-box', color: '#f0f0f0', outline: 'none' }}
            />
          </div>
        ))}
      </div>

      {[
        { name: 'repairsPerformed', label: 'Repairs Performed', placeholder: 'e.g. Replaced front bumper, repainted hood, aligned frame...', rows: 3 },
        { name: 'deniedItems', label: 'Denied / Underpaid Items', placeholder: 'e.g. Insurer denied OEM bumper, reduced labor rate from $75 to $52/hr...', rows: 3 },
        { name: 'denialReason', label: 'Denial Reason Given', placeholder: 'e.g. Insurer states aftermarket parts meet OEM specs...', rows: 2 },
      ].map(f => (
        <div key={f.name} style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 12, fontWeight: 500, display: 'block', marginBottom: 6, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{f.label}</label>
          <textarea
            name={f.name}
            value={(form as any)[f.name]}
            onChange={handleChange}
            rows={f.rows}
            placeholder={f.placeholder}
            style={{ width: '100%', padding: '10px 12px', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8, fontSize: 14, boxSizing: 'border-box', color: '#f0f0f0', resize: 'vertical', outline: 'none', fontFamily: 'system-ui, sans-serif' }}
          />
        </div>
      ))}

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{ background: loading ? '#333' : '#ffffff', color: loading ? '#666' : '#000000', border: 'none', padding: '13px 32px', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', marginTop: 10, transition: 'all 0.15s' }}>
        {loading ? 'Generating...' : 'Generate Dispute Letter'}
      </button>

      {letter && (
        <div style={{ marginTop: 48 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0, color: '#ffffff' }}>Your Dispute Letter</h2>
            <button
              onClick={copyToClipboard}
              style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#ccc', padding: '7px 16px', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>
              Copy
            </button>
          </div>
          <pre style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 10, padding: 28, fontSize: 14, lineHeight: 1.8, whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: '#e0e0e0', margin: 0 }}>
            {letter}
          </pre>
        </div>
      )}
    </main>
  );
}