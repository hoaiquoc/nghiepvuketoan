/**
 * NghiepVu.js - Nghiệp vụ kế toán POS
 * Theo Thông tư 99/2025/TT-BTC
 * V3: Mỗi dòng SP có TK Nợ/Có inline, chọn nghiệp vụ là tự điền
 */

const STORE_KEY = 'nghiepvu_pos_data';

function getDefaultStore() {
    return {
        partners: [
            { id: 'pn001', name: 'Công ty TNHH POS Việt Nam', type: 'supplier' },
            { id: 'pn002', name: 'Công ty CP Bán lẻ ABC', type: 'customer' },
            { id: 'pn003', name: 'Công ty TNHH Thực phẩm XYZ', type: 'supplier' },
            { id: 'pn004', name: 'Nhà hàng F&B Express', type: 'customer' },
        ],
        accounts: [
            { id: '111', name: 'Tiền mặt', category: 'Tài sản' },
            { id: '112', name: 'Tiền gửi ngân hàng', category: 'Tài sản' },
            { id: '131', name: 'Phải thu của khách hàng', category: 'Tài sản' },
            { id: '133', name: 'Thuế GTGT được khấu trừ', category: 'Tài sản' },
            { id: '141', name: 'Tạm ứng', category: 'Tài sản' },
            { id: '152', name: 'Nguyên liệu, vật liệu', category: 'Tài sản' },
            { id: '153', name: 'Công cụ, dụng cụ', category: 'Tài sản' },
            { id: '156', name: 'Hàng hóa', category: 'Tài sản' },
            { id: '331', name: 'Phải trả cho người bán', category: 'Nguồn vốn' },
            { id: '3331', name: 'Thuế GTGT phải nộp', category: 'Nguồn vốn' },
            { id: '334', name: 'Phải trả người lao động', category: 'Nguồn vốn' },
            { id: '338', name: 'Phải trả, phải nộp khác', category: 'Nguồn vốn' },
            { id: '421', name: 'Lợi nhuận sau thuế chưa phân phối', category: 'Vốn chủ sở hữu' },
            { id: '511', name: 'Doanh thu bán hàng và cung cấp dịch vụ', category: 'Doanh thu' },
            { id: '911', name: 'Xác định kết quả kinh doanh', category: 'Trung gian' },
            { id: '632', name: 'Giá vốn hàng bán', category: 'Chi phí' },
            { id: '641', name: 'Chi phí bán hàng', category: 'Chi phí' },
            { id: '642', name: 'Chi phí quản lý kinh doanh', category: 'Chi phí' },
        ],
        products: [
            { id: 'sp001', code: 'POS-T01', name: 'Máy POS cầm tay MT-200', unit: 'Cái', costPrice: 2800000, sellPrice: 3500000, type: 'retail' },
            { id: 'sp002', code: 'POS-S01', name: 'Máy quét mã vạch BS-100', unit: 'Cái', costPrice: 950000, sellPrice: 1200000, type: 'retail' },
            { id: 'sp003', code: 'PAP-01', name: 'Giấy in nhiệt 80x80mm (thùng 50 cuộn)', unit: 'Thùng', costPrice: 320000, sellPrice: 450000, type: 'retail' },
            { id: 'sp004', code: 'CBL-01', name: 'Cáp kết nối POS USB-C', unit: 'Cái', costPrice: 55000, sellPrice: 85000, type: 'retail' },
            { id: 'sp005', code: 'CASH-01', name: 'Ngăn kéo đựng tiền POS DK-420', unit: 'Cái', costPrice: 480000, sellPrice: 650000, type: 'retail' },
            { id: 'fnb001', code: 'FNB-CF01', name: '☕ Cà phê đen đá', unit: 'Ly', costPrice: 8000, sellPrice: 25000, type: 'fnb' },
            { id: 'fnb002', code: 'FNB-CF02', name: '☕ Cà phê sữa đá', unit: 'Ly', costPrice: 12000, sellPrice: 30000, type: 'fnb' },
            { id: 'fnb003', code: 'FNB-TS01', name: '🍵 Trà sữa trân châu', unit: 'Ly', costPrice: 15000, sellPrice: 45000, type: 'fnb' },
            { id: 'fnb004', code: 'FNB-NU01', name: '🍜 Phở bò tái', unit: 'Tô', costPrice: 35000, sellPrice: 65000, type: 'fnb' },
            { id: 'fnb005', code: 'FNB-NU02', name: '🍚 Cơm tấm sườn', unit: 'Dĩa', costPrice: 28000, sellPrice: 55000, type: 'fnb' },
            { id: 'fnb006', code: 'FNB-BK01', name: '🍔 Burger gà', unit: 'Cái', costPrice: 22000, sellPrice: 49000, type: 'fnb' },
            { id: 'fnb007', code: 'FNB-JU01', name: '🧃 Nước ép cam tươi', unit: 'Ly', costPrice: 10000, sellPrice: 35000, type: 'fnb' },
            { id: 'fnb008', code: 'FNB-SW01', name: '🍰 Bánh flan caramel', unit: 'Cái', costPrice: 7000, sellPrice: 20000, type: 'fnb' },
        ],
        receiptTemplates: [
            { id: 'tpl001', name: 'Thu tiền bán hàng', debit: '111', credit: '511', vat: true, desc: 'Thu tiền bán hàng tại quầy' },
            { id: 'tpl002', name: 'Thu tiền bán hàng qua TGNH', debit: '112', credit: '511', vat: true, desc: 'Thu tiền bán hàng chuyển khoản' },
            { id: 'tpl003', name: 'Thu hồi tạm ứng', debit: '111', credit: '141', vat: false, desc: 'Thu hồi tạm ứng' },
            { id: 'tpl004', name: 'Thu nợ khách hàng', debit: '111', credit: '131', vat: false, desc: 'Khách hàng thanh toán nợ' },
        ],
        paymentTemplates: [
            { id: 'ptpl001', name: 'Chi mua hàng hóa', debit: '156', credit: '111', vat: true, desc: 'Mua hàng hóa nhập kho' },
            { id: 'ptpl002', name: 'Chi mua CCDC', debit: '153', credit: '111', vat: true, desc: 'Mua công cụ dụng cụ' },
            { id: 'ptpl003', name: 'Chi trả lương', debit: '334', credit: '111', vat: false, desc: 'Trả lương nhân viên' },
            { id: 'ptpl004', name: 'Chi tiền thuê mặt bằng', debit: '642', credit: '111', vat: true, desc: 'Thanh toán tiền thuê' },
            { id: 'ptpl005', name: 'Chi tạm ứng', debit: '141', credit: '111', vat: false, desc: 'Tạm ứng cho nhân viên' },
            { id: 'ptpl006', name: 'Chi thanh toán NCC', debit: '331', credit: '111', vat: false, desc: 'Thanh toán nợ nhà cung cấp' },
        ],
        vouchers: { receive: [], pay: [], import: [], export: [] },
        voucherCounters: { receive: 0, pay: 0, import: 0, export: 0 },
        warehouses: ['Kho tổng', 'Kho POS trưng bày', 'Kho lạnh/mát (F&B)'],
    };
}

function loadStore() {
    try {
        const raw = localStorage.getItem(STORE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            const def = getDefaultStore();
            // Always refresh products to get latest fields (type, costPrice, etc.)
            parsed.products = def.products;
            parsed.accounts = def.accounts;
            parsed.warehouses = def.warehouses;
            for (const k of Object.keys(def)) {
                if (!(k in parsed)) parsed[k] = def[k];
            }
            return parsed;
        }
    } catch (e) { console.warn('Lỗi:', e); }
    return getDefaultStore();
}
function saveStore(store) { try { localStorage.setItem(STORE_KEY, JSON.stringify(store)); } catch (e) { console.error(e); } }
let store = loadStore();

function formatCurrency(amount) { return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 }).format(amount); }
function todayStr() { return new Date().toISOString().split('T')[0]; }
function getAccountName(id) { const a = store.accounts.find(x => x.id === id); return a ? `${a.id} - ${a.name}` : id; }
function generateVoucherNumber(type) {
    const m = { receive: 'PT', pay: 'PC', import: 'PNK', export: 'PXK' };
    store.voucherCounters[type] = (store.voucherCounters[type] || 0) + 1; saveStore(store);
    const mm = String(new Date().getMonth() + 1).padStart(2, '0');
    return `${m[type]}${mm}/${String(store.voucherCounters[type]).padStart(4, '0')}`;
}

function populatePartnerSelect(selId, typeFilter) {
    const s = document.getElementById(selId); if (!s) return;
    s.innerHTML = '<option value="">-- Chọn đối tác --</option>';
    const list = typeFilter ? store.partners.filter(p => p.type === typeFilter || p.type === 'both') : store.partners;
    list.forEach(p => { const o = document.createElement('option'); o.value = p.id; o.textContent = p.name; s.appendChild(o); });
}
function addNewPartner(name, type) { const id = 'pn' + Date.now(); store.partners.push({ id, name, type }); saveStore(store); return id; }

function showAddPartnerModal(vt) { const m = document.getElementById('partner-modal'); if (m) { m.classList.remove('hidden'); m.classList.add('flex'); m.dataset.voucherType = vt || ''; } }
function hideAddPartnerModal() { const m = document.getElementById('partner-modal'); if (m) { m.classList.add('hidden'); m.classList.remove('flex'); } }
function handleAddPartner(e) {
    e.preventDefault(); const name = document.getElementById('partner-name')?.value?.trim(), type = document.getElementById('partner-type')?.value;
    if (!name) { alert('Nhập tên đối tác.'); return; }
    const id = addNewPartner(name, type), vt = document.getElementById('partner-modal')?.dataset?.voucherType;
    if (vt === 'receive') { populatePartnerSelect('recv-partner', 'customer'); document.getElementById('recv-partner').value = id; }
    else if (vt === 'pay') { populatePartnerSelect('pay-partner', 'supplier'); document.getElementById('pay-partner').value = id; }
    else if (vt === 'import') { populatePartnerSelect('import-partner', 'supplier'); document.getElementById('import-partner').value = id; }
    else if (vt === 'export') { populatePartnerSelect('export-partner', 'customer'); document.getElementById('export-partner').value = id; }
    hideAddPartnerModal(); document.getElementById('form-add-partner')?.reset();
}

