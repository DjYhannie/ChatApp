$(document).ready(function() { 
    $("#sub").click(()=>{
    let username = getUsername();
        if(username) {
            console.log(username);
            window.location.href = "/home/"+ username;
        }
   });
 
})

  /**
         * get the username of the 
         */
        function getUsername() {
            let username = $("#username").val();
            if (!username) {
                alert("Invalid user name");
                return false;
            }
            return username;
        }



    


