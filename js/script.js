document.addEventListener('DOMContentLoaded', function() {
    const uploadInput = document.getElementById('upload');
    const previewImage = document.getElementById('previewImage');
    const imagePreview = document.getElementById('imagePreview');
    const nameInput = document.getElementById('nameInput');
    const generateBtn = document.getElementById('generateBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const outputImage = document.getElementById('outputImage');
    const cropCheckbox = document.createElement('input');
    cropCheckbox.type = 'checkbox';
    cropCheckbox.id = 'cropCheckbox';
    
    const cropLabel = document.createElement('label');
    cropLabel.htmlFor = 'cropCheckbox';
    cropLabel.textContent = ' اقتصاص الصورة إلى 445×470';
    cropLabel.style.marginLeft = '5px';
    cropLabel.style.color = '#fff';
    
    const cropContainer = document.createElement('div');
    cropContainer.style.margin = '15px 0';
    cropContainer.appendChild(cropCheckbox);
    cropContainer.appendChild(cropLabel);
    
    document.querySelector('.card-body').insertBefore(cropContainer, generateBtn);

    uploadInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                previewImage.src = event.target.result;
                imagePreview.classList.remove('d-none');
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

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        const templateImg = new Image();
        templateImg.src = 'images/template.png';
        
        templateImg.onload = function() {
            canvas.width = templateImg.width;
            canvas.height = templateImg.height;
            
            const userImg = new Image();
            userImg.src = previewImage.src;
            
            userImg.onload = function() {
                if (cropCheckbox.checked) {
                    const cropWidth = 445;
                    const cropHeight = 470;
                    
                    const cropCanvas = document.createElement('canvas');
                    cropCanvas.width = cropWidth;
                    cropCanvas.height = cropHeight;
                    const cropCtx = cropCanvas.getContext('2d');
                    
                    const sourceAspect = userImg.width / userImg.height;
                    const cropAspect = cropWidth / cropHeight;
                    
                    let sourceX = 0, sourceY = 0, sourceWidth = userImg.width, sourceHeight = userImg.height;
                    
                    if (sourceAspect > cropAspect) {
                        sourceWidth = userImg.height * cropAspect;
                        sourceX = (userImg.width - sourceWidth) / 2;
                    } else {
                        sourceHeight = userImg.width / cropAspect;
                        sourceY = (userImg.height - sourceHeight) / 2;
                    }
                    
                    cropCtx.drawImage(userImg, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, cropWidth, cropHeight);
                    
                    const posX = canvas.width - cropWidth - 340;
                    const posY = canvas.height - cropHeight - 470;
                    
                    ctx.drawImage(cropCanvas, posX, posY, cropWidth, cropHeight);
                } else {
                    const userAspect = userImg.width / userImg.height;
                    const templateAspect = templateImg.width / templateImg.height;
                    
                    let drawWidth, drawHeight, offsetX = 0, offsetY = 0;
                    
                    if (userAspect > templateAspect) {
                        drawHeight = canvas.height;
                        drawWidth = drawHeight * userAspect;
                        offsetX = (canvas.width - drawWidth) / 2;
                    } else {
                        drawWidth = canvas.width;
                        drawHeight = drawWidth / userAspect;
                        offsetY = (canvas.height - drawHeight) / 2;
                    }
                    
                    ctx.drawImage(userImg, offsetX, offsetY, drawWidth, drawHeight);
                }
                
                ctx.drawImage(templateImg, 0, 0);
                
                ctx.font = 'bold 40px Arial';
                ctx.fillStyle = 'blue';
                ctx.textAlign = 'center';
                ctx.fillText(nameInput.value, canvas.width / 2, 400 + 260);
                
                outputImage.src = canvas.toDataURL('image/png');
                downloadBtn.disabled = false;
            };
        };
    });

    downloadBtn.addEventListener('click', function() {
        const link = document.createElement('a');
        link.download = 'ieee-profile.png';
        link.href = outputImage.src;
        link.click();
    });
});