// ==================== PHIẾU THU ====================
function initReceivePage() { populatePartnerSelect('recv-partner', 'customer'); document.getElementById('recv-date').value = todayStr(); const tpl = document.getElementById('recv-loai-thu'); if (tpl) store.receiptTemplates.forEach(t => { const o = document.createElement('option'); o.value = t.id; o.textContent = t.desc; tpl.appendChild(o); }); addRecvItemRow(); }
function addRecvItemRow() {
    const c = document.getElementById('recv-items'); if (!c) return;
    const row = document.createElement('div'); row.className = 'recv-item-row flex flex-wrap gap-3 items-end p-4 bg-slate-800/40 rounded-lg';
    row.innerHTML = `<div class="flex-1 min-w-[200px]"><label class="block text-xs mb-1 text-slate-400">Nội dung</label><input type="text" class="recv-desc w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-green-500" placeholder="Mô tả khoản thu"></div><div class="w-32"><label class="block text-xs mb-1 text-slate-400">TK Nợ</label><select class="recv-debit w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-green-500"><option value="">-- Chọn --</option>${store.accounts.filter(a=>a.id==='111'||a.id==='112').map(a=>`<option value="${a.id}">${a.id} - ${a.name}</option>`).join('')}</select></div><div class="w-32"><label class="block text-xs mb-1 text-slate-400">TK Có</label><select class="recv-credit w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-green-500"><option value="">-- Chọn --</option>${store.accounts.filter(a=>a.id==='511'||a.id==='131'||a.id==='141'||a.id==='3331').map(a=>`<option value="${a.id}">${a.id} - ${a.name}</option>`).join('')}</select></div><div class="w-28"><label class="block text-xs mb-1 text-slate-400">Số tiền</label><input type="number" class="recv-amount w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-green-500" min="0" placeholder="0" onchange="updateRecvPreview()" oninput="updateRecvPreview()"></div><button type="button" onclick="this.closest('.recv-item-row').remove();updateRecvPreview();" class="text-red-400 hover:text-red-300 p-2">✕</button>`;
    c.appendChild(row); row.querySelectorAll('input,select').forEach(el=>{el.addEventListener('input',updateRecvPreview);el.addEventListener('change',updateRecvPreview);});
}
function quickAddRecvItem() {
    const sel = document.getElementById('recv-loai-thu'); if (!sel||!sel.value) { alert('Chọn loại thu mẫu.'); return; }
    const tpl = store.receiptTemplates.find(t=>t.id===sel.value); if (!tpl) return; const c = document.getElementById('recv-items'); const prev = c.querySelectorAll('.recv-item-row');
    const row = document.createElement('div'); row.className = 'recv-item-row flex flex-wrap gap-3 items-end p-4 bg-slate-800/40 rounded';
    row.innerHTML = `<div class="flex-1 min-w-[200px]"><label class="block text-xs mb-1 text-slate-400">Nội dung</label><input type="text" class="recv-desc w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-green-500" value="${prev.length===0?tpl.desc:''}"></div><div class="w-32"><label class="block text-xs mb-1 text-slate-400">TK Nợ</label><select class="recv-debit w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-green-500"><option value="">-- Chọn --</option>${store.accounts.filter(a=>a.id==='111'||a.id==='112').map(a=>`<option value="${a.id}" ${a.id===tpl.debit?'selected':''}>${a.id} - ${a.name}</option>`).join('')}</select></div><div class="w-32"><label class="block text-xs mb-1 text-slate-400">TK Có</label><select class="recv-credit w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-green-500"><option value="">-- Chọn --</option>${store.accounts.filter(a=>a.id==='511'||a.id==='131'||a.id==='141'||a.id==='3331').map(a=>`<option value="${a.id}" ${a.id===tpl.credit?'selected':''}>${a.id} - ${a.name}</option>`).join('')}</select></div><div class="w-28"><label class="block text-xs mb-1 text-slate-400">Số tiền</label><input type="number" class="recv-amount w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-green-500" min="0" placeholder="0" onchange="updateRecvPreview()" oninput="updateRecvPreview()"></div><button type="button" onclick="this.closest('.recv-item-row').remove();updateRecvPreview();" class="text-red-400 hover:text-red-300 p-2">✕</button>`;
    c.appendChild(row); row.querySelectorAll('input,select').forEach(el=>{el.addEventListener('input',updateRecvPreview);el.addEventListener('change',updateRecvPreview);}); updateRecvPreview();
}
function updateRecvPreview() {
    const rows = document.querySelectorAll('.recv-item-row'), pc = document.getElementById('recv-preview-content'), tel = document.getElementById('recv-total-amount');
    if (!pc||!tel) return; let total=0,html='';
    rows.forEach((r,i)=>{const d=r.querySelector('.recv-desc')?.value||'(không có mô tả)',db=r.querySelector('.recv-debit')?.value||'',cr=r.querySelector('.recv-credit')?.value||'',amt=parseFloat(r.querySelector('.recv-amount')?.value)||0;total+=amt;if(db&&cr&&amt>0)html+=`<div class="mb-2 p-2 bg-slate-700/30 rounded text-xs"><span class="text-slate-400">#[${i+1}] ${d}</span><br><span class="text-green-400">Nợ ${getAccountName(db)}:</span> <span class="text-white font-mono">${formatCurrency(amt)}</span><br><span class="text-red-400">Có ${getAccountName(cr)}:</span> <span class="text-white font-mono">${formatCurrency(amt)}</span></div>`;});
    pc.innerHTML=html||'<p class="text-slate-300 italic text-xs">Vui lòng điền!</p>';tel.textContent=formatCurrency(total);
}
function handleReceiveSubmit(e) { e.preventDefault(); const date=document.getElementById('recv-date')?.value,pid=document.getElementById('recv-partner')?.value,partner=store.partners.find(p=>p.id===pid);const items=[];document.querySelectorAll('.recv-item-row').forEach(r=>{const db=r.querySelector('.recv-debit')?.value,cr=r.querySelector('.recv-credit')?.value,amt=parseFloat(r.querySelector('.recv-amount')?.value)||0;if(db&&cr&&amt>0)items.push({desc:r.querySelector('.recv-desc')?.value||'',debit:db,credit:cr,amount:amt});});if(!date){alert('Nhập ngày.');return;}if(items.length===0){alert('Thêm ít nhất 1 dòng.');return;}const v={id:Date.now().toString(),number:generateVoucherNumber('receive'),date,partner:partner?partner.name:'(Không có)',partnerId:pid||'',items,totalAmount:items.reduce((s,i)=>s+i.amount,0),createdAt:new Date().toISOString()};store.vouchers.receive.push(v);saveStore(store);alert(`✅ Phiếu thu ${v.number} đã lưu!\nTổng: ${formatCurrency(v.totalAmount)}`);document.getElementById('form-receive')?.reset();document.getElementById('recv-items').innerHTML='';addRecvItemRow();updateRecvPreview();document.getElementById('recv-date').value=todayStr();}

// ==================== PHIẾU CHI ====================
function initPayPage() { populatePartnerSelect('pay-partner', 'supplier'); document.getElementById('pay-date').value=todayStr();const tpl=document.getElementById('pay-loai-chi');if(tpl)store.paymentTemplates.forEach(t=>{const o=document.createElement('option');o.value=t.id;o.textContent=t.desc;tpl.appendChild(o);});addPayItemRow();}
function addPayItemRow() { const c=document.getElementById('pay-items');if(!c)return;const row=document.createElement('div');row.className='pay-item-row flex flex-wrap gap-3 items-end p-4 bg-slate-800/40 rounded';row.innerHTML=`<div class="flex-1 min-w-[200px]"><label class="block text-xs mb-1 text-slate-400">Nội dung</label><input type="text" class="pay-desc w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-red-500" placeholder="Mô tả khoản chi"></div><div class="w-32"><label class="block text-xs mb-1 text-slate-400">TK Nợ</label><select class="pay-debit w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-red-500"><option value="">-- Chọn --</option>${store.accounts.filter(a=>a.id==='156'||a.id==='152'||a.id==='153'||a.id==='642'||a.id==='331'||a.id==='334'||a.id==='141'||a.id==='133').map(a=>`<option value="${a.id}">${a.id} - ${a.name}</option>`).join('')}</select></div><div class="w-32"><label class="block text-xs mb-1 text-slate-400">TK Có</label><select class="pay-credit w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-red-500"><option value="">-- Chọn --</option>${store.accounts.filter(a=>a.id==='111'||a.id==='112').map(a=>`<option value="${a.id}">${a.id} - ${a.name}</option>`).join('')}</select></div><div class="w-28"><label class="block text-xs mb-1 text-slate-400">Số tiền</label><input type="number" class="pay-amount w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-red-500" min="0" placeholder="0" onchange="updatePayPreview()" oninput="updatePayPreview()"></div><button type="button" onclick="this.closest('.pay-item-row').remove();updatePayPreview();" class="text-red-400 hover:text-red-300 p-2">✕</button>`;c.appendChild(row);row.querySelectorAll('input,select').forEach(el=>{el.addEventListener('input',updatePayPreview);el.addEventListener('change',updatePayPreview);});}
function quickAddPayItem() { const sel=document.getElementById('pay-loai-chi');if(!sel||!sel.value){alert('Chọn loại chi mẫu.');return;};const tpl=store.paymentTemplates.find(t=>t.id===sel.value);if(!tpl)return;const c=document.getElementById('pay-items'),prev=c.querySelectorAll('.pay-item-row');const row=document.createElement('div');row.className='pay-item-row flex flex-wrap gap-3 items-end p-4 bg-slate-800/40 rounded';row.innerHTML=`<div class="flex-1 min-w-[200px]"><label class="block text-xs mb-1 text-slate-400">Nội dung</label><input type="text" class="pay-desc w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-red-500" value="${prev.length===0?tpl.desc:''}"></div><div class="w-32"><label class="block text-xs mb-1 text-slate-400">TK Nợ</label><select class="pay-debit w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-red-500"><option value="">-- Chọn --</option>${store.accounts.filter(a=>a.id==='156'||a.id==='152'||a.id==='153'||a.id==='642'||a.id==='331'||a.id==='334'||a.id==='141'||a.id==='133').map(a=>`<option value="${a.id}" ${a.id===tpl.debit?'selected':''}>${a.id} - ${a.name}</option>`).join('')}</select></div><div class="w-32"><label class="block text-xs mb-1 text-slate-400">TK Có</label><select class="pay-credit w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-red-500"><option value="">-- Chọn --</option>${store.accounts.filter(a=>a.id==='111'||a.id==='112').map(a=>`<option value="${a.id}" ${a.id===tpl.credit?'selected':''}>${a.id} - ${a.name}</option>`).join('')}</select></div><div class="w-28"><label class="block text-xs mb-1 text-slate-400">Số tiền</label><input type="number" class="pay-amount w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-red-500" min="0" placeholder="0" onchange="updatePayPreview()" oninput="updatePayPreview()"></div><button type="button" onclick="this.closest('.pay-item-row').remove();updatePayPreview();" class="text-red-400 hover:text-red-300 p-2">✕</button>`;c.appendChild(row);row.querySelectorAll('input,select').forEach(el=>{el.addEventListener('input',updatePayPreview);el.addEventListener('change',updatePayPreview);});updatePayPreview();}
function updatePayPreview() { const rows=document.querySelectorAll('.pay-item-row'),pc=document.getElementById('pay-preview-content'),tel=document.getElementById('pay-total-amount');if(!pc||!tel)return;let total=0,html='';rows.forEach((r,i)=>{const d=r.querySelector('.pay-desc')?.value||'',db=r.querySelector('.pay-debit')?.value||'',cr=r.querySelector('.pay-credit')?.value||'',amt=parseFloat(r.querySelector('.pay-amount')?.value)||0;total+=amt;if(db&&cr&&amt>0)html+=`<div class="mb-2 p-2 bg-slate-700/30 rounded text-xs"><span class="text-slate-400">#[${i+1}] ${d}</span><br><span class="text-green-400">Nợ ${getAccountName(db)}:</span> <span class="text-white font-mono">${formatCurrency(amt)}</span><br><span class="text-red-400">Có ${getAccountName(cr)}:</span> <span class="text-white font-mono">${formatCurrency(amt)}</span></div>`;});pc.innerHTML=html||'<p class="text-slate-300 italic text-xs">Vui lòng điền!</p>';tel.textContent=formatCurrency(total);}
function handlePaySubmit(e) { e.preventDefault();const date=document.getElementById('pay-date')?.value,pid=document.getElementById('pay-partner')?.value,partner=store.partners.find(p=>p.id===pid);const items=[];document.querySelectorAll('.pay-item-row').forEach(r=>{const db=r.querySelector('.pay-debit')?.value,cr=r.querySelector('.pay-credit')?.value,amt=parseFloat(r.querySelector('.pay-amount')?.value)||0;if(db&&cr&&amt>0)items.push({desc:r.querySelector('.pay-desc')?.value||'',debit:db,credit:cr,amount:amt});});if(!date){alert('Nhập ngày.');return;}if(items.length===0){alert('Thêm ít nhất 1 dòng.');return;}const v={id:Date.now().toString(),number:generateVoucherNumber('pay'),date,partner:partner?partner.name:'(Không có)',partnerId:pid||'',items,totalAmount:items.reduce((s,i)=>s+i.amount,0),createdAt:new Date().toISOString()};store.vouchers.pay.push(v);saveStore(store);alert(`✅ Phiếu chi ${v.number} đã lưu!\nTổng: ${formatCurrency(v.totalAmount)}`);document.getElementById('form-pay')?.reset();document.getElementById('pay-items').innerHTML='';addPayItemRow();updatePayPreview();document.getElementById('pay-date').value=todayStr();}

