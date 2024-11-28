function startConnect(){

    clientID = "clientID - "+parseInt(Math.random() * 100);

    host = "test.mosquitto.org";   
    port = "8080";  
    userId  = "";  
    passwordId = "";  


    client = new Paho.Client(host,Number(port),clientID);

    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;

    client.connect({
        onSuccess: onConnect
//        userName: userId,
 //       passwordId: passwordId
    });


}


function onConnect(){
    topic =  "system/humi001";

    //document.getElementById("messages").innerHTML += "<span> Subscribing to topic "+topic + "</span><br>";

    client.subscribe(topic);
    console.log("Subscribing to topic: "+topic);
}



function onConnectionLost(responseObject){
    //document.getElementById("messages").innerHTML += "<span> ERROR: Connection is lost.</span><br>";
    console.log("ERROR: Connection is lost");
    if(responseObject !=0){
        //document.getElementById("messages").innerHTML += "<span> ERROR:"+ responseObject.errorMessage +"</span><br>";
    }
}

function onMessageArrived(message){
    console.log("OnMessageArrived: "+message.payloadString);
    //document.getElementById("messages").innerHTML += "<span> Topic:"+message.destinationName+"| Message : "+message.payloadString + "</span><br>";
    
    const strg= message.payloadString;

    const integerRegex = /\d+|nan/g;

    // Extracting all integer values using regular expression
    const values = strg.match(integerRegex);

    // Storing values in separate variables
    const temperature = values[0].toLowerCase() === 'nan' ? 'Nan' : parseInt(values[0]);
    const humidity = values[1].toLowerCase() === 'nan' ? 'Nan' : parseInt(values[1]);
    const ot = values[2].toLowerCase() === 'nan' ? 'Nan' : parseInt(values[2]);
    const oh = values[3].toLowerCase() === 'nan' ? 'Nan' : parseInt(values[3]); 






    console.log("Temperature:", temperature);
    console.log("Humidity:", humidity);
    console.log("OT:", ot);
    console.log("OH:", oh);
    updateTemperatureDisplay(temperature,humidity,oh,ot);
}

function updateTemperatureDisplay(temperature,humidity,oh,ot) {
    console.log("a:", temperature);
    console.log("b:", humidity);
    console.log("c:", ot);
    console.log("d:", oh);
    if(temperature === "Nan" || humidity === "Nan" || oh === "Nan" || ot === "Nan"){
        console.log("Error occurred")
        const error = document.getElementById('error-msg');
        error.textContent = "Error Occurred!";
    }
    else{
        const error = document.getElementById('error-msg');
        error.textContent = "";
    }
        const mainNum1 = document.getElementById('main-num1');
        mainNum1.textContent = humidity + "%";
        const mainNum2 = document.getElementById('main-num2');
        mainNum2.textContent = ot + "%";
        const mainNum3 = document.getElementById('main-num3');
        mainNum3.textContent = temperature + "\u00B0C";
        const mainNum4 = document.getElementById('main-num4');
        mainNum4.textContent = oh + "\u00B0C";
    
}

function startDisconnect(){
    client.disconnect();
    //document.getElementById("messages").innerHTML += "<span> Disconnected. </span><br>";
    console.log("Disconnected");
}

function publishMessage(){
msg = document.getElementById("Message").value;
topic = document.getElementById("topic_p").value;

Message = new Paho.Message(msg);
Message.destinationName = topic;

client.send(Message);
//document.getElementById("messages").innerHTML += "<span> Message to topic "+topic+" is sent </span><br>";
console.log("Message to topic:"+topic);
}

function publishRange(msg, topic) {
    const message = new Paho.Message(msg);
    message.destinationName = topic;
    client.send(message);
    //document.getElementById("messages").innerHTML += "<span> Message to topic " + topic + " is sent </span><br>";
    console.log("Message to "+topic+" sent:"+ message.payloadString);
}



const optionMenu = document.querySelector(".select-menu"),
       selectBtn = optionMenu.querySelector(".select-btn"),
       options = optionMenu.querySelectorAll(".option"),
       sBtn_text = optionMenu.querySelector(".sBtn-text");
selectBtn.addEventListener("click", () => optionMenu.classList.toggle("active")); 

const optionMessages = ["humid01", "humid02", "humid03","humid04","humid05"];

options.forEach((option, index) => {
    option.addEventListener("click", () => {
        const selectedOption = optionMessages[index];
        sBtn_text.innerText = option.querySelector(".option-text").innerText;
        
        const msg = selectedOption;
        const topic = "system/humi002"; 
        publishRange(msg, topic);
        optionMenu.classList.remove("active");
    });
});




