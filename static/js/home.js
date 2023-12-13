import api from './APIClient.js';


document.addEventListener('DOMContentLoaded', function () {
    api.getCurrentUser().then(user => {
        header(user);
        howls();
        let postbtn = document.querySelector("#submithowl");
        let howltext = document.querySelector("#howlinput");
        postbtn.addEventListener('click', e => {
            let howlmessage = {
                "text": howltext.value
            }
            api.post(howlmessage).then(howl => {
                console.log(howl);
                resetHowls();
            }).catch((error) => {
                console.log("could not post");
            });
            howltext.value = "";
        });
        
    }).catch((err) => {
        console.log(err);
    });
});


//generate header
function header(user) {
    let logoutlink = document.createElement('button');
    logoutlink.innerHTML = "Logout";
    logoutlink.classList.add('logoutbtn');
    
    logoutlink.addEventListener("click", e => {
        e.preventDefault();
        api.logout().then(() => {
            localStorage.removeItem('user');
            document.location = './login';
        });
    });


    let imglink = document.querySelector('.pfp')
    imglink.href = './userprofile?id=' + user.id;
    const img = document.createElement('img');
    img.src = user.avatar;
    img.classList.add('howlpfpheader')
    imglink.append(img);

    document.querySelector('.firstname').innerHTML = `${user.first_name}`;
    document.querySelector('.lastname').innerHTML = `${user.last_name}`;
    document.querySelector('.logoutbutton').appendChild(logoutlink);
}

// //generate new howl submission form
// function newHowlForm() {

// }


//generate main page howls
function howls() {
    api.getHowlsByFollowing().then(howls => {
        fillHowlsDisplay(howls);
    }).catch((error) => {
        console.log(error);
    });
}

function fillHowlsDisplay(howls) {
    const howlDisplay = document.getElementById('howls');
    howls.forEach(howl => {
        howlDisplay.append(generateHowl(howl));
    })
}

function generateHowl(howl) {
    const item = document.createElement('div');
    item.classList.add('howl');

    console.log(howl);

    api.getUserById(howl.userId).then(user => {
        const detailsbox = document.createElement('div');
        detailsbox.classList.add('detailsbox');
        const userdetails = document.createElement('div');
        userdetails.classList.add('opdetails');

        const imglink = document.createElement('a');
        imglink.href = './userprofile?id=' + user.id;
        const img = document.createElement('img');
        img.src = user.avatar;
        img.classList.add('howlpfp')
        imglink.append(img);
        userdetails.append(imglink);

        const op = document.createElement('div');
        const opdatafullname = document.createElement('h5');
        const opdatausername = document.createElement('h6');


        opdatafullname.innerHTML =  user.first_name + " " +  user.last_name;
        opdatausername.innerHTML = "@" + user.username;
        op.classList.add('op')
        op.append(opdatafullname);
        op.append(opdatausername);
        userdetails.append(op);

        userdetails.addEventListener('click', e => {
            document.location = './userprofile?id=' + user.id;
        });
        
        detailsbox.appendChild(userdetails);

        const timestamp = document.createElement('div');
        timestamp.classList.add('timestamp');

        let timestampdata = document.createElement('div');
        timestampdata.classList.add('timedata');


        let postdate = new Date(howl.datetime)
        let datestring = postdate.toDateString();
        let timestring = postdate.toLocaleTimeString();

        let dws = 0;
        let idx = 0;
        let fullstring = "";
        let dcc = datestring.charAt(idx);
        while (dws < 3)
        {
            if (dcc == " ") {
                dws++;
            }
            fullstring = fullstring + dcc;
            idx++;
            dcc = datestring.charAt(idx);
        }

        fullstring = fullstring.substring(0, fullstring.length - 1) + ", ";

        idx = 0;
        let tcol = 0;
        let tcc = timestring.charAt(idx);
        while (tcol < 2)
        {
            if (tcc == ":") {
                tcol++;
            }
            fullstring = fullstring + tcc;
            idx++;
            tcc = timestring.charAt(idx);
        }

        let timesuffix = timestring.substring(timestring.length - 2, timestring.length) == "PM" ? "pm" : "am";

        timestampdata.innerHTML = fullstring.substring(0, fullstring.length - 1) + timesuffix;
        timestamp.append(timestampdata);
        detailsbox.append(timestamp);

        const text = document.createElement('span');
        text.innerHTML = howl.text;
        text.classList.add('howlmsg');
        item.append(detailsbox);
        item.append(text);
    }).catch((error) => {
        console.log(error);
    })

    return item;
}

function resetHowls() {
    const howlDisplay = document.getElementById('howls')
    howlDisplay.innerHTML = '';
    howls();
}