// ==================== V3: PHIẾU NHẬP KHO ====================
function initImportPage() { populatePartnerSelect('import-partner', 'supplier'); document.getElementById('import-date').value = todayStr(); addImportProductRow(); }
function addImportProductRow() {
    const c = document.getElementById('import-items'); if (!c) return;
    const row = document.createElement('div'); row.className = 'import-item-row bg-slate-800/40 rounded-lg p-4 space-y-3';
    row.innerHTML = `<div class="grid grid-cols-1 md:grid-cols-5 gap-3"><div class="md:col-span-2"><label class="block text-xs mb-1 text-slate-400">📦 Sản phẩm</label><select class="import-prod-select w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"><option value="">-- Chọn SP --</option>${store.products.map(p=>`<option value="${p.id}" data-cost="${p.costPrice}" data-unit="${p.unit}">${p.code} - ${p.name}</option>`).join('')}</select></div>
    <div><label class="block text-xs mb-1 text-slate-400">📏 ĐVT</label><input type="text" class="import-prod-unit w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-400" readonly></div>
    <div><label class="block text-xs mb-1 text-slate-400">🔢 SL</label><input type="number" class="import-prod-qty w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" min="0" value="1"></div>
    <div><label class="block text-xs mb-1 text-slate-400">💵 Đơn giá</label><input type="number" class="import-prod-price w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" min="0" placeholder="Giá"></div>
    </div><div class="grid grid-cols-2 md:grid-cols-4 gap-3">
    <div><label class="block text-xs mb-1 text-blue-300">💰 Thành tiền</label><input type="number" class="import-prod-amount w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono text-blue-300" readonly></div>
    <div><label class="block text-xs mb-1 text-green-400">⬆️ TK Nợ</label><select class="import-debit w-full bg-slate-800 border border-green-700/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500"><option value="">TK Nợ</option>${store.accounts.filter(a=>a.id==='156'||a.id==='152'||a.id==='153'||a.id==='133').map(a=>`<option value="${a.id}" ${a.id==='156'?'selected':''}>${a.id} - ${a.name}</option>`).join('')}</select></div>
    <div><label class="block text-xs mb-1 text-red-400">⬇️ TK Có</label><select class="import-credit w-full bg-slate-800 border border-red-700/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500"><option value="">TK Có</option>${store.accounts.filter(a=>a.id==='331'||a.id==='111'||a.id==='112'||a.id==='632'||a.id==='156').map(a=>`<option value="${a.id}" ${a.id==='331'?'selected':''}>${a.id} - ${a.name}</option>`).join('')}</select></div>
    <div><label class="block text-xs mb-1 text-slate-400">🏗️ Kho</label><select class="import-prod-wh w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">${store.warehouses.map(w=>`<option>${w}</option>`).join('')}</select></div>
    </div><div class="flex justify-end pt-1 border-t border-slate-700/50"><button type="button" onclick="this.closest('.import-item-row').remove();updateImportPreview();" class="text-red-400 hover:text-red-300 px-3 py-1.5 rounded-lg text-xs transition-all border border-red-800/30 hover:border-red-600/50">✕ Xóa</button></div>`;
    c.appendChild(row);
    const sel = row.querySelector('.import-prod-select'), price = row.querySelector('.import-prod-price'), unit = row.querySelector('.import-prod-unit'), qty = row.querySelector('.import-prod-qty'), amt = row.querySelector('.import-prod-amount');
    sel.addEventListener('change', () => { const o = sel.selectedOptions[0]; if (o && o.dataset.cost) { price.value = o.dataset.cost; unit.value = o.dataset.unit || ''; } amt.value = (parseFloat(qty.value)||0)*(parseFloat(price.value)||0); updateImportPreview(); autoSetImportAccount(row); });
    qty.addEventListener('input', () => { amt.value = (parseFloat(qty.value)||0)*(parseFloat(price.value)||0); updateImportPreview(); });
    price.addEventListener('input', () => { amt.value = (parseFloat(qty.value)||0)*(parseFloat(price.value)||0); updateImportPreview(); });
    row.querySelectorAll('select').forEach(el=>{el.addEventListener('change',updateImportPreview);});
}

function autoSetImportAccount(row) {
    const sel = row.querySelector('.import-prod-select');
    if (!sel) return;
    const o = sel.selectedOptions[0];
    const productType = o ? o.dataset.type || '' : '';
    const debitSel = row.querySelector('.import-debit');
    if (productType === 'fnb' && debitSel) {
        // F&B products go to 152 NVL instead of 156 Hàng hóa
        if (debitSel.querySelector('option[value="152"]')) debitSel.value = '152';
    } else if (debitSel) {
        if (debitSel.querySelector('option[value="156"]')) debitSel.value = '156';
    }
    updateImportPreview();
}

function autoFillImportEntries() { const opType = document.getElementById('import-operation-type')?.value; if (!opType || opType === 'custom') return; const presets = { purchase: { debit: '156', credit: '331' }, 'purchase-no-vat': { debit: '156', credit: '331' }, 'purchase-cash': { debit: '156', credit: '111' }, return: { debit: '156', credit: '632' }, transfer: { debit: '156', credit: '156' } }; const p = presets[opType]; if (!p) return; document.querySelectorAll('.import-item-row').forEach(row => { const debitSel = row.querySelector('.import-debit'), creditSel = row.querySelector('.import-credit'); if (debitSel && debitSel.querySelector(`option[value="${p.debit}"]`)) debitSel.value = p.debit; if (creditSel && creditSel.querySelector(`option[value="${p.credit}"]`)) creditSel.value = p.credit; }); updateImportPreview(); }

