let imageInfo = {}
let showNumbers = false
let showHover = true
let showChecker = false;
let showPixelBorder = true;

let colorHistory = []

const tools = ['pen', 'eraser']
let activeToolIndex = 0;

const pixelSize = 30
const canvasSize = {width: 32 * pixelSize, height: 32 * pixelSize}
function preload() {

    //Get the image information and then load the setup the drawing appplicaton
    let sp = new URLSearchParams(window.location.search)

    console.log(sp.get('id'))
    console.log(sp.get('name'))

    fetch(`/api/imageData?name=${sp.get('name')}&id=${sp.get('id')}`)
    .then(res => res.json())
    .then(json => {
        imageInfo = json
        console.log(imageInfo.name)
        document.getElementById("image-name").value = imageInfo.name
    })
}

let colorPicker;

const updateColorHistory = (color) => {
    // console.log(e.target.value)
    colorHistory.splice(0,0,color)

    colorHistory = [...colorHistory.slice(0, 10)]

    // console.log(colorHistory)

    updateColorHistoryButtons()

    
}

function setup() {

    console.log("Creating canvas...")
    let myCanvas = createCanvas(canvasSize.width, canvasSize.height)
    myCanvas.parent('canvas-wrapper')

    // colorPicker = createColorPicker('#ff0000')
    // colorPicker.position(canvasSize.width + 40, 30)
    // colorPicker.size(50, 50)
    // colorPicker.input(updateColorHistory)

    document.getElementById('colorpicker').addEventListener('blur', (e) => updateColorHistory(e.target.value))

    updateColorHistory("#ff0000")


}

function mouseDragged() {

    if (mouseX < canvasSize.height && mouseY < canvasSize.height) {
        
        let x = Math.floor(mouseX/pixelSize)
        let y = Math.floor(mouseY/pixelSize)

        // imageInfo.pixelInfo[32 * y + x] = colorPicker.color().levels
        // imageInfo.pixelInfo[32 * y + x] = colorHistory[0].substring(1)
        if (activeToolIndex == 0) {
            let colorValue = parseInt(document.getElementById('colorpicker').value.substring(1), 16)
            imageInfo.pixelInfo[32 * y + x] = [(colorValue & 0xff0000) >> 16, (colorValue & 0x00ff00) >> 8, (colorValue & 0xff), 255]    
        } else {
            imageInfo.pixelInfo[32 * y + x] = [255, 255, 255, 0]
        }
        
    }

}

function mouseClicked() {

    //Check if click is inside canvas
    // console.log(mouseX, mouseY)

    if (mouseX < canvasSize.height && mouseY < canvasSize.height) {
        
        let x = Math.floor(mouseX/pixelSize)
        let y = Math.floor(mouseY/pixelSize)

        // imageInfo.pixelInfo[32 * y + x] = colorPicker.color().levels
        // imageInfo.pixelInfo[32 * y + x] = colorHistory[0].substring(1)
        if (activeToolIndex == 0) {
            let colorValue = parseInt(document.getElementById('colorpicker').value.substring(1), 16)
            imageInfo.pixelInfo[32 * y + x] = [(colorValue & 0xff0000) >> 16, (colorValue & 0x00ff00) >> 8, (colorValue & 0xff), 255]    
        } else {
            imageInfo.pixelInfo[32 * y + x] = [255, 255, 255, 0]
        }
        
    }
}

const GRID_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'AA', 'BB', 'CC', 'DD', 'EE', 'FF']
function draw() {
    
    if (!showChecker) {
        fill('white')
        rect(0,0,canvasSize.width, canvasSize.height)
    }
    noFill()
    stroke((showPixelBorder) ? color(0,0,0,50) : color(0,0,0,0))
    strokeWeight(1)
    // console.log(imageInfo.pixelInfo)
    if (imageInfo.pixelInfo !== undefined) {
        //Draw the Grid
        for (let x = 0; x < 32; x++) {
            for (let y = 0; y < 32; y++) {
                //Get color from saved data file
                let colorData = imageInfo.pixelInfo[y * 32 + x]
                
                
                if (showChecker) {
                    push()
                    if (y % 2 === 0) {
                        fill((y * 32 + x) % 2 === 0 ? 'white' : 'grey')
                    } else {
                        fill((y * 32 + x) % 2 === 0 ? 'grey' : 'white')
                    }
                    
                    rect(x * pixelSize, y*pixelSize, pixelSize, pixelSize)
                    pop()
                }
                fill(color(colorData[0], colorData[1], colorData[2], colorData[3]))
                rect(x * pixelSize, y*pixelSize, pixelSize, pixelSize)
                
                if (showNumbers) {
                    push()
                    
                    let maxColor = Math.max(...imageInfo.pixelInfo[32 * y + x].slice(0, 3))
                    fill(maxColor < 128 ? 'white' : 'black')
                    noStroke()
                    textAlign(CENTER, CENTER)
                    text(y * 32 + x, (x+1) * pixelSize - pixelSize/2, y*pixelSize + pixelSize/2)
                    // text(`${GRID_LETTERS[y]}${x}`, (x+1) * pixelSize - pixelSize/2, y*pixelSize + pixelSize/2)
                    pop()    
                }
                
                
            }
        }    

    }

    if (showHover) {

        push()
        
        let x = Math.floor(mouseX/pixelSize) * pixelSize
        let y = Math.floor(mouseY/pixelSize) * pixelSize

        noStroke()
        fill(0,255, 255, 255)

        rect(x, y, pixelSize, pixelSize)

        pop()

    }

}

