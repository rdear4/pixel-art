const checkFn = (callback) => {

    
    //Check to make sure that there is name in the person-name field
    let personName = document.getElementById("person-name").value
    if (personName === "" || personName.length <= 3) {
        alert("Please enter a name before continuing.")
    } else {
        console.log("Good to go!")
        callback()
    }

    

}

const newImageFn = () => {

    // console.log("new Image")

    //Create a new image for this user
    console.log(JSON.stringify({name: document.getElementById("person-name").value}))
    fetch("/api/image/new", {method: "POST", headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({name: document.getElementById("person-name").value})})
    .then(res => res.json())
    .then(json => {
        console.log(json)
        //Redirect to the edit image page
        window.location.replace(`http://pixel.wraughn.com/draw.html?name=${json.userName}&id=${json.imgId}`)
    })
    .catch(e => console.log(e))

    
}

//Attach function to new image button
document.getElementById('new-image-button').addEventListener('click', () => checkFn(newImageFn))

//Attach check function to each button

//Get the name of the select user

//Check to see if this is for a new user
let searchParams = new URLSearchParams(window.location.search)
let newUser = searchParams.get('new')
console.log(newUser)
if (newUser === '1') {
    //This is for a new user and we don't need to retrieve the saved images
} else {
    let usrName = searchParams.get('name')

    fetch(`/api/images?name=${usrName}`)
    
    .then(res => res.json())
    .then(json => {
        document.getElementById("person-name").value = json.name
        
        for (let imageIndex in json.images) {

            let imageSelectionWrapper = document.createElement('div')
            imageSelectionWrapper.classList.add('image-selection-wrapper')

            let imageEl = document.createElement('img')
            imageEl.setAttribute('src', `images/app/${usrName}-${imageIndex}.png`)

            imageSelectionWrapper.appendChild(imageEl)

            let imageNameWrapper = document.createElement('div')
            imageNameWrapper.classList.add('image-name-wrapper')
            
            let imageNameWrapperSpan = document.createElement('span')
            imageNameWrapperSpan.classList.add("image-name")
            imageNameWrapperSpan.innerText = json.images[imageIndex].name

            imageNameWrapper.appendChild(imageNameWrapperSpan)

            imageSelectionWrapper.appendChild(imageNameWrapper)

            let anchorElement = document.createElement('a')
            anchorElement.setAttribute('href', `draw.html?name=${usrName}&id=${json.images[imageIndex].id}`)

            let buttonWrapper = document.createElement('button')
            buttonWrapper.classList.add('image-select-button')

            let buttonSpan = document.createElement('span')
            buttonSpan.innerText = "Edit Image"

            buttonWrapper.appendChild(buttonSpan)

            anchorElement.appendChild(buttonWrapper)

            imageSelectionWrapper.appendChild(anchorElement)


            document.getElementById("images-wrapper").appendChild(imageSelectionWrapper)
        }
    })
}