function updateImportPreview() {
    let prodTotal = 0, debitTotal = 0, creditTotal = 0; const dGroups = {}, cGroups = {};
    document.querySelectorAll('.import-item-row').forEach(r => {
        const amt = parseFloat(r.querySelector('.import-prod-amount')?.value) || 0; const db = r.querySelector('.import-debit')?.value || '', cr = r.querySelector('.import-credit')?.value || '';
        prodTotal += amt; if (db) { debitTotal += amt; dGroups[db] = (dGroups[db] || 0) + amt; } if (cr) { creditTotal += amt; cGroups[cr] = (cGroups[cr] || 0) + amt; }
    });
    const ptEl = document.getElementById('import-total-amount'); if (ptEl) ptEl.textContent = formatCurrency(prodTotal);
    const pc = document.getElementById('import-preview-content'); const bal = document.getElementById('import-balance-check');
    let html = '';
    document.querySelectorAll('.import-item-row').forEach((r,i) => {
        const db = r.querySelector('.import-debit')?.value||'', cr = r.querySelector('.import-credit')?.value||'';
        const amt = parseFloat(r.querySelector('.import-prod-amount')?.value)||0, qty = r.querySelector('.import-prod-qty')?.value||0;
        const prodName = r.querySelector('.import-prod-select')?.selectedOptions[0]?.textContent || '(Chưa chọn)';
        if (db && cr && amt > 0) html += `<div class="mb-2 p-2 bg-slate-700/30 rounded text-xs"><span class="text-slate-400">#[${i+1}] ${prodName} (SL:${qty})</span><br><span class="text-green-400">Nợ ${getAccountName(db)}:</span> <span class="text-white font-mono">${formatCurrency(amt)}</span> &nbsp;|&nbsp; <span class="text-red-400">Có ${getAccountName(cr)}:</span> <span class="text-white font-mono">${formatCurrency(amt)}</span></div>`;
    });
    if (html) { html += '<div class="mt-3 pt-2 border-t border-slate-600 text-xs"><p class="text-slate-400 font-semibold mb-1">📊 Tổng hợp:</p>'; for (const [acc, amt] of Object.entries(dGroups)) html += `<p class="text-green-400">➤ Nợ ${getAccountName(acc)}: <span class="text-white font-mono">${formatCurrency(amt)}</span></p>`; for (const [acc, amt] of Object.entries(cGroups)) html += `<p class="text-red-400">➤ Có ${getAccountName(acc)}: <span class="text-white font-mono">${formatCurrency(amt)}</span></p>`; html += '</div>'; }
    if (pc) pc.innerHTML = html || '<p class="text-slate-300 italic text-xs">Vui lòng thêm ít nhất một dòng!</p>';
    if (bal) { const diff = Math.abs(debitTotal - creditTotal); if (debitTotal === 0 && creditTotal === 0) bal.innerHTML = ''; else if (diff < 1) bal.innerHTML = '<span class="text-green-400">✅ Cân bằng</span>'; else bal.innerHTML = `<span class="text-yellow-400">⚠️ Chênh lệch: ${formatCurrency(diff)}</span>`; }
}
function handleImportSubmit(e) { e.preventDefault(); const date = document.getElementById('import-date')?.value, pid = document.getElementById('import-partner')?.value, partner = store.partners.find(p => p.id === pid); const warehouse = document.getElementById('import-warehouse')?.value, invoice = document.getElementById('import-invoice')?.value || ''; const rows = []; document.querySelectorAll('.import-item-row').forEach(r => { const prodId = r.querySelector('.import-prod-select')?.value, prod = store.products.find(p => p.id === prodId); const qty = parseFloat(r.querySelector('.import-prod-qty')?.value) || 0, price = parseFloat(r.querySelector('.import-prod-price')?.value) || 0, amount = parseFloat(r.querySelector('.import-prod-amount')?.value) || 0; const debit = r.querySelector('.import-debit')?.value, credit = r.querySelector('.import-credit')?.value, wh = r.querySelector('.import-prod-wh')?.value || warehouse; if (debit && credit && amount > 0) rows.push({ productId: prodId || '', productName: prod ? `${prod.code} - ${prod.name}` : '(Chưa chọn)', qty, price, amount, debit, credit, warehouse: wh }); }); if (!date) { alert('Nhập ngày.'); return; } if (rows.length === 0) { alert('Thêm ít nhất 1 dòng.'); return; } const v = { id: Date.now().toString(), number: generateVoucherNumber('import'), date, partner: partner ? partner.name : '(Không có)', partnerId: pid || '', warehouse, invoice, rows, totalAmount: rows.reduce((s,r)=>s+r.amount,0), createdAt: new Date().toISOString() }; store.vouchers.import.push(v); saveStore(store); alert(`✅ Phiếu nhập kho ${v.number} đã lưu!\nTổng: ${formatCurrency(v.totalAmount)}`); document.getElementById('form-import')?.reset(); document.getElementById('import-items').innerHTML = ''; addImportProductRow(); updateImportPreview(); document.getElementById('import-date').value = todayStr(); }

// ==================== V3: PHIẾU XUẤT KHO ====================
function initExportPage() { populatePartnerSelect('export-partner', 'customer'); document.getElementById('export-date').value = todayStr(); addExportProductRow(); }
function addExportProductRow() {
    const c = document.getElementById('export-items'); if (!c) return;
    const row = document.createElement('div'); row.className = 'export-item-row bg-slate-800/40 rounded-lg p-4 space-y-3';
    row.innerHTML = `<div class="grid grid-cols-1 md:grid-cols-5 gap-3"><div class="md:col-span-2"><label class="block text-xs mb-1 text-slate-400">📦 Sản phẩm</label><select class="export-prod-select w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500"><option value="">-- Chọn SP --</option>${store.products.map(p=>`<option value="${p.id}" data-cost="${p.costPrice}" data-unit="${p.unit}">${p.code} - ${p.name}</option>`).join('')}</select></div>
    <div><label class="block text-xs mb-1 text-slate-400">📏 ĐVT</label><input type="text" class="export-prod-unit w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-400" readonly></div>
    <div><label class="block text-xs mb-1 text-slate-400">🔢 SL</label><input type="number" class="export-prod-qty w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500" min="0" value="1"></div>
    <div><label class="block text-xs mb-1 text-slate-400">💵 Giá vốn</label><input type="number" class="export-prod-price w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500" min="0" placeholder="Giá vốn"></div>
    </div><div class="grid grid-cols-2 md:grid-cols-4 gap-3">
    <div><label class="block text-xs mb-1 text-orange-300">💰 Thành tiền</label><input type="number" class="export-prod-amount w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono text-orange-300" readonly></div>
    <div><label class="block text-xs mb-1 text-green-400">⬆️ TK Nợ</label><select class="export-debit w-full bg-slate-800 border border-green-700/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500"><option value="">TK Nợ</option>${store.accounts.filter(a=>a.id==='632'||a.id==='642'||a.id==='641'||a.id==='331'||a.id==='156').map(a=>`<option value="${a.id}" ${a.id==='632'?'selected':''}>${a.id} - ${a.name}</option>`).join('')}</select></div>
    <div><label class="block text-xs mb-1 text-red-400">⬇️ TK Có</label><select class="export-credit w-full bg-slate-800 border border-red-700/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500"><option value="">TK Có</option>${store.accounts.filter(a=>a.id==='156'||a.id==='152'||a.id==='153').map(a=>`<option value="${a.id}" ${a.id==='156'?'selected':''}>${a.id} - ${a.name}</option>`).join('')}</select></div>
    <div><label class="block text-xs mb-1 text-slate-400">🏗️ Kho</label><select class="export-prod-wh w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500">${store.warehouses.map(w=>`<option>${w}</option>`).join('')}</select></div>
    </div><div class="flex justify-end pt-1 border-t border-slate-700/50"><button type="button" onclick="this.closest('.export-item-row').remove();updateExportPreview();" class="text-red-400 hover:text-red-300 px-3 py-1.5 rounded-lg text-xs transition-all border border-red-800/30 hover:border-red-600/50">✕ Xóa</button></div>`;
    c.appendChild(row);
    const sel = row.querySelector('.export-prod-select'), price = row.querySelector('.export-prod-price'), unit = row.querySelector('.export-prod-unit'), qty = row.querySelector('.export-prod-qty'), amt = row.querySelector('.export-prod-amount');
    sel.addEventListener('change', () => { const o = sel.selectedOptions[0]; if (o && o.dataset.cost) { price.value = o.dataset.cost; unit.value = o.dataset.unit || ''; } amt.value = (parseFloat(qty.value)||0)*(parseFloat(price.value)||0); updateExportPreview(); autoSetExportAccount(row); });
    qty.addEventListener('input', () => { amt.value = (parseFloat(qty.value)||0)*(parseFloat(price.value)||0); updateExportPreview(); });
    price.addEventListener('input', () => { amt.value = (parseFloat(qty.value)||0)*(parseFloat(price.value)||0); updateExportPreview(); });
    row.querySelectorAll('select').forEach(el=>{el.addEventListener('change',updateExportPreview);});
}
function autoSetExportAccount(row) {
    const sel = row.querySelector('.export-prod-select');
    if (!sel) return;
    const o = sel.selectedOptions[0];
    const productType = o ? o.dataset.type || '' : '';
    const creditSel = row.querySelector('.export-credit');
    if (productType === 'fnb' && creditSel) {
        // F&B products credit 152 NVL instead of 156 Hàng hóa
        if (creditSel.querySelector('option[value="152"]')) creditSel.value = '152';
    } else if (creditSel) {
        if (creditSel.querySelector('option[value="156"]')) creditSel.value = '156';
    }
    updateExportPreview();
}

function autoFillExportEntries() { const opType = document.getElementById('export-operation-type')?.value; if (!opType || opType === 'custom') return; const presets = { sale: { debit: '632', credit: '156' }, 'return-ncc': { debit: '331', credit: '156' }, destroy: { debit: '642', credit: '156' }, transfer: { debit: '156', credit: '156' }, sample: { debit: '641', credit: '156' } }; const p = presets[opType]; if (!p) return; document.querySelectorAll('.export-item-row').forEach(row => { const d = row.querySelector('.export-debit'), c = row.querySelector('.export-credit'); if (d && d.querySelector(`option[value="${p.debit}"]`)) d.value = p.debit; if (c && c.querySelector(`option[value="${p.credit}"]`)) c.value = p.credit; }); updateExportPreview(); }
function updateExportPreview() {
    let prodTotal = 0, debitTotal = 0, creditTotal = 0; const dGroups = {}, cGroups = {};
    document.querySelectorAll('.export-item-row').forEach(r => { const amt = parseFloat(r.querySelector('.export-prod-amount')?.value) || 0, db = r.querySelector('.export-debit')?.value || '', cr = r.querySelector('.export-credit')?.value || ''; prodTotal += amt; if (db) { debitTotal += amt; dGroups[db] = (dGroups[db] || 0) + amt; } if (cr) { creditTotal += amt; cGroups[cr] = (cGroups[cr] || 0) + amt; } });
    const ptEl = document.getElementById('export-total-amount'); if (ptEl) ptEl.textContent = formatCurrency(prodTotal);
    const pc = document.getElementById('export-preview-content'), bal = document.getElementById('export-balance-check'); let html = '';
    document.querySelectorAll('.export-item-row').forEach((r,i) => { const db = r.querySelector('.export-debit')?.value||'', cr = r.querySelector('.export-credit')?.value||''; const amt = parseFloat(r.querySelector('.export-prod-amount')?.value)||0, qty = r.querySelector('.export-prod-qty')?.value||0; const prodName = r.querySelector('.export-prod-select')?.selectedOptions[0]?.textContent || '(Chưa chọn)'; if (db && cr && amt > 0) html += `<div class="mb-2 p-2 bg-slate-700/30 rounded text-xs"><span class="text-slate-400">#[${i+1}] ${prodName} (SL:${qty})</span><br><span class="text-green-400">Nợ ${getAccountName(db)}:</span> <span class="text-white font-mono">${formatCurrency(amt)}</span> &nbsp;|&nbsp; <span class="text-red-400">Có ${getAccountName(cr)}:</span> <span class="text-white font-mono">${formatCurrency(amt)}</span></div>`; });
    if (html) { html += '<div class="mt-3 pt-2 border-t border-slate-600 text-xs"><p class="text-slate-400 font-semibold mb-1">📊 Tổng hợp:</p>'; for (const [acc, amt] of Object.entries(dGroups)) html += `<p class="text-green-400">➤ Nợ ${getAccountName(acc)}: <span class="text-white font-mono">${formatCurrency(amt)}</span></p>`; for (const [acc, amt] of Object.entries(cGroups)) html += `<p class="text-red-400">➤ Có ${getAccountName(acc)}: <span class="text-white font-mono">${formatCurrency(amt)}</span></p>`; html += '</div>'; }
    if (pc) pc.innerHTML = html || '<p class="text-slate-300 italic text-xs">Vui lòng thêm ít nhất một dòng!</p>';
    if (bal) { const diff = Math.abs(debitTotal - creditTotal); if (debitTotal === 0 && creditTotal === 0) bal.innerHTML = ''; else if (diff < 1) bal.innerHTML = '<span class="text-green-400">✅ Cân bằng</span>'; else bal.innerHTML = `<span class="text-yellow-400">⚠️ Chênh lệch: ${formatCurrency(diff)}</span>`; }
}
function handleExportSubmit(e) { e.preventDefault(); const date = document.getElementById('export-date')?.value, pid = document.getElementById('export-partner')?.value, partner = store.partners.find(p => p.id === pid); const warehouse = document.getElementById('export-warehouse')?.value, reason = document.getElementById('export-reason')?.value; const rows = []; document.querySelectorAll('.export-item-row').forEach(r => { const prodId = r.querySelector('.export-prod-select')?.value, prod = store.products.find(p => p.id === prodId); const qty = parseFloat(r.querySelector('.export-prod-qty')?.value) || 0, price = parseFloat(r.querySelector('.export-prod-price')?.value) || 0, amount = parseFloat(r.querySelector('.export-prod-amount')?.value) || 0; const debit = r.querySelector('.export-debit')?.value, credit = r.querySelector('.export-credit')?.value, wh = r.querySelector('.export-prod-wh')?.value || warehouse; if (debit && credit && amount > 0) rows.push({ productId: prodId || '', productName: prod ? `${prod.code} - ${prod.name}` : '(Chưa chọn)', qty, price, amount, debit, credit, warehouse: wh }); }); if (!date) { alert('Nhập ngày.'); return; } if (rows.length === 0) { alert('Thêm ít nhất 1 dòng.'); return; } const v = { id: Date.now().toString(), number: generateVoucherNumber('export'), date, partner: partner ? partner.name : '(Không có)', partnerId: pid || '', warehouse, reason, rows, totalAmount: rows.reduce((s,r)=>s+r.amount,0), createdAt: new Date().toISOString() }; store.vouchers.export.push(v); saveStore(store); alert(`✅ Phiếu xuất kho ${v.number} đã lưu!\nTổng giá vốn: ${formatCurrency(v.totalAmount)}`); document.getElementById('form-export')?.reset(); document.getElementById('export-items').innerHTML = ''; addExportProductRow(); updateExportPreview(); document.getElementById('export-date').value = todayStr(); }

// ==================== V3: BÁN HÀNG RETAIL & F&B ====================
const fnbRecipes = {
    'fnb001': [{ material: 'Cà phê bột', qty: 0.02, unit: 'Kg', cost: 300000 }, { material: 'Đá viên', qty: 1, unit: 'Ly', cost: 1000 }],
    'fnb002': [{ material: 'Cà phê bột', qty: 0.02, unit: 'Kg', cost: 300000 }, { material: 'Sữa đặc', qty: 0.04, unit: 'Hộp', cost: 80000 }, { material: 'Đá viên', qty: 1, unit: 'Ly', cost: 1000 }],
    'fnb003': [{ material: 'Trà ô long', qty: 0.01, unit: 'Kg', cost: 500000 }, { material: 'Bột trân châu', qty: 0.05, unit: 'Kg', cost: 80000 }, { material: 'Sữa tươi', qty: 0.2, unit: 'Lít', cost: 40000 }],
    'fnb004': [{ material: 'Bánh phở', qty: 0.3, unit: 'Kg', cost: 25000 }, { material: 'Thịt bò', qty: 0.15, unit: 'Kg', cost: 180000 }, { material: 'Xương ống', qty: 0.1, unit: 'Kg', cost: 60000 }, { material: 'Gia vị', qty: 1, unit: 'Gói', cost: 5000 }],
    'fnb005': [{ material: 'Gạo tấm', qty: 0.25, unit: 'Kg', cost: 15000 }, { material: 'Sườn heo', qty: 0.2, unit: 'Kg', cost: 120000 }, { material: 'Mỡ hành', qty: 0.05, unit: 'Kg', cost: 30000 }],
    'fnb006': [{ material: 'Bánh mì burger', qty: 1, unit: 'Cái', cost: 5000 }, { material: 'Thịt gà', qty: 0.15, unit: 'Kg', cost: 100000 }, { material: 'Rau xà lách', qty: 0.03, unit: 'Kg', cost: 40000 }],
    'fnb007': [{ material: 'Cam tươi', qty: 3, unit: 'Quả', cost: 3000 }, { material: 'Đường', qty: 0.02, unit: 'Kg', cost: 20000 }],
    'fnb008': [{ material: 'Trứng gà', qty: 2, unit: 'Quả', cost: 3500 }, { material: 'Sữa đặc', qty: 0.02, unit: 'Hộp', cost: 80000 }, { material: 'Đường', qty: 0.03, unit: 'Kg', cost: 20000 }],
};

function onSalesTypeChange() {
    const salesType = document.getElementById('sales-type')?.value;
    const fnbOptions = document.getElementById('fnb-options');
    const fnbBreakdown = document.getElementById('fnb-material-breakdown');
    const title = document.getElementById('sales-items-title');
    if (fnbOptions) fnbOptions.classList.toggle('hidden', salesType !== 'fnb');
    if (fnbBreakdown) fnbBreakdown.classList.toggle('hidden', salesType !== 'fnb');
    if (title) title.textContent = salesType === 'fnb' ? '🍽️ Món F&B & Định khoản (mỗi dòng = 1 cặp Nợ/Có)' : '🛒 Mặt hàng bán & Định khoản (mỗi dòng = 1 cặp Nợ/Có)';
    // Rebuild all rows - products from old mode may not exist in new mode
    const container = document.getElementById('sales-items');
    if (container && container.children.length > 0) {
        const existing = [];
        container.querySelectorAll('.sales-item-row').forEach(r => { existing.push({ prodId: r.querySelector('.sales-prod-select')?.value || '', qty: r.querySelector('.sales-prod-qty')?.value || '1', price: r.querySelector('.sales-prod-price')?.value || '' }); });
        container.innerHTML = '';
        existing.forEach(d => {
            addSalesItemRow();
            const last = container.lastElementChild; if (!last) return;
            const sel = last.querySelector('.sales-prod-select'), qty = last.querySelector('.sales-prod-qty'), price = last.querySelector('.sales-prod-price');
            const validProd = sel && [...sel.options].some(o => o.value === d.prodId && d.prodId);
            if (sel && validProd) { sel.value = d.prodId; sel.dispatchEvent(new Event('change')); }
            if (qty) qty.value = d.qty; if (price) price.value = d.price; computeSalesRow(last);
        });
    }
    updateSalesPreview();
}

function initSalesPage() { populatePartnerSelect('sales-partner', 'customer'); document.getElementById('sales-date').value = todayStr(); document.getElementById('sales-payment')?.addEventListener('change', updateSalesPreview); addSalesItemRow(); onSalesTypeChange(); }

function addSalesItemRow() {
    const c = document.getElementById('sales-items'); if (!c) return;
    const row = document.createElement('div');
    const isFNB = document.getElementById('sales-type')?.value === 'fnb';
    const invAcct = isFNB ? (document.getElementById('sales-inventory-account')?.value || '152') : '156';
    const payment = document.getElementById('sales-payment')?.value || '111';
    row.className = 'sales-item-row bg-slate-800/40 rounded-lg p-4 space-y-3';

    // Strict filter: Retail → only retail products; F&B → only fnb products
    const filteredProducts = isFNB ? store.products.filter(p => p.type === 'fnb') : store.products.filter(p => !p.type || p.type === 'retail');

    row.innerHTML =
        `<div class="grid grid-cols-1 md:grid-cols-5 gap-3">
            <div class="md:col-span-2"><label class="block text-xs mb-1 text-slate-400">📦 Sản phẩm</label><select class="sales-prod-select w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"><option value="">-- Chọn sản phẩm --</option>${filteredProducts.map(p=>`<option value="${p.id}" data-sell="${p.sellPrice}" data-cost="${p.costPrice}" data-unit="${p.unit}" data-type="${p.type||'retail'}">${p.code} - ${p.name}</option>`).join('')}</select></div>
            <div><label class="block text-xs mb-1 text-slate-400">📏 ĐVT</label><input type="text" class="sales-prod-unit w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-400" readonly></div>
            <div><label class="block text-xs mb-1 text-slate-400">🔢 SL</label><input type="number" class="sales-prod-qty w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500" min="0" value="1"></div>
            <div><label class="block text-xs mb-1 text-slate-400">💵 Giá bán</label><input type="number" class="sales-prod-price w-full bg-slate-800 border border-green-700/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500" placeholder="0"></div>
        </div>
        <div class="grid grid-cols-2 gap-3">
            <div><label class="block text-xs mb-1 text-green-400">💰 Doanh thu (đã VAT)</label><input type="number" class="sales-prod-revenue w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono text-green-300" readonly></div>
            <div><label class="block text-xs mb-1 text-orange-400">📦 Giá vốn</label><input type="number" class="sales-prod-cogs w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono text-orange-300" readonly></div>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div><label class="block text-xs mb-1 text-green-400">⬆️ TK Nợ (Doanh thu)</label><select class="sales-debit-revenue w-full bg-slate-800 border border-green-700/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500"><option value="111" ${payment==='111'?'selected':''}>111 — Tiền mặt</option><option value="112" ${payment==='112'?'selected':''}>112 — TGNH</option><option value="131">131 — Phải thu KH</option></select></div>
            <div><label class="block text-xs mb-1 text-red-400">⬇️ TK Có (Doanh thu)</label><input type="text" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-500" value="511 + 3331 (VAT)" readonly style="font-size:0.7rem; padding-top:0.6rem; padding-bottom:0.6rem;"></div>
            <div><label class="block text-xs mb-1 text-green-400">⬆️ TK Nợ (Giá vốn)</label><select class="sales-debit-cogs w-full bg-slate-800 border border-green-700/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500"><option value="632" selected>632 — Giá vốn</option><option value="641">641 — CP bán hàng</option></select></div>
            <div><label class="block text-xs mb-1 text-red-400">⬇️ TK Có (Giá vốn)</label><select class="sales-credit-cogs w-full bg-slate-800 border border-red-700/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500">${store.accounts.filter(a=>a.id==='156'||a.id==='152').map(a=>`<option value="${a.id}" ${a.id===invAcct?'selected':''}>${a.id} — ${a.name}</option>`).join('')}</select></div>
        </div>
        <div class="flex items-center justify-between pt-1 border-t border-slate-700/50">
            <span class="text-xs text-slate-500">#${c.children.length + 1} — ${isFNB ? '🍽️ F&B' : '🛍️ Retail'}</span>
            <div class="flex gap-2">
                ${isFNB ? '<button type="button" onclick="showFnbRecipe(this.closest(\'.sales-item-row\'))" class="bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 px-3 py-1.5 rounded-lg text-xs transition-all border border-amber-600/30">📋 Định lượng NVL</button>' : ''}
                <button type="button" onclick="this.closest('.sales-item-row').remove();updateSalesPreview();" class="text-red-400 hover:text-red-300 px-3 py-1.5 rounded-lg text-xs transition-all border border-red-800/30 hover:border-red-600/50">✕ Xóa</button>
            </div>
        </div>`;

    c.appendChild(row);
    const sel = row.querySelector('.sales-prod-select'), price = row.querySelector('.sales-prod-price'), unit = row.querySelector('.sales-prod-unit');
    const qty = row.querySelector('.sales-prod-qty'), revenue = row.querySelector('.sales-prod-revenue'), cogs = row.querySelector('.sales-prod-cogs');
    sel.addEventListener('change', () => { const o = sel.selectedOptions[0]; if (o && o.dataset.sell) { price.value = o.dataset.sell; unit.value = o.dataset.unit || ''; } computeSalesRow(row); updateSalesPreview(); if (isFNB) showFnbRecipe(row); });
    qty.addEventListener('input', () => { computeSalesRow(row); updateSalesPreview(); });
    price.addEventListener('input', () => { computeSalesRow(row); updateSalesPreview(); });
    row.querySelectorAll('select').forEach(el=>el.addEventListener('change',updateSalesPreview));
}

function computeSalesRow(row) { const qty = parseFloat(row.querySelector('.sales-prod-qty')?.value) || 0, price = parseFloat(row.querySelector('.sales-prod-price')?.value) || 0; const sel = row.querySelector('.sales-prod-select'), costPrice = parseFloat(sel?.selectedOptions[0]?.dataset?.cost) || 0; row.querySelector('.sales-prod-revenue').value = qty * price; row.querySelector('.sales-prod-cogs').value = qty * costPrice; }

function showFnbRecipe(row) {
    const prodId = row.querySelector('.sales-prod-select')?.value; const product = store.products.find(p => p.id === prodId);
    const qty = parseFloat(row.querySelector('.sales-prod-qty')?.value) || 0; const recipe = fnbRecipes[prodId];
    const table = document.getElementById('fnb-material-table'); if (!table || !recipe) { if (table) table.innerHTML = '<p class="text-slate-500 text-xs italic">Chưa có định mức NVL.</p>'; return; }
    let html = '<div class="text-xs mb-2 text-amber-300">📋 Định lượng: <strong>' + (product ? product.name : prodId) + '</strong> (SL: ' + qty + ')</div>'; let totalMaterial = 0;
    recipe.forEach((m) => { const used = m.qty * qty, cost = m.cost * used; totalMaterial += cost; html += `<div class="grid grid-cols-5 gap-2 p-2 bg-slate-800/50 rounded text-xs mb-1"><div class="col-span-2"><span class="text-slate-300">${m.material}</span><br><span class="text-slate-500">${m.qty} ${m.unit}/sp</span></div><div class="col-span-1 text-slate-400">×${used} ${m.unit}</div><div class="col-span-1 text-amber-300 font-mono">${formatCurrency(m.cost)}</div><div class="col-span-1 text-orange-300 font-mono">${formatCurrency(cost)}</div></div>`; });
    html += `<div class="text-right text-xs mt-1"><span class="text-amber-400 font-bold">Tổng NVL: ${formatCurrency(totalMaterial)}</span></div>`; table.innerHTML = html;
    document.getElementById('fnb-total-material-cost').textContent = formatCurrency(totalMaterial);
}

function updateSalesPreview() {
    const vatRate = parseFloat(document.getElementById('sales-vat-rate')?.value) || 0; const payment = document.getElementById('sales-payment')?.value || '111';
    const salesType = document.getElementById('sales-type')?.value || 'retail'; const invAcct = salesType === 'fnb' ? (document.getElementById('sales-inventory-account')?.value || '152') : '156';
    let totalRevenue = 0, totalCogs = 0; const dGroups = {}, cGroups = {};
    document.querySelectorAll('.sales-item-row').forEach(r => { const rev = parseFloat(r.querySelector('.sales-prod-revenue')?.value) || 0; const cogs = parseFloat(r.querySelector('.sales-prod-cogs')?.value) || 0; const db = r.querySelector('.sales-debit-cogs')?.value || '632'; const cr = r.querySelector('.sales-credit-cogs')?.value || invAcct; totalRevenue += rev; totalCogs += cogs; if (cogs > 0) { dGroups[db] = (dGroups[db] || 0) + cogs; cGroups[cr] = (cGroups[cr] || 0) + cogs; } });
    const beforeVAT = Math.round(totalRevenue / (1 + vatRate / 100)), vatAmount = totalRevenue - beforeVAT, grossProfit = beforeVAT - totalCogs;
    document.getElementById('sales-revenue').textContent = formatCurrency(beforeVAT); document.getElementById('sales-vat-amount').textContent = formatCurrency(vatAmount);
    document.getElementById('sales-cogs').textContent = formatCurrency(totalCogs); const gpEl = document.getElementById('sales-gross-profit'); if (gpEl) gpEl.textContent = formatCurrency(grossProfit);
    const fTotalMat = document.getElementById('fnb-total-material-cost'); if (fTotalMat) fTotalMat.textContent = formatCurrency(totalCogs);
    const fCogs = document.getElementById('fnb-total-cogs'); if (fCogs) fCogs.textContent = formatCurrency(totalCogs);
    const fcPct = document.getElementById('fnb-food-cost-pct'); if (fcPct) fcPct.textContent = beforeVAT > 0 ? Math.round(totalCogs / beforeVAT * 100) + '%' : '0%';
    const pc = document.getElementById('sales-preview-content'); if (!pc) return; let html = '';
    document.querySelectorAll('.sales-item-row').forEach((r,i) => { const rev = parseFloat(r.querySelector('.sales-prod-revenue')?.value) || 0, cogs = parseFloat(r.querySelector('.sales-prod-cogs')?.value) || 0; const qty = r.querySelector('.sales-prod-qty')?.value || 0; const name = r.querySelector('.sales-prod-select')?.selectedOptions[0]?.textContent || '(Chưa chọn)'; const db = r.querySelector('.sales-debit-cogs')?.value || '632', cr = r.querySelector('.sales-credit-cogs')?.value || invAcct; if (rev > 0) html += `<div class="mb-2 p-2 bg-slate-700/30 rounded text-xs"><span class="text-slate-400">#[${i+1}] ${name} (SL:${qty})</span><br><span class="text-green-400">Doanh thu:  Nợ ${getAccountName(payment)}  ${formatCurrency(rev)}</span> &nbsp;|&nbsp; <span class="text-orange-400">Giá vốn: Nợ ${getAccountName(db)} / Có ${getAccountName(cr)}: ${formatCurrency(cogs)}</span></div>`; });
    if (totalRevenue > 0) { html += `<div class="mt-3 pt-2 border-t border-slate-600 text-xs space-y-1"><p class="text-slate-400 font-semibold">📊 Định khoản tổng hợp:</p><p class="text-green-400">➤ <strong>Doanh thu:</strong> Nợ ${getAccountName(payment)}: ${formatCurrency(totalRevenue)} / Có TK 511: ${formatCurrency(beforeVAT)} | Có TK 3331: ${formatCurrency(vatAmount)}</p>`; for (const [acc, amt] of Object.entries(dGroups)) html += `<p class="text-green-400">➤ <strong>Giá vốn:</strong> Nợ ${getAccountName(acc)}: ${formatCurrency(amt)}</p>`; for (const [acc, amt] of Object.entries(cGroups)) html += `<p class="text-red-400">➤ Có ${getAccountName(acc)}: ${formatCurrency(amt)}</p>`; html += `<p class="text-purple-400 mt-1"><strong>${salesType === 'fnb' ? '🍽️' : '🛍️'} Lợi nhuận gộp: ${formatCurrency(grossProfit)}</strong> | Biên: ${beforeVAT>0?Math.round(grossProfit/beforeVAT*100):0}%</p></div>`; }
    pc.innerHTML = html || '<p class="text-slate-300 italic text-xs">Vui lòng thêm ít nhất một mặt hàng!</p>';
}

function handleSalesSubmit(e) {
    e.preventDefault(); const date = document.getElementById('sales-date')?.value, pid = document.getElementById('sales-partner')?.value, partner = store.partners.find(p => p.id === pid);
    const payment = document.getElementById('sales-payment')?.value, salesType = document.getElementById('sales-type')?.value, vatRate = parseFloat(document.getElementById('sales-vat-rate')?.value) || 0, invoice = document.getElementById('sales-invoice')?.value || '';
    const invAcct = salesType === 'fnb' ? (document.getElementById('sales-inventory-account')?.value || '152') : '156';
    const items = []; let totalRevenue = 0, totalCogs = 0;
    document.querySelectorAll('.sales-item-row').forEach(r => { const prodId = r.querySelector('.sales-prod-select')?.value, prod = store.products.find(p => p.id === prodId); const qty = parseFloat(r.querySelector('.sales-prod-qty')?.value) || 0, sellPrice = parseFloat(r.querySelector('.sales-prod-price')?.value) || 0; const revenue = parseFloat(r.querySelector('.sales-prod-revenue')?.value) || 0, cogs = parseFloat(r.querySelector('.sales-prod-cogs')?.value) || 0; const debitRevenue = r.querySelector('.sales-debit-revenue')?.value || payment; const debitCogs = r.querySelector('.sales-debit-cogs')?.value || '632'; const credit = r.querySelector('.sales-credit-cogs')?.value || invAcct; totalRevenue += revenue; totalCogs += cogs; if (revenue > 0) items.push({ productId: prodId || '', productName: prod ? `${prod.code} - ${prod.name}` : '(Chưa chọn)', qty, sellPrice, costPrice: prod?.costPrice || 0, revenue, cogs, debitRevenue, debitCogs, credit, recipe: fnbRecipes[prodId] || null }); });
    if (!date) { alert('Nhập ngày.'); return; } if (items.length === 0) { alert('Thêm ít nhất 1 mặt hàng.'); return; }
    const beforeVAT = Math.round(totalRevenue / (1 + vatRate / 100)), vatAmount = totalRevenue - beforeVAT;
    const voucher = { id: Date.now().toString(), number: 'HD' + String(store.voucherCounters.receive + 1).padStart(4, '0'), date, partner: partner ? partner.name : 'Khách lẻ', partnerId: pid || '', payment, salesType, vatRate, invoice, items, invAcct, totalRevenue, beforeVAT, vatAmount, totalCogs, grossProfit: beforeVAT - totalCogs, createdAt: new Date().toISOString() };
    store.vouchers.receive.push({ ...voucher, type: 'sales', totalAmount: totalRevenue });
    store.vouchers.export.push({ ...voucher, type: 'sales', totalAmount: totalCogs, creditAccount: invAcct }); saveStore(store);
    alert(`✅ Hóa đơn ${voucher.number} đã lưu!\nLoại: ${salesType==='retail'?'🛍️ Retail':'🍽️ F&B'}\nDoanh thu: ${formatCurrency(totalRevenue)}\nGiá vốn: ${formatCurrency(totalCogs)} (TK ${invAcct})\nLợi nhuận gộp: ${formatCurrency(voucher.grossProfit)}`);
    document.getElementById('form-sales')?.reset(); document.getElementById('sales-items').innerHTML = ''; addSalesItemRow(); updateSalesPreview(); document.getElementById('sales-date').value = todayStr();
}

