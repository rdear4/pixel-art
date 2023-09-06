fetch("api/saved")
.then(res => res.json())
.then(json => {
    console.log(json)
    //Add all the users to the page with buttons for each one

    let namesWrapper = document.getElementById("names-wrapper")

    for (let user of json) {

        //Create button
        let anchor = document.createElement("a")
        anchor.setAttribute("href", `/selectimage.html?new=0&name=${user}`)


        
        let button = document.createElement('button')
        button.classList.add("button")

        let nameWrapper = document.createElement('span')
        nameWrapper.classList.add('name-wrapper')


        let fnameWrapper = document.createElement('span')
        fnameWrapper.classList.add('first-name')

        let lnameWrapper = document.createElement('span')
        lnameWrapper.classList.add('last-name')
        lnameWrapper.innerText = `${user.split("-")[0].toUpperCase()}`

        fnameWrapper.innerText = `${user.split("-")[1].toUpperCase()}`


        button.appendChild(nameWrapper)
        nameWrapper.appendChild(lnameWrapper)
        nameWrapper.appendChild(fnameWrapper)

        anchor.appendChild(button)
        namesWrapper.appendChild(anchor)
    }

})