const updateColorHistoryButtons = () => {

    //Clear out all the buttons in the previous colors wrapper
    document.getElementById('previous-colors-wrapper').replaceChildren()
    
    //Add buttons for each previous color
    for (let color of colorHistory) {

        let button = document.createElement('div')
        button.classList.add("color-history-button")

        let colorIndicator = document.createElement('span')
        colorIndicator.classList.add('color-history-button-color')

        colorIndicator.style.backgroundColor = color

        button.appendChild(colorIndicator)

        button.addEventListener('click', () => {

            console.log(color)
            document.getElementById("colorpicker").value = color
            // document.getElementById("colorpicker").setAttribute("value", color)
            changeTool(0)

        })

        document.getElementById('previous-colors-wrapper').appendChild(button)

    }

    //Add a button for white and a button for black
    //Black
    let blkbutton = document.createElement('div')
    blkbutton.classList.add("color-history-button")

    let blkcolorIndicator = document.createElement('span')
    blkcolorIndicator.classList.add('color-history-button-color')

    blkcolorIndicator.style.backgroundColor = 'black'

    blkbutton.appendChild(blkcolorIndicator)

    blkbutton.addEventListener('click', () => {

        
        document.getElementById("colorpicker").value = "#000000"
        // document.getElementById("colorpicker").setAttribute("value", color)
        changeTool(0)

    })

    document.getElementById('previous-colors-wrapper').appendChild(blkbutton)

    //White
    let whtbutton = document.createElement('div')
    whtbutton.classList.add("color-history-button")

    let whtcolorIndicator = document.createElement('span')
    whtcolorIndicator.classList.add('color-history-button-color')

    whtcolorIndicator.style.backgroundColor = "white"

    whtbutton.appendChild(whtcolorIndicator)

    whtbutton.addEventListener('click', () => {

        
        document.getElementById("colorpicker").value = "#ffffff"
        changeTool(0)
        

    })

    document.getElementById('previous-colors-wrapper').appendChild(whtbutton)
}

const toggleHover = () => {

    showHover = !showHover

    document.getElementById('show-hover-label').innerText = (showHover) ? "Turn Hover OFF" : "Turn Hover ON"
}

const toggleNumbers = () => {

    showNumbers = !showNumbers

    document.getElementById('show-numbers-label').innerText = (showNumbers) ? "Turn Numbers OFF" : "Turn Numbers ON"

}

const toggleChecker = () => {

    showChecker = !showChecker

    document.getElementById('show-checker-label').innerText = (showChecker) ? "Turn Checkerboard OFF" : "Turn Checkerboard ON"

}

const clearCanvas = () => {

    //Reset all the values in the pixelInfo array

    imageInfo.pixelInfo = new Array(32*32).fill([255, 255, 255, 0])
}

const changeTool = (toolIndex) => {

    
    if (toolIndex !== activeToolIndex) {
        activeToolIndex = toolIndex
        //Change tool
        let buttons = document.getElementsByClassName("tool-button")
        
        for (let i = 0; i < buttons.length; i++) {
        
            buttons[i].classList.remove('active')

            if (i === toolIndex) {
                buttons[i].classList.add('active')
            }
        }
    }
}

const saveimage = () => {

    let sp = new URLSearchParams(window.location.search)
    let name = sp.get('name')
    console.log(`New Name: ${document.getElementById("image-name").value}`)

    imageInfo.name = document.getElementById("image-name").value
    console.log(imageInfo)
    
    fetch(`/api/image/${name}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(imageInfo)
    })
}

const toggleBorder = () => {

    console.log("TEST")

    showPixelBorder = !showPixelBorder

    document.getElementById('show-border').innerText = (showPixelBorder) ? "Turn Pixel Border OFF" : "Turn Pixel Border ON"

}