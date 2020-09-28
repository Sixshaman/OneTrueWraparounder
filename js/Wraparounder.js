function wholeMod(num, modulo)
{
    return ((num % modulo) + modulo) % modulo;
}

function Init() 
{
    let canvas        = document.getElementById("CanvasWraparounder");
    let canvasContext = canvas.getContext("2d");

    let imageWidth  = 0;
    let imageHeight = 0;

    let useWraparound = true;

    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.hidden = true; 

    canvas.onclick = function(e)
    {
        let x = e.pageX - canvas.offsetLeft;
        let y = e.pageY - canvas.offsetTop;

        let contents = canvasContext.getImageData(0, 0, imageWidth, imageHeight);

        let fillColor   = [255, 0, 0, 255]; 
        let sourceColor = canvasContext.getImageData(x, y, 1, 1).data;
        
        if(fillColor[0] === sourceColor[0] && fillColor[1] === sourceColor[1] && fillColor[2] === sourceColor[2])
        {
            canvasContext.putImageData(contents, 0, 0);
            return;
        }

        let currPixelIndices = new Set([y * imageWidth + x]);
        while(currPixelIndices.size != 0)
        {
            let neighbourPixelIndices = new Set([]);
            for(const currPixelIndex of currPixelIndices)
            {
                let currX = Math.floor(currPixelIndex % imageHeight);
                let currY = Math.floor(currPixelIndex / imageHeight);

                let leftX   = currX - 1;
                let rightX  = currX + 1;
                let topY    = currY - 1;
                let bottomY = currY + 1;

                if(useWraparound)
                {
                    leftX   = wholeMod(leftX,   imageWidth);
                    rightX  = wholeMod(rightX,  imageWidth);
                    topY    = wholeMod(topY,    imageHeight);
                    bottomY = wholeMod(bottomY, imageHeight);
                }

                let leftElementIndex   = currY   * imageWidth + leftX;
                let rightElementIndex  = currY   * imageWidth + rightX;
                let topElementIndex    = topY    * imageWidth + currX;
                let bottomElementIndex = bottomY * imageWidth + currX;

                if(leftX >= 0)
                {
                    if(contents.data[4 * leftElementIndex + 0] === sourceColor[0] && contents.data[4 * leftElementIndex + 1] === sourceColor[1] && contents.data[4 * leftElementIndex + 2] === sourceColor[2])
                    {
                        neighbourPixelIndices.add(leftElementIndex);
                    }
                }

                if(rightX < imageWidth)
                {
                    if(contents.data[4 * rightElementIndex + 0] === sourceColor[0] && contents.data[4 * rightElementIndex + 1] === sourceColor[1] && contents.data[4 * rightElementIndex + 2] === sourceColor[2])
                    {
                        neighbourPixelIndices.add(rightElementIndex);
                    }
                }

                if(topY >= 0)
                {
                    if(contents.data[4 * topElementIndex + 0] === sourceColor[0] && contents.data[4 * topElementIndex + 1] === sourceColor[1] && contents.data[4 * topElementIndex + 2] === sourceColor[2])
                    {
                        neighbourPixelIndices.add(topElementIndex);
                    }
                }

                if(bottomY < imageHeight)
                {
                    if(contents.data[4 * bottomElementIndex + 0] === sourceColor[0] && contents.data[4 * bottomElementIndex + 1] === sourceColor[1] && contents.data[4 * bottomElementIndex + 2] === sourceColor[2])
                    {
                        neighbourPixelIndices.add(bottomElementIndex);
                    }
                }
            }

            for(const currPixelIndex of currPixelIndices)
            {
                contents.data[4 * currPixelIndex + 0] = fillColor[0];
                contents.data[4 * currPixelIndex + 1] = fillColor[1];
                contents.data[4 * currPixelIndex + 2] = fillColor[2];
                contents.data[4 * currPixelIndex + 3] = fillColor[3];
            }

            currPixelIndices = neighbourPixelIndices;
        }

        canvasContext.putImageData(contents, 0, 0);
    }

    let imageUpload = document.getElementById("UploadImage");
    imageUpload.onchange = function()
    {
        let imageFile = imageUpload.files[0];

        let fileReader = new FileReader();
        fileReader.onload = function()
        {
            canvas.hidden = false;

            let image    = new Image();
            image.onload = function()
            {
                canvas.clientWidth  = image.width;
                canvas.clientHeight = image.height;

                imageWidth  = image.width;
                imageHeight = image.height;
                
                canvasContext.drawImage(image, 0, 0);
            }
            image.src = fileReader.result;
        }

        fileReader.readAsDataURL(imageFile);
    }
    
    
}