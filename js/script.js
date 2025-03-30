document.addEventListener('DOMContentLoaded', function() {
    const uploadInput = document.getElementById('upload');
    const previewImage = document.getElementById('previewImage');
    const imagePreview = document.getElementById('imagePreview');
    const nameInput = document.getElementById('nameInput');
    const generateBtn = document.getElementById('generateBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const outputImage = document.getElementById('outputImage');
    
    let cropper;
    const requiredWidth = 445;
    const requiredHeight = 470;

    uploadInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                previewImage.src = event.target.result;
                imagePreview.classList.remove('d-none');
                
                // تهيئة أداة الاقتصاص
                if (cropper) {
                    cropper.destroy();
                }
                
                cropper = new Cropper(previewImage, {
                    aspectRatio: requiredWidth / requiredHeight,
                    viewMode: 1,
                    autoCropArea: 1,
                    responsive: true,
                    guides: true,
                    movable: false,
                    rotatable: false,
                    scalable: false,
                    zoomable: false,
                    cropBoxResizable: true,
                    minCropBoxWidth: requiredWidth,
                    minCropBoxHeight: requiredHeight,
                    ready() {
                        // تحديد منطقة الاقتصاص المطلوبة تلقائياً
                        const containerData = cropper.getContainerData();
                        const widthRatio = containerData.width / requiredWidth;
                        const heightRatio = containerData.height / requiredHeight;
                        const ratio = Math.min(widthRatio, heightRatio);
                        
                        cropper.setCropBoxData({
                            width: requiredWidth * ratio,
                            height: requiredHeight * ratio
                        });
                    }
                });
            };
            reader.readAsDataURL(file);
        }
    });

    generateBtn.addEventListener('click', function() {
        if (!previewImage.src || previewImage.src.includes('template.png')) {
            alert('الرجاء رفع صورة أولاً');
            return;
        }

        if (!nameInput.value) {
            alert('الرجاء إدخال الاسم');
            return;
        }

        if (!cropper) {
            alert('الرجاء تحديد منطقة الاقتصاص');
            return;
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        const templateImg = new Image();
        templateImg.src = 'images/template.png';
        
        templateImg.onload = function() {
            canvas.width = templateImg.width;
            canvas.height = templateImg.height;
            
            // الحصول على الصورة المقتطعة
            const croppedCanvas = cropper.getCroppedCanvas({
                width: requiredWidth,
                height: requiredHeight,
                fillColor: '#fff',
                imageSmoothingEnabled: true,
                imageSmoothingQuality: 'high'
            });
            
            const posX = canvas.width - requiredWidth - 340;
            const posY = canvas.height - requiredHeight - 470;
            
            ctx.drawImage(croppedCanvas, posX, posY, requiredWidth, requiredHeight);
            ctx.drawImage(templateImg, 0, 0);
            
            // إضافة النص
            ctx.font = 'bold 40px Arial';
            ctx.fillStyle = 'blue';
            ctx.textAlign = 'center';
            ctx.fillText(nameInput.value, canvas.width / 2, 660); // 400 + 260
            
            outputImage.src = canvas.toDataURL('image/png');
            downloadBtn.disabled = false;
        };
    });

    downloadBtn.addEventListener('click', function() {
        const link = document.createElement('a');
        link.download = 'ieee-profile.png';
        link.href = outputImage.src;
        link.click();
    });
});