const API_URL = "https://script.google.com/macros/s/AKfycbz59ti95uR_PXE45buQcGBwYDxIkBhyF0liRhwOTNborRZD4fCRNZXD5Pkchp7ieEcD/exec"; // استبدل برابط نشر السكريبت

async function getPole() {
  const poleId = document.getElementById("poleId").value;
  if (!poleId) return alert("يجب إدخال رقم العمود");
  
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({ action: "get_pole", data: { id: poleId } }),
    });
    
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    
    displayPole(result.data);
  } catch (error) {
    alert("خطأ: " + error.message);
  }
}

function displayPole(data) {
  document.getElementById("displayId").textContent = data.id;
  document.getElementById("poleDetails").style.display = "block";
  
  // عرض بيانات المراحل إن وجدت
  if (data.phase1_date) {
    document.getElementById("phase1Date").value = data.phase1_date;
    document.getElementById("phase1").classList.add("completed");
  }
  // ... (كرر للمراحل الأخرى)
}

async function updatePhase(phase) {
  const poleId = document.getElementById("poleId").value;
  const date = document.getElementById(`phase${phase}Date`).value;
  const imageFile = document.getElementById(`phase${phase}Image`).files[0];
  
  if (!date || !imageFile) return alert("يجب إدخال التاريخ والصورة");
  
  try {
    // رفع الصورة إلى ImgBB
    const imageUrl = await uploadImage(imageFile);
    
    const response = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({
        action: "update_phase",
        data: { id: poleId, phase, date, imageUrl }
      }),
    });
    
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    
    alert("تم تحديث المرحلة بنجاح!");
    document.getElementById(`phase${phase}`).classList.add("completed");
  } catch (error) {
    alert("خطأ: " + error.message);
  }
}

async function uploadImage(file) {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  
  return new Promise((resolve) => {
    reader.onload = async () => {
      const base64 = reader.result.split(",")[1];
      const response = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({
          action: "upload_image",
          data: { image: base64 }
        }),
      });
      
      const result = await response.json();
      resolve(result.data.url);
    };
  });
}

function exportPDF() {
  const poleId = document.getElementById("poleId").value;
  // يمكنك تطوير هذه الوظيفة لإنشاء PDF باستخدام مكتبة مثل jsPDF
  alert("سيتم تصدير PDF للعمود: " + poleId);
}
