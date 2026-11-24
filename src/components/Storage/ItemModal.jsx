import React, { useState, useEffect } from 'react';
import { X, Check, Plus, Layers } from 'lucide-react';
import { COMMON_UNITS } from './constants';

export default function ItemModal({
  isOpen,
  onClose,
  onSaveSingle,
  onSaveBatch,
  itemToEdit = null,
  baskets = [],
  defaultBasketId = '',
  initialName = ''
}) {
  const [activeTab, setActiveTab] = useState('single'); // 'single' | 'batch'

  // Single Item Form State
  const [name, setName] = useState('');
  const [basketId, setBasketId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('ชิ้น');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  // Batch Add Form State
  const [batchText, setBatchText] = useState('');
  const [batchBasketId, setBatchBasketId] = useState('');
  const [batchUnit, setBatchUnit] = useState('ชิ้น');

  useEffect(() => {
    if (!isOpen) return;

    if (itemToEdit) {
      setActiveTab('single');
      setName(itemToEdit.name || '');
      setBasketId(itemToEdit.basketId || (baskets[0]?.id || ''));
      setQuantity(itemToEdit.quantity || 1);
      setUnit(itemToEdit.unit || 'ชิ้น');
      setNote(itemToEdit.note || '');
      setError('');
    } else {
      setName(initialName || '');
      const initialBasket = defaultBasketId || (baskets[0]?.id || '');
      setBasketId(initialBasket);
      setBatchBasketId(initialBasket);
      setQuantity(1);
      setUnit('ชิ้น');
      setNote('');
      setBatchText('');
      setError('');
    }
  }, [isOpen, itemToEdit, baskets, defaultBasketId, initialName]);

  if (!isOpen) return null;

  const handleSingleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('กรุณาพิมพ์ชื่อสิ่งของ');
      return;
    }
    if (!basketId) {
      setError('กรุณาเลือกตะกร้าสำหรับเก็บของชิ้นนี้');
      return;
    }

    const selectedBasket = baskets.find((b) => b.id === basketId);
    onSaveSingle({
      name: name.trim(),
      basketId,
      basketNumber: selectedBasket ? selectedBasket.basketNumber : '?',
      basketName: selectedBasket ? selectedBasket.name : '',
      quantity: Number(quantity) || 1,
      unit: unit.trim() || 'ชิ้น',
      note: ''
    });
  };

  const handleBatchSubmit = (e) => {
    e.preventDefault();
    if (!batchBasketId) {
      setError('กรุณาเลือกตะกร้าปลายทาง');
      return;
    }

    const lines = batchText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length === 0) {
      setError('กรุณาพิมพ์ชื่อของอย่างน้อย 1 อย่าง (บรรทัดละ 1 ชื่อ)');
      return;
    }

    const selectedBasket = baskets.find((b) => b.id === batchBasketId);
    const itemsToAdd = lines.map((line) => {
      return {
        name: line,
        basketId: batchBasketId,
        basketNumber: selectedBasket ? selectedBasket.basketNumber : '?',
        basketName: selectedBasket ? selectedBasket.name : '',
        quantity: 1,
        unit: batchUnit || 'ชิ้น',
        note: ''
      };
    });

    onSaveBatch(itemsToAdd);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      zIndex: 9999
    }}>
      <div style={{
        backgroundColor: '#111827',
        border: '2px solid #374151',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '540px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        color: '#f3f4f6'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 24px',
          borderBottom: '2px solid #1f2937'
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold', color: '#fff' }}>
              {itemToEdit ? '✏️ แก้ไขข้อมูลสิ่งของ' : '📦 เพิ่มของลงตะกร้า'}
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#9ca3af' }}>
              กรอกชื่อง่ายๆ แล้วเลือกตะกร้าที่นำไปเก็บ
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#9ca3af',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '8px',
              display: 'flex'
            }}
          >
            <X size={26} />
          </button>
        </div>

        {/* Tab Switcher (ตอนสร้างใหม่) */}
        {!itemToEdit && (
          <div style={{
            display: 'flex',
            backgroundColor: '#1f2937',
            padding: '6px',
            margin: '16px 24px 0 24px',
            borderRadius: '12px'
          }}>
            <button
              type="button"
              onClick={() => setActiveTab('single')}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: activeTab === 'single' ? '#3b82f6' : 'transparent',
                color: activeTab === 'single' ? '#fff' : '#9ca3af',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Plus size={18} />
              เพิ่มทีละอย่าง
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('batch')}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: activeTab === 'batch' ? '#3b82f6' : 'transparent',
                color: activeTab === 'batch' ? '#fff' : '#9ca3af',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Layers size={18} />
              พิมพ์หลายอย่างพร้อมกัน
            </button>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div style={{
            margin: '16px 24px 0 24px',
            backgroundColor: 'rgba(239, 68, 68, 0.2)',
            border: '2px solid #ef4444',
            color: '#fca5a5',
            padding: '12px 16px',
            borderRadius: '10px',
            fontSize: '15px',
            fontWeight: 'bold'
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Form Body - Single Item */}
        {activeTab === 'single' ? (
          <form onSubmit={handleSingleSubmit} style={{ padding: '20px 24px', overflowY: 'auto' }}>
            {/* 1. ชื่อสิ่งของ */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: 'bold', color: '#e5e7eb', marginBottom: '8px' }}>
                1. ชื่อสิ่งของ <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="เช่น ยาพาราเซตามอล, แว่นตา, กรรไกร, สายชาร์จ"
                autoFocus
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  backgroundColor: '#1f2937',
                  border: '2px solid #4b5563',
                  borderRadius: '12px',
                  color: '#ffffff',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  boxSizing: 'border-box'
                }}
                required
              />
            </div>

            {/* 2. เลือกตะกร้า */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: 'bold', color: '#e5e7eb', marginBottom: '8px' }}>
                2. เก็บไว้ในตะกร้าเบอร์ไหน <span style={{ color: '#ef4444' }}>*</span>
              </label>
              {baskets.length === 0 ? (
                <div style={{ fontSize: '15px', color: '#f59e0b', padding: '8px 0', fontWeight: 'bold' }}>
                  ยังไม่มีตะกร้าในระบบ กรุณาสร้างตะกร้าก่อน
                </div>
              ) : (
                <select
                  value={basketId}
                  onChange={(e) => setBasketId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    backgroundColor: '#1f2937',
                    border: '2px solid #4b5563',
                    borderRadius: '12px',
                    color: '#ffffff',
                    fontSize: '17px',
                    fontWeight: 'bold',
                    boxSizing: 'border-box',
                    cursor: 'pointer'
                  }}
                  required
                >
                  {baskets.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.basketNumber}{b.name ? ` - ${b.name}` : ''}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* 3. จำนวน & หน่วยนับ */}
            <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '14px', marginBottom: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '15px', fontWeight: 'bold', color: '#9ca3af', marginBottom: '6px' }}>
                  จำนวน
                </label>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, Number(q) - 1))}
                    style={{
                      padding: '12px 16px',
                      backgroundColor: '#374151',
                      border: '2px solid #4b5563',
                      borderRight: 'none',
                      borderTopLeftRadius: '12px',
                      borderBottomLeftRadius: '12px',
                      color: '#ffffff',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    style={{
                      width: '60px',
                      padding: '12px 4px',
                      backgroundColor: '#1f2937',
                      border: '2px solid #4b5563',
                      color: '#ffffff',
                      fontSize: '17px',
                      fontWeight: 'bold',
                      textAlign: 'center'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Number(q) + 1)}
                    style={{
                      padding: '12px 16px',
                      backgroundColor: '#374151',
                      border: '2px solid #4b5563',
                      borderLeft: 'none',
                      borderTopRightRadius: '12px',
                      borderBottomRightRadius: '12px',
                      color: '#ffffff',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '15px', fontWeight: 'bold', color: '#9ca3af', marginBottom: '6px' }}>
                  หน่วยนับ
                </label>
                <input
                  type="text"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="เช่น ชิ้น, กล่อง, แผง"
                  style={{
                    width: '100%',
                    padding: '13px 14px',
                    backgroundColor: '#1f2937',
                    border: '2px solid #4b5563',
                    borderRadius: '12px',
                    color: '#ffffff',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* ปุ่มลัดหน่วยนับยอดนิยม */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '18px' }}>
              {COMMON_UNITS.map((u) => (
                <button
                  type="button"
                  key={u}
                  onClick={() => setUnit(u)}
                  style={{
                    padding: '6px 12px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    borderRadius: '8px',
                    border: unit === u ? '2px solid #3b82f6' : '1px solid #374151',
                    backgroundColor: unit === u ? 'rgba(59, 130, 246, 0.25)' : '#1f2937',
                    color: unit === u ? '#93c5fd' : '#9ca3af',
                    cursor: 'pointer'
                  }}
                >
                  {u}
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '12px 22px',
                  borderRadius: '12px',
                  border: '2px solid #4b5563',
                  backgroundColor: 'transparent',
                  color: '#d1d5db',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                disabled={baskets.length === 0}
                style={{
                  padding: '12px 28px',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: baskets.length === 0 ? '#4b5563' : '#3b82f6',
                  color: '#ffffff',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: baskets.length === 0 ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Check size={20} />
                {itemToEdit ? 'บันทึกการแก้ไข' : 'บันทึกลงตะกร้า'}
              </button>
            </div>
          </form>
        ) : (
          /* Form Body - Batch Multiple Items */
          <form onSubmit={handleBatchSubmit} style={{ padding: '20px 24px', overflowY: 'auto' }}>
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: 'bold', color: '#e5e7eb', marginBottom: '8px' }}>
                🧺 เลือกตะกร้าที่จะนำของไปใส่:
              </label>
              <select
                value={batchBasketId}
                onChange={(e) => setBatchBasketId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  backgroundColor: '#1f2937',
                  border: '2px solid #4b5563',
                  borderRadius: '12px',
                  color: '#ffffff',
                  fontSize: '17px',
                  fontWeight: 'bold',
                  boxSizing: 'border-box'
                }}
                required
              >
                {baskets.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.basketNumber}{b.name ? ` - ${b.name}` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: 'bold', color: '#e5e7eb', marginBottom: '8px' }}>
                รายชื่อสิ่งของ (พิมพ์แยกบรรทัดละ 1 อย่าง):
              </label>
              <textarea
                value={batchText}
                onChange={(e) => setBatchText(e.target.value)}
                placeholder={"สายชาร์จโทรศัพท์\nแว่นตาอ่านหนังสือ\nกรรไกรตัดเล็บ\nยาแก้ปวด"}
                rows={6}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  backgroundColor: '#1f2937',
                  border: '2px solid #4b5563',
                  borderRadius: '12px',
                  color: '#ffffff',
                  fontSize: '16px',
                  boxSizing: 'border-box',
                  lineHeight: '1.6'
                }}
                required
              />
              <span style={{ fontSize: '14px', color: '#93c5fd', display: 'block', marginTop: '6px', fontWeight: 'bold' }}>
                💡 มีทั้งหมด {batchText.split('\n').filter((l) => l.trim().length > 0).length} รายการ
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '12px 22px',
                  borderRadius: '12px',
                  border: '2px solid #4b5563',
                  backgroundColor: 'transparent',
                  color: '#d1d5db',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                style={{
                  padding: '12px 28px',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Check size={20} />
                บันทึกของทั้งหมดลงตะกร้า
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
