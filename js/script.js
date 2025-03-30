document.addEventListener('DOMContentLoaded', function() {
    const uploadInput = document.getElementById('upload');
    const previewImage = document.getElementById('previewImage');
    const imagePreview = document.getElementById('imagePreview');
    const nameInput = document.getElementById('nameInput');
    const generateBtn = document.getElementById('generateBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const outputImage = document.getElementById('outputImage');

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
            alert('Please upload an image first');
            return;
        }

        if (!nameInput.value) {
            alert('Please enter your name');
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
                ctx.drawImage(templateImg, 0, 0);
                
                ctx.font = 'bold 28px Poppins';
                ctx.fillStyle = '#000000';
                ctx.textAlign = 'center';
                ctx.fillText(nameInput.value, canvas.width / 2, 400);
                
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