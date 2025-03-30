document.addEventListener('DOMContentLoaded', function() {
    const uploadInput = document.getElementById('upload');
    const previewImage = document.getElementById('previewImage');
    const imagePreview = document.getElementById('imagePreview');
    const nameInput = document.getElementById('nameInput');
    const generateBtn = document.getElementById('generateBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const outputImage = document.getElementById('outputImage');

    // Handle image upload and preview
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

    // Generate the final image
    generateBtn.addEventListener('click', function() {
        if (!previewImage.src || previewImage.src.includes('template.png')) {
            alert('Please upload an image first');
            return;
        }

        if (!nameInput.value) {
            alert('Please enter your name');
            return;
        }

        // Create a canvas to combine everything
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Load template image
        const templateImg = new Image();
        templateImg.src = 'images/template.png';
        
        templateImg.onload = function() {
            // Set canvas dimensions to match template
            canvas.width = templateImg.width;
            canvas.height = templateImg.height;
            
            // Draw template first
            ctx.drawImage(templateImg, 0, 0);
            
            // Load user's image
            const userImg = new Image();
            userImg.src = previewImage.src;
            
            userImg.onload = function() {
                // Coordinates and dimensions for user's image (adjust these!)
                const imgX = 150;      // X position of the placeholder in template
                const imgY = 120;      // Y position of the placeholder in template
                const imgWidth = 180;  // Width of the placeholder
                const imgHeight = 180; // Height of the placeholder
                
                // Draw user's image (with border-radius effect)
                ctx.save();
                ctx.beginPath();
                ctx.arc(imgX + imgWidth/2, imgY + imgHeight/2, imgWidth/2, 0, Math.PI * 2);
                ctx.closePath();
                ctx.clip();
                ctx.drawImage(userImg, imgX, imgY, imgWidth, imgHeight);
                ctx.restore();
                
                // Add user's name (adjust position as needed)
                ctx.font = 'bold 24px Poppins';
                ctx.fillStyle = '#000000'; // Black text color
                ctx.textAlign = 'center';
                
                // Name position (below the image)
                const nameX = imgX + imgWidth/2;
                const nameY = imgY + imgHeight + 40;
                
                ctx.fillText(nameInput.value, nameX, nameY);
                
                // Update the output image
                outputImage.src = canvas.toDataURL('image/png');
                downloadBtn.disabled = false;
            };
        };
    });

    // Handle download
    downloadBtn.addEventListener('click', function() {
        const link = document.createElement('a');
        link.download = 'ieee-profile.png';
        link.href = outputImage.src;
        link.click();
    });
});