// ==================== SỔ NHẬT KÝ CHUNG ====================
function initJournalPage() {
    store = loadStore();
    document.getElementById('journal-from').value = todayStr();
    document.getElementById('journal-to').value = todayStr();
    const filterDebit = document.getElementById('journal-filter-debit');
    const filterCredit = document.getElementById('journal-filter-credit');
    if (filterDebit) store.accounts.forEach(a => { const o = document.createElement('option'); o.value = a.id; o.textContent = `${a.id} - ${a.name}`; filterDebit.appendChild(o); });
    if (filterCredit) store.accounts.forEach(a => { const o = document.createElement('option'); o.value = a.id; o.textContent = `${a.id} - ${a.name}`; filterCredit.appendChild(o); });
    updateJournalData();
}
function updateJournalData() {
    const tbody = document.getElementById('journal-entries');
    const totalEl = document.getElementById('journal-total');
    if (!tbody || !totalEl) return;
    const from = document.getElementById('journal-from')?.value || '';
    const to = document.getElementById('journal-to')?.value || '';
    const fd = document.getElementById('journal-filter-debit')?.value || '';
    const fc = document.getElementById('journal-filter-credit')?.value || '';
    let all = [];
    ['receive','pay','import','export'].forEach(type => {
        (store.vouchers[type]||[]).forEach(v => {
            const dt = v.date || '';
            if (from && dt < from) return; if (to && dt > to) return;
            (v.entries||v.items||v.rows||[]).forEach((e, idx) => {
                const db = e.debit||'', cr = e.credit||'';
                if (fd && db !== fd) return; if (fc && cr !== fc) return;
                all.push({ date: dt, number: v.number||'', desc: e.desc||v.partner||v.reason||'', debit: db, credit: cr, amount: e.amount||0 });
            });
        });
    });
    all.sort((a,b) => a.date.localeCompare(b.date) || a.number.localeCompare(b.number));
    let html = '', total = 0;
    all.forEach(e => { total += e.amount; html += `<tr class="hover:bg-slate-800/50"><td class="px-4 py-2">${e.date}</td><td class="px-4 py-2">${e.number}</td><td class="px-4 py-2">${e.desc}</td><td class="px-4 py-2 text-green-400">${e.debit ? getAccountName(e.debit) : ''}</td><td class="px-4 py-2 text-red-400">${e.credit ? getAccountName(e.credit) : ''}</td><td class="px-4 py-2 text-right font-mono">${formatCurrency(e.amount)}</td></tr>`; });
    tbody.innerHTML = html || '<tr><td colspan="6" class="px-4 py-8 text-center text-slate-500 text-xs italic">Chưa có dữ liệu.</td></tr>';
    totalEl.textContent = formatCurrency(total);
}

// ==================== SỔ CHI TIẾT TÀI KHOẢN ====================
// Opening balance data per account (simulated)
const openingBalances = {
    '111': 50000000, '112': 200000000, '131': 15000000, '133': 0, '141': 0,
    '152': 25000000, '153': 5000000, '156': 80000000,
    '331': 30000000, '3331': 0, '334': 0, '338': 0,
    '421': 0, '511': 0, '911': 0, '632': 0, '641': 0, '642': 0,
};
function initLedgerPage() {
    store = loadStore();
    document.getElementById('ledger-from').value = todayStr();
    document.getElementById('ledger-to').value = todayStr();
    const sel = document.getElementById('ledger-account');
    if (sel) { store.accounts.forEach(a => { const o = document.createElement('option'); o.value = a.id; o.textContent = `${a.id} - ${a.name}`; sel.appendChild(o); }); }
    updateLedgerData();
}
function updateLedgerData() {
    const tbody = document.getElementById('ledger-entries');
    const acctId = document.getElementById('ledger-account')?.value;
    const from = document.getElementById('ledger-from')?.value || '';
    const to = document.getElementById('ledger-to')?.value || '';
    if (!acctId || !tbody) { tbody.innerHTML = '<tr><td colspan="6" class="px-4 py-8 text-center text-slate-500 text-xs italic">Chọn tài khoản.</td></tr>'; return; }
    let all = [];
    ['receive','pay','import','export'].forEach(type => {
        (store.vouchers[type]||[]).forEach(v => {
            const dt = v.date || '';
            if (from && dt < from) return; if (to && dt > to) return;
            (v.entries||v.items||v.rows||[]).forEach((e, idx) => {
                if (e.debit === acctId || e.credit === acctId) {
                    all.push({ date: dt, number: v.number||'', desc: e.desc||v.partner||v.reason||'', debit: e.debit||'', credit: e.credit||'', amount: e.amount||0 });
                }
            });
        });
    });
    all.sort((a,b) => a.date.localeCompare(b.date) || a.number.localeCompare(b.number));
    const opBal = openingBalances[acctId] || 0;
    let html = '', totalDebit = 0, totalCredit = 0, runningBalance = opBal;
    // Opening balance row
    html += `<tr class="bg-slate-800/30"><td class="px-4 py-2"></td><td class="px-4 py-2"></td><td class="px-4 py-2 text-slate-400 italic">Số dư đầu kỳ</td><td class="px-4 py-2"></td><td class="px-4 py-2 text-right font-mono"></td><td class="px-4 py-2 text-right font-mono"></td></tr>`;
    all.forEach(e => {
        const isDebit = e.debit === acctId;
        if (isDebit) { totalDebit += e.amount; runningBalance += e.amount; }
        else { totalCredit += e.amount; runningBalance -= e.amount; }
        html += `<tr class="hover:bg-slate-800/50"><td class="px-4 py-2 text-xs">${e.date}</td><td class="px-4 py-2 text-xs">${e.number}</td><td class="px-4 py-2 text-xs">${e.desc}</td><td class="px-4 py-2 text-xs">${isDebit ? getAccountName(e.credit) : getAccountName(e.debit)}</td><td class="px-4 py-2 text-right font-mono text-xs ${isDebit?'text-green-400':''}">${isDebit ? formatCurrency(e.amount) : ''}</td><td class="px-4 py-2 text-right font-mono text-xs ${!isDebit?'text-red-400':''}">${!isDebit ? formatCurrency(e.amount) : ''}</td></tr>`;
    });
    tbody.innerHTML = html || '<tr><td colspan="6" class="px-4 py-8 text-center text-slate-500 text-xs italic">Không có phát sinh.</td></tr>';
    document.getElementById('ledger-op-balance').textContent = formatCurrency(opBal);
    document.getElementById('ledger-debit-total').textContent = formatCurrency(totalDebit);
    document.getElementById('ledger-credit-total').textContent = formatCurrency(totalCredit);
    document.getElementById('ledger-cl-balance').textContent = formatCurrency(runningBalance);
}

// ==================== KHÓA/MỞ SỔ ====================
function initLockPeriodPage() {
    store = loadStore();
    if (!store.lockedPeriods) store.lockedPeriods = [
        { id: '2025-12', period: 'Tháng 12/2025', status: 'locked', lockedAt: '2025-12-31', lockedBy: 'Kế toán trưởng', reason: '' },
        { id: '2026-01', period: 'Tháng 01/2026', status: 'open', lockedAt: '', lockedBy: '', reason: '' },
        { id: '2026-02', period: 'Tháng 02/2026', status: 'open', lockedAt: '', lockedBy: '', reason: '' },
        { id: '2026-03', period: 'Tháng 03/2026', status: 'open', lockedAt: '', lockedBy: '', reason: '' },
    ];
    renderLockPeriodRows();
}
function renderLockPeriodRows() {
    const c = document.getElementById('lock-period-rows'); if (!c) return;
    c.innerHTML = '';
    (store.lockedPeriods||[]).forEach(p => {
        const row = document.createElement('div');
        row.className = 'grid grid-cols-5 gap-2 items-center p-4 bg-slate-800/40 rounded';
        row.innerHTML = `<div class="text-slate-200 text-sm font-medium">${p.period}</div>
        <div><span class="px-2 py-1 rounded text-xs font-semibold ${p.status==='locked'?'bg-red-600/20 text-red-400':'bg-green-600/20 text-green-400'}">${p.status==='locked'?'🔒 Đã khóa':'🔓 Đang mở'}</span></div>
        <div class="text-xs text-slate-400">${p.lockedAt||'—'}</div>
        <div class="text-xs text-slate-500">${p.lockedBy||''}${p.reason?' — Lý do: '+p.reason:''}</div>
        <div><button onclick="toggleLockPeriod('${p.id}')" class="px-3 py-1 rounded text-xs font-semibold ${p.status==='locked'?'bg-green-600/20 hover:bg-green-600/30 text-green-400':'bg-red-600/20 hover:bg-red-600/30 text-red-400'} transition-all">${p.status==='locked'?'Mở sổ':'Khóa sổ'}</button></div>`;
        c.appendChild(row);
    });
}
function toggleLockPeriod(id) {
    const periods = store.lockedPeriods||[];
    const p = periods.find(x => x.id === id);
    if (!p) return;
    const idx = periods.indexOf(p);
    if (p.status === 'locked') {
        // UNLOCK: must unlock in reverse chronological order (latest locked first)
        const laterLocked = (store.lockedPeriods||[]).filter((x, i) => i > idx && x.status === 'locked');
        if (laterLocked.length > 0) {
            alert(`⚠️ Không thể mở sổ ${p.period} khi các kỳ sau vẫn đang khóa:\n${laterLocked.map(x => '• ' + x.period).join('\n')}\n\nPhải mở sổ từ kỳ gần nhất trước.`);
            return;
        }
        const reason = prompt('🔓 Nhập lý do MỞ LẠI sổ (bắt buộc theo Điều 13 TT 99):');
        if (!reason || !reason.trim()) { alert('⚠️ Phải có lý do khi mở lại sổ đã khóa (Điều 13 TT 99/2025/TT-BTC).'); return; }
        const confirmer = prompt('👤 Người phê duyệt mở sổ:');
        if (!confirmer || !confirmer.trim()) { alert('⚠️ Phải có người phê duyệt (cấp có thẩm quyền).'); return; }
        p.status = 'open'; p.lockedAt = ''; p.reason = reason.trim(); p.lockedBy = '';
        alert(`✅ Đã mở sổ ${p.period}\nLý do: ${reason.trim()}\nNgười phê duyệt: ${confirmer.trim()}`);
    } else {
        // LOCK: must lock in chronological order (all earlier periods must be locked first)
        const earlierOpen = (store.lockedPeriods||[]).filter((x, i) => i < idx && x.status === 'open');
        if (earlierOpen.length > 0) {
            alert(`⚠️ Không thể khóa sổ ${p.period} khi các kỳ trước vẫn đang mở:\n${earlierOpen.map(x => '• ' + x.period).join('\n')}\n\nPhải khóa sổ tuần tự từ kỳ cũ nhất.`);
            return;
        }
        if (!confirm(`🔒 Xác nhận KHÓA SỔ ${p.period}?\n\nĐiều kiện theo Điều 13 TT 99/2025/TT-BTC:\n• Đã hoàn tất kết chuyển cuối kỳ\n• Đã kiểm tra cân đối số liệu\n• Tất cả nghiệp vụ đã được ghi sổ đầy đủ\n\nXác nhận khóa sổ?`)) return;
        const confirmer = prompt('👤 Người phê duyệt khóa sổ:');
        if (!confirmer || !confirmer.trim()) { alert('⚠️ Phải có người phê duyệt (cấp có thẩm quyền).'); return; }
        p.status = 'locked'; p.lockedAt = new Date().toISOString().split('T')[0]; p.lockedBy = confirmer.trim(); p.reason = '';
        alert(`🔒 Đã khóa sổ ${p.period}\nNgười phê duyệt: ${confirmer.trim()}\nNgày khóa: ${p.lockedAt}`);
    }
    saveStore(store); renderLockPeriodRows();
}

