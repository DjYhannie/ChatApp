$(document).ready(function() {
   $("#sub").click(()=>{
    let username = getUsername();
        if(username) {
            console.log(username);
            window.location.href = "/home/"+ username;
        }
   });

   $("#discon").click( async (e)=>{
       e.preventDefault();
        var socket = io();
        let user = $("#usernameHome").attr("name");
       await socket.emit('disconnection', user);
       let counter = 0;
       const test = setInterval(()=> {
            if(counter > 0){
                window.location.href = '/';
                clearInterval(test);
            }
            counter++;

       },1000)
    });
    

   if($("#usernameHome").attr("name")) {
        var socket = io();
        let user = $("#usernameHome").attr("name");
        
        socket.emit('join', user);
        displayJoinedChat("you");

        socket.on('join', (msg)=> {
            //append the user joined  
            displayJoinedChat(msg);
        })

        //detect when the a user is typing
        $("body").on('input',"#msg",()=> {
            user = $("#usernameHome").attr("name");
            socket.emit('typing', user);
        })

        //send the message 
        $("#send").click((e)=> {
            let user = $("#usernameHome").attr("name");
            e.preventDefault();
            let message = $("#msg").val();
            socket.emit('message',{username:user, message: message});
            appendMessage(`${message}`, {direction: "right", color: "primary"});
            $("#msg").val("");
        });

        //recieve the emited message form the other users
        socket.on('message', (msg)=> {
            appendMessage(`${msg.username} : ${msg.message}`, {direction: "left", color: "success"});
            clearTyping();
        })

        //on typing 
        socket.on('typing', (msg)=> {
            showTyping(msg);
        })

        //disconnect
        socket.on('disconnection', (msg)=> {
            disConnect(msg);
            
        })
   }
})


/**
 * Display 
 * @param {*} username 
 */
function displayJoinedChat(username) {
    $("#messages").append(
        `<p class="text-center text-warning"><medium >${username} joined the chat</medium></p>`
    );
}

/**
 * Show if a user is typing
 * @param {*} username 
 */
function showTyping(username){
    $("#typing").text(`${username} is typing`);
}

function clearTyping() {
    $("#typing").text("");
}

/**
 * Append the message
 * @param {*} message 
 * @param {*} socket 
 */
function appendMessage(message, data){
    $("#messages").append(
        `<div class="mt-2 mx-1"><br><p class="text-${data.direction}"><span class="p-2 bg-${data.color}">${message}</p></span></div>`
    )
}

/**
 * get the username of the 
 */
function  getUsername() {
    let username = $("#username").val();
    if(!username) {
        alert("Invalid user name");
        return false;
    }
    return username;
}

/**
 * Disconnect
 */
function disConnect(username) {
    $("#messages").append(
        `<p class="text-center text-secondary"><small >${username} has disconnected</small></p>`
    );
}

