fetch("api/saved")
.then(res => res.json())
.then(json => {
    console.log(json)
    //Add all the users to the page with buttons for each one

    let namesWrapper = document.getElementById("names-wrapper")

    for (let user of json) {

        //Create button
        let anchor = document.createElement("a")
        anchor.setAttribute("href", `/imageselect?name=${user}`)
        
        let button = document.createElement('button')
        button.classList.add("button")
        let nameWrapper = document.createElement('span')
        nameWrapper.innerText = user

        button.appendChild(nameWrapper)

        anchor.appendChild(button)
        namesWrapper.appendChild(anchor)
    }

})