// ==================== KẾT CHUYỂN CUỐI KỲ ====================
function initClosingPage() {
    updateClosingPreview();
    document.getElementById('form-closing')?.addEventListener('submit', (e) => { e.preventDefault(); handleClosingSubmit(); });
}
function updateClosingPreview() {
    const rev = parseFloat(document.getElementById('closing-511')?.value) || 0;
    const cogs = parseFloat(document.getElementById('closing-632')?.value) || 0;
    const sellCost = parseFloat(document.getElementById('closing-641')?.value) || 0;
    const adminCost = parseFloat(document.getElementById('closing-642')?.value) || 0;
    const totalCost = cogs + sellCost + adminCost;
    const profit = rev - totalCost;
    document.getElementById('closing-total-revenue').textContent = formatCurrency(rev);
    document.getElementById('closing-total-cost').textContent = formatCurrency(totalCost);
    document.getElementById('closing-net-profit').textContent = formatCurrency(profit);

    const ct = document.getElementById('closing-type')?.value || 'all';
    const pc = document.getElementById('closing-preview-content');
    if (!pc) return;
    let html = '';
    const add = (db, cr, amt, desc) => { if (amt > 0) html += `<div class="mb-2 p-2 bg-slate-700/30 rounded text-xs"><span class="text-slate-400">${desc}</span><br><span class="text-green-400">Nợ ${getAccountName(db)}:</span> <span class="text-white font-mono">${formatCurrency(amt)}</span> &nbsp;|&nbsp; <span class="text-red-400">Có ${getAccountName(cr)}:</span> <span class="text-white font-mono">${formatCurrency(amt)}</span></div>`; };
    if (ct === 'all' || ct === 'revenue') { add('511', '911', rev, 'Kết chuyển doanh thu thuần → TK 911'); }
    if (ct === 'all' || ct === 'cost') { add('911', '632', cogs, 'Kết chuyển giá vốn hàng bán'); add('911', '641', sellCost, 'Kết chuyển chi phí bán hàng'); add('911', '642', adminCost, 'Kết chuyển chi phí QLKD'); }
    if (ct === 'all' || ct === 'profit') {
        if (profit > 0) add('911', '421', profit, 'Kết chuyển lãi → Lợi nhuận chưa phân phối');
        else if (profit < 0) add('421', '911', -profit, 'Kết chuyển lỗ → Lợi nhuận chưa phân phối');
        else html += '<p class="text-slate-300 italic text-xs">Hòa vốn — không phát sinh kết chuyển KQKD.</p>';
    }
    pc.innerHTML = html || '<p class="text-slate-300 italic text-xs">Không có bút toán nào.</p>';
}
function handleClosingSubmit() {
    const period = document.getElementById('closing-period')?.value;
    const date = document.getElementById('closing-date')?.value || '';
    const rev = parseFloat(document.getElementById('closing-511')?.value) || 0;
    const cogs = parseFloat(document.getElementById('closing-632')?.value) || 0;
    const sellCost = parseFloat(document.getElementById('closing-641')?.value) || 0;
    const adminCost = parseFloat(document.getElementById('closing-642')?.value) || 0;
    const totalCost = cogs + sellCost + adminCost;
    const profit = rev - totalCost;
    const entries = [];
    if (rev > 0) entries.push({ desc: 'KC Doanh thu', debit: '511', credit: '911', amount: rev });
    if (cogs > 0) entries.push({ desc: 'KC Giá vốn', debit: '911', credit: '632', amount: cogs });
    if (sellCost > 0) entries.push({ desc: 'KC CP bán hàng', debit: '911', credit: '641', amount: sellCost });
    if (adminCost > 0) entries.push({ desc: 'KC CP QLKD', debit: '911', credit: '642', amount: adminCost });
    if (profit > 0) entries.push({ desc: 'KC Lãi', debit: '911', credit: '421', amount: profit });
    else if (profit < 0) entries.push({ desc: 'KC Lỗ', debit: '421', credit: '911', amount: -profit });
    if (!date) { alert('Nhập ngày tháng kết chuyển.'); return; }
    const voucher = { id: Date.now().toString(), number: 'KC' + String(new Date().getTime()).slice(-6), date, period, entries, totalAmount: entries.reduce((s,e)=>s+e.amount,0), createdAt: new Date().toISOString() };
    store.vouchers.receive.push({ ...voucher, type: 'closing' });
    saveStore(store);
    alert(`✅ Kết chuyển ${voucher.number} đã lưu!\nLợi nhuận: ${formatCurrency(profit)}`);
}

// ==================== CẤU HÌNH KẾT CHUYỂN ====================
function initClosingConfigPage() { store = loadStore(); if (!store.closingConfigs) store.closingConfigs = []; renderClosingConfigRows(); }
function addClosingConfigRow() {
    const c = document.getElementById('closing-config-items'); if (!c) return;
    const row = document.createElement('div');
    row.className = 'closing-config-row grid grid-cols-6 gap-2 items-center p-2 bg-slate-800/40 rounded';
    row.innerHTML = `<select class="col-span-1 config-debit w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs focus:outline-none focus:border-cyan-500">${store.accounts.map(a=>`<option value="${a.id}">${a.id} - ${a.name}</option>`).join('')}</select>
    <select class="col-span-1 config-credit w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs focus:outline-none focus:border-cyan-500">${store.accounts.map(a=>`<option value="${a.id}">${a.id} - ${a.name}</option>`).join('')}</select>
    <select class="col-span-1 config-type w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs focus:outline-none focus:border-cyan-500"><option value="revenue">Doanh thu→911</option><option value="cost">911→Chi phí</option><option value="profit">911→421</option></select>
    <input type="text" class="col-span-2 config-desc w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs focus:outline-none focus:border-cyan-500" placeholder="Diễn giải">
    <button type="button" onclick="this.closest('.closing-config-row').remove()" class="col-span-1 text-red-400 hover:text-red-300 text-xs">✕ Xóa</button>`;
    c.appendChild(row);
}
function renderClosingConfigRows() {
    const c = document.getElementById('closing-config-items'); if (!c) return;
    c.innerHTML = '';
    (store.closingConfigs||[]).forEach(cfg => { addClosingConfigRow(); const last = c.lastElementChild; if (!last) return; last.querySelector('.config-debit').value = cfg.debit; last.querySelector('.config-credit').value = cfg.credit; last.querySelector('.config-type').value = cfg.type; last.querySelector('.config-desc').value = cfg.desc||''; });
    if ((store.closingConfigs||[]).length === 0) addClosingConfigRow();
}
function saveClosingConfig() {
    const configs = [];
    document.querySelectorAll('.closing-config-row').forEach(r => { const db = r.querySelector('.config-debit')?.value, cr = r.querySelector('.config-credit')?.value, tp = r.querySelector('.config-type')?.value, desc = r.querySelector('.config-desc')?.value; if (db && cr && tp) configs.push({ debit: db, credit: cr, type: tp, desc }); });
    store.closingConfigs = configs; saveStore(store); alert('✅ Đã lưu ' + configs.length + ' cấu hình kết chuyển.');
}

// ==================== BOOTSTRAP ====================
function getCurrentPageType() { const p = window.location.pathname; if (p.includes('voucher-receive')) return 'receive'; if (p.includes('voucher-pay')) return 'pay'; if (p.includes('voucher-import')) return 'import'; if (p.includes('voucher-export')) return 'export'; if (p.includes('voucher-sales')) return 'sales'; if (p.includes('journal')) return 'journal'; if (p.includes('ledger')) return 'ledger'; if (p.includes('closing-config')) return 'closing-config'; if (p.includes('closing')) return 'closing'; if (p.includes('lock-period')) return 'lock-period'; return null; }
document.addEventListener('DOMContentLoaded', () => { store = loadStore(); const pt = getCurrentPageType(); switch (pt) { case 'receive': initReceivePage(); document.getElementById('form-receive')?.addEventListener('submit', handleReceiveSubmit); break; case 'pay': initPayPage(); document.getElementById('form-pay')?.addEventListener('submit', handlePaySubmit); break; case 'import': initImportPage(); document.getElementById('form-import')?.addEventListener('submit', handleImportSubmit); break; case 'export': initExportPage(); document.getElementById('form-export')?.addEventListener('submit', handleExportSubmit); break; case 'sales': initSalesPage(); document.getElementById('form-sales')?.addEventListener('submit', handleSalesSubmit); break; case 'journal': initJournalPage(); break; case 'ledger': initLedgerPage(); break; case 'closing-config': initClosingConfigPage(); break; case 'closing': initClosingPage(); break; case 'lock-period': initLockPeriodPage(); break; } document.getElementById('form-add-partner')?.addEventListener('submit', handleAddPartner); });
