import React, { useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from '../../firebase';

import StorageHeader from './StorageHeader';
import SearchSection from './SearchSection';
import BasketsSection from './BasketsSection';
import BasketDetailView from './BasketDetailView';
import AllItemsSection from './AllItemsSection';

import BasketModal from './BasketModal';
import ItemModal from './ItemModal';
import DeleteConfirmModal from './DeleteConfirmModal';

export default function StorageManager({ onNavigateToGame }) {
  const [baskets, setBaskets] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tab & View States: 'search' | 'baskets' | 'items' | 'basket_detail'
  const [activeTab, setActiveTab] = useState('search');
  const [selectedBasketForDetail, setSelectedBasketForDetail] = useState(null);

  // Modals state
  const [isBasketModalOpen, setIsBasketModalOpen] = useState(false);
  const [basketToEdit, setBasketToEdit] = useState(null);

  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [defaultBasketIdForItem, setDefaultBasketIdForItem] = useState('');
  const [initialItemName, setInitialItemName] = useState('');

  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    type: 'item', // 'basket' | 'item'
    target: null,
    itemCount: 0
  });

  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3200);
  };

  // ปรับคลาส body ให้สามารถ scroll และพิมพ์ข้อความได้สะดวก
  useEffect(() => {
    document.body.classList.add('storage-mode');
    document.documentElement.classList.add('storage-mode');

    return () => {
      document.body.classList.remove('storage-mode');
      document.documentElement.classList.remove('storage-mode');
    };
  }, []);

  // Real-time Firestore Subscriptions
  useEffect(() => {
    if (!db) return;

    // 1. ตะกร้าเก็บของ (storage_baskets)
    const unsubBaskets = onSnapshot(
      collection(db, 'storage_baskets'),
      (snapshot) => {
        const loadedBaskets = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data()
        }));
        setBaskets(loadedBaskets);
      },
      (error) => {
        console.error('Firestore storage_baskets error:', error);
      }
    );

    // 2. สิ่งของในตะกร้า (storage_items)
    const unsubItems = onSnapshot(
      collection(db, 'storage_items'),
      (snapshot) => {
        const loadedItems = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data()
        }));
        setItems(loadedItems);
        setLoading(false);
      },
      (error) => {
        console.error('Firestore storage_items error:', error);
        setLoading(false);
      }
    );

    return () => {
      unsubBaskets();
      unsubItems();
    };
  }, []);

  // อัปเดต selectedBasketForDetail ให้ข้อมูลสดใหม่อยู่เสมอ
  useEffect(() => {
    if (selectedBasketForDetail) {
      const fresh = baskets.find((b) => b.id === selectedBasketForDetail.id);
      if (fresh) {
        setSelectedBasketForDetail(fresh);
      }
    }
  }, [baskets]);

  // =================== BASKET ACTIONS ===================
  const handleOpenAddBasket = () => {
    setBasketToEdit(null);
    setIsBasketModalOpen(true);
  };

  const handleEditBasket = (basket) => {
    setBasketToEdit(basket);
    setIsBasketModalOpen(true);
  };

  const handleSaveBasket = async (basketData) => {
    try {
      if (basketToEdit) {
        // แก้ไขตะกร้าเดิม
        await updateDoc(doc(db, 'storage_baskets', basketToEdit.id), {
          ...basketData,
          updatedAt: serverTimestamp()
        });

        // อัปเดตเลขตะกร้าหรือชื่อตะกร้าที่แคชไว้ใน items ที่เกี่ยวข้อง
        if (
          basketToEdit.basketNumber !== basketData.basketNumber ||
          basketToEdit.name !== basketData.name
        ) {
          const itemsToUpdate = items.filter((it) => it.basketId === basketToEdit.id);
          if (itemsToUpdate.length > 0) {
            const batch = writeBatch(db);
            itemsToUpdate.forEach((it) => {
              batch.update(doc(db, 'storage_items', it.id), {
                basketNumber: basketData.basketNumber,
                basketName: basketData.name
              });
            });
            await batch.commit();
          }
        }
        showToast(`แก้ไขข้อมูลตะกร้า #${basketData.basketNumber} เรียบร้อย`);
      } else {
        // เพิ่มตะกร้าใหม่
        await addDoc(collection(db, 'storage_baskets'), {
          ...basketData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        showToast(`สร้างตะกร้า #${basketData.basketNumber} สำเร็จแล้ว`);
      }
      setIsBasketModalOpen(false);
    } catch (err) {
      console.error('Save basket error:', err);
      alert('เกิดข้อผิดพลาดในการบันทึกตะกร้า: ' + err.message);
    }
  };

  const handleDeleteBasketClick = (basket, itemCount) => {
    setDeleteConfirm({
      isOpen: true,
      type: 'basket',
      target: basket,
      itemCount
    });
  };

  const confirmDeleteBasket = async () => {
    const basket = deleteConfirm.target;
    if (!basket) return;

    try {
      const batch = writeBatch(db);

      // 1. ลบตะกร้า
      batch.delete(doc(db, 'storage_baskets', basket.id));

      // 2. ลบสิ่งของทั้งหมดที่อยู่ในตะกร้านี้ด้วย
      const basketItems = items.filter((it) => it.basketId === basket.id);
      basketItems.forEach((it) => {
        batch.delete(doc(db, 'storage_items', it.id));
      });

      await batch.commit();

      if (selectedBasketForDetail?.id === basket.id) {
        setSelectedBasketForDetail(null);
        setActiveTab('baskets');
      }

      showToast(`ลบตะกร้า #${basket.basketNumber} และสิ่งของข้างในเรียบร้อย`);
    } catch (err) {
      console.error('Delete basket error:', err);
      alert('เกิดข้อผิดพลาดในการลบตะกร้า: ' + err.message);
    } finally {
      setDeleteConfirm({ isOpen: false, type: 'basket', target: null, itemCount: 0 });
    }
  };

  // =================== ITEM ACTIONS ===================
  const handleOpenAddItem = (nameSuggestion = '') => {
    setItemToEdit(null);
    setInitialItemName(nameSuggestion);
    setDefaultBasketIdForItem(selectedBasketForDetail?.id || (baskets[0]?.id || ''));
    setIsItemModalOpen(true);
  };

  const handleOpenAddItemInBasket = (basketId) => {
    setItemToEdit(null);
    setInitialItemName('');
    setDefaultBasketIdForItem(basketId);
    setIsItemModalOpen(true);
  };

  const handleEditItem = (item) => {
    setItemToEdit(item);
    setIsItemModalOpen(true);
  };

  const handleSaveSingleItem = async (itemData) => {
    try {
      if (itemToEdit) {
        // แก้ไขสิ่งของเดิม
        await updateDoc(doc(db, 'storage_items', itemToEdit.id), {
          ...itemData,
          updatedAt: serverTimestamp()
        });
        showToast(`แก้ไข "${itemData.name}" เรียบร้อยแล้ว`);
      } else {
        // เพิ่มสิ่งของใหม่
        await addDoc(collection(db, 'storage_items'), {
          ...itemData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        showToast(`เพิ่ม "${itemData.name}" ลงในตะกร้า #${itemData.basketNumber} เรียบร้อยแล้ว`);
      }
      setIsItemModalOpen(false);
    } catch (err) {
      console.error('Save item error:', err);
      alert('เกิดข้อผิดพลาดในการบันทึกสิ่งของ: ' + err.message);
    }
  };

  const handleSaveBatchItems = async (itemsToAdd) => {
    try {
      const batch = writeBatch(db);
      itemsToAdd.forEach((it) => {
        const newDocRef = doc(collection(db, 'storage_items'));
        batch.set(newDocRef, {
          ...it,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      });
      await batch.commit();
      showToast(`เพิ่มสิ่งของ ${itemsToAdd.length} รายการลงในตะกร้าเรียบร้อยแล้ว!`);
      setIsItemModalOpen(false);
    } catch (err) {
      console.error('Save batch items error:', err);
      alert('เกิดข้อผิดพลาดในการบันทึกรายการหลายชิ้น: ' + err.message);
    }
  };

  const handleDeleteItemClick = (item) => {
    setDeleteConfirm({
      isOpen: true,
      type: 'item',
      target: item,
      itemCount: 0
    });
  };

  const confirmDeleteItem = async () => {
    const item = deleteConfirm.target;
    if (!item) return;

    try {
      await deleteDoc(doc(db, 'storage_items', item.id));
      showToast(`ลบ "${item.name}" เรียบร้อย`);
    } catch (err) {
      console.error('Delete item error:', err);
      alert('เกิดข้อผิดพลาดในการลบ: ' + err.message);
    } finally {
      setDeleteConfirm({ isOpen: false, type: 'item', target: null, itemCount: 0 });
    }
  };

  // ดูรายละเอียดตะกร้า
  const handleSelectBasket = (basket) => {
    setSelectedBasketForDetail(basket);
    setActiveTab('basket_detail');
  };

  // โหลดชุดข้อมูลตัวอย่าง (Demo Data)
  const handleSeedDemoData = async () => {
    try {
      const demoBaskets = [
        {
          basketNumber: '1',
          name: 'อุปกรณ์ไอที & สายไฟ',
          location: 'ชั้นวางของข้างทีวี ชั้น 1',
          color: '#3b82f6',
          icon: '🔌',
          description: 'สายชาร์จ, อะแดปเตอร์, หัวแปลง, แฟลชไดรฟ์'
        },
        {
          basketNumber: '2',
          name: 'ยาสามัญ & อุปกรณ์ทำแผล',
          location: 'ตู้ยาในห้องครัว ชั้น 1',
          color: '#ef4444',
          icon: '💊',
          description: 'ยาสามัญประจำบ้าน, พลาสเตอร์ยา, ผ้าก๊อซ, เบตาดีน'
        },
        {
          basketNumber: '3',
          name: 'เครื่องมือช่าง & เครื่องเขียน',
          location: 'โต๊ะทำงาน ชั้น 2',
          color: '#f59e0b',
          icon: '🛠️',
          description: 'คัตเตอร์, กรรไกร, เทปกาว 2 หน้า, ไขควงอเนกประสงค์'
        }
      ];

      const batch = writeBatch(db);
      const createdBasketRefs = [];

      // 1. เพิ่ม 3 ตะกร้า
      for (const b of demoBaskets) {
        const ref = doc(collection(db, 'storage_baskets'));
        batch.set(ref, {
          ...b,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        createdBasketRefs.push({ id: ref.id, ...b });
      }

      // 2. เพิ่มสิ่งของตัวอย่างในแต่ละตะกร้า
      const sampleItems = [
        // Basket 1
        { name: 'สายชาร์จ Type-C to Type-C 2m', basketIndex: 0, quantity: 2, unit: 'เส้น', category: 'it', note: 'สายถักสีดำ Ugreen' },
        { name: 'หัวชาร์จเร็ว GaN 65W', basketIndex: 0, quantity: 1, unit: 'ตัว', category: 'it', note: 'มีพอร์ต 2C 1A' },
        { name: 'สายชาร์จ iPhone (Lightning)', basketIndex: 0, quantity: 3, unit: 'เส้น', category: 'it', note: 'สีขาว' },
        { name: 'แฟลชไดรฟ์ Kingston 64GB', basketIndex: 0, quantity: 2, unit: 'อัน', category: 'it', note: 'สีเงิน' },
        { name: 'ปลั๊กแปลงขา 3 ตา (Universal)', basketIndex: 0, quantity: 1, unit: 'ตัว', category: 'it', note: 'สำหรับเดินทาง' },

        // Basket 2
        { name: 'พาราเซตามอล 500mg', basketIndex: 1, quantity: 3, unit: 'แผง', category: 'medicine', note: 'แก้ปวดลดไข้ หมดอายุ 2028' },
        { name: 'พลาสเตอร์ยาปิดแผลกันน้ำ', basketIndex: 1, quantity: 1, unit: 'กล่อง', category: 'medicine', note: 'กล่องมี 20 แผ่น' },
        { name: 'น้ำเกลือล้างแผล 500ml', basketIndex: 1, quantity: 1, unit: 'ขวด', category: 'medicine', note: 'ขวดใสฝาสีเขียว' },
        { name: 'ยาแก้แพ้ เม็ดสีเหลือง', basketIndex: 1, quantity: 2, unit: 'แผง', category: 'medicine', note: 'คลอเฟนิรามีน 4mg' },
        { name: 'เบตาดีน โพวิโดนไอโอดีน', basketIndex: 1, quantity: 1, unit: 'ขวด', category: 'medicine', note: 'ใส่แผลสด' },

        // Basket 3
        { name: 'กรรไกรสแตนเลส 8 นิ้ว', basketIndex: 2, quantity: 1, unit: 'อัน', category: 'stationery', note: 'ด้ามจับสีดำ' },
        { name: 'คัตเตอร์พร้อมใบมีดสำรอง', basketIndex: 2, quantity: 1, unit: 'ชุด', category: 'stationery', note: 'ขนาด 18mm' },
        { name: 'เทปกาวสองหน้า 3M แรงยึดสูง', basketIndex: 2, quantity: 2, unit: 'ม้วน', category: 'stationery', note: 'เนื้อโฟมสีเทา' },
        { name: 'ชุดไขควงสลับหัว 24 in 1', basketIndex: 2, quantity: 1, unit: 'ชุด', category: 'tools', note: 'กล่องแม่เหล็กสีเทา' },
        { name: 'ตลับเมตร 3 เมตร', basketIndex: 2, quantity: 1, unit: 'อัน', category: 'tools', note: 'สีส้มแถบดำ' },
      ];

      for (const item of sampleItems) {
        const b = createdBasketRefs[item.basketIndex];
        const itemRef = doc(collection(db, 'storage_items'));
        batch.set(itemRef, {
          name: item.name,
          basketId: b.id,
          basketNumber: b.basketNumber,
          basketName: b.name,
          quantity: item.quantity,
          unit: item.unit,
          note: item.note,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }

      await batch.commit();
      showToast('โหลดตัวอย่าง 3 ตะกร้าและสิ่งของ 15 รายการเรียบร้อยแล้ว!');
    } catch (err) {
      console.error('Seed demo data error:', err);
      alert('เกิดข้อผิดพลาดในการโหลดตัวอย่าง: ' + err.message);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0b0f19',
      color: '#ffffff',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: '#10b981',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: '12px',
          fontSize: '14px',
          fontWeight: 'bold',
          boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.5)',
          zIndex: 11000,
          animation: 'slideUp 0.25s ease'
        }}>
          ✨ {toastMessage}
        </div>
      )}

      {/* Main Header */}
      <StorageHeader
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setSelectedBasketForDetail(null);
          setActiveTab(tab);
        }}
        basketsCount={baskets.length}
        itemsCount={items.length}
        onOpenAddBasket={handleOpenAddBasket}
        onOpenAddItem={() => handleOpenAddItem()}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1, paddingBottom: '60px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: '#9ca3af' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>⏳</div>
            <p style={{ margin: 0, fontSize: '16px' }}>กำลังโหลดข้อมูลตะกร้าและสิ่งของจากฐานข้อมูล...</p>
          </div>
        ) : (
          <>
            {/* View 1: Search View */}
            {activeTab === 'search' && (
              <SearchSection
                items={items}
                baskets={baskets}
                onOpenAddItem={handleOpenAddItem}
                onEditItem={handleEditItem}
                onDeleteItem={handleDeleteItemClick}
                onSelectBasket={handleSelectBasket}
              />
            )}

            {/* View 2: All Baskets View */}
            {activeTab === 'baskets' && (
              <BasketsSection
                baskets={baskets}
                items={items}
                onOpenAddBasket={handleOpenAddBasket}
                onOpenAddItemInBasket={handleOpenAddItemInBasket}
                onEditBasket={handleEditBasket}
                onDeleteBasket={handleDeleteBasketClick}
                onSelectBasket={handleSelectBasket}
              />
            )}

            {/* View 3: Basket Detail View */}
            {activeTab === 'basket_detail' && selectedBasketForDetail && (
              <BasketDetailView
                basket={selectedBasketForDetail}
                items={items}
                onBack={() => {
                  setSelectedBasketForDetail(null);
                  setActiveTab('baskets');
                }}
                onOpenAddItemInBasket={handleOpenAddItemInBasket}
                onEditBasket={handleEditBasket}
                onDeleteBasket={handleDeleteBasketClick}
                onEditItem={handleEditItem}
                onDeleteItem={handleDeleteItemClick}
              />
            )}

            {/* View 4: All Items Catalog View */}
            {activeTab === 'items' && (
              <AllItemsSection
                items={items}
                baskets={baskets}
                onOpenAddItem={() => handleOpenAddItem()}
                onEditItem={handleEditItem}
                onDeleteItem={handleDeleteItemClick}
                onSelectBasket={handleSelectBasket}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#070a12',
        borderTop: '1px solid #1f2937',
        padding: '16px 20px',
        textAlign: 'center',
        fontSize: '13px',
        color: '#6b7280'
      }}>
        🧺 ระบบค้นหาและจัดระเบียบตะกร้าเก็บของ • เชื่อมต่อฐานข้อมูล Firestore (Tower Defense Database)
      </footer>

      {/* Modals */}
      <BasketModal
        isOpen={isBasketModalOpen}
        onClose={() => setIsBasketModalOpen(false)}
        onSave={handleSaveBasket}
        basketToEdit={basketToEdit}
        existingBaskets={baskets}
      />

      <ItemModal
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        onSaveSingle={handleSaveSingleItem}
        onSaveBatch={handleSaveBatchItems}
        itemToEdit={itemToEdit}
        baskets={baskets}
        defaultBasketId={defaultBasketIdForItem}
        initialName={initialItemName}
      />

      <DeleteConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, type: 'item', target: null, itemCount: 0 })}
        onConfirm={deleteConfirm.type === 'basket' ? confirmDeleteBasket : confirmDeleteItem}
        targetType={deleteConfirm.type}
        targetName={
          deleteConfirm.type === 'basket'
            ? `ตะกร้า #${deleteConfirm.target?.basketNumber} (${deleteConfirm.target?.name})`
            : deleteConfirm.target?.name
        }
        itemCount={deleteConfirm.itemCount}
      />
    </div>
  );
}
