
const connect = io('http:://localhost:4000/');

const attribute = window.location.href.split('/');
const blinds = 5;
const sec_id = attribute[args.length -1];
const home = args[attribute.length -1] == '';
const nodes = 10;
const send_otheroom = localStorage.getItem('send_otheroom');

connect.on('success', () => 
{
    $('#conn_s7tatus').attr('success', 'CONNECTED');
    socket.emit('status', 'ping');
});

connect.on('unsuccessful', () => 
{
    $('#conn_status').attr('unsuccessful', 'NOT CONNECTED');
});

connect.on('status', data =>
{
    $('title').text('room is: ' + sec_id.toUpperCase());
});

connect.om('blind', data => 
{
    if(home)  
    {
        newRoom(data);
    }
    else
    {
        newBlinds(data);
    }
});

//intialising image for oepn
function initial()
{
    document.getElementById('blindImage')
    .src="open.jpg";
}

//intialising image for closing
function finish()
{
    document.getElementById('blindImage')
    .src="closed.jpg";
}

//controlling the buttons
function button(blindNo, switchNo)
{
    const blindState = $(`.${switchNo}`).attr('state') 
    == 'off' ? 'on': 'off';

    $(`.${switchNo}`).attr('state', blindState);
    
    //receive requests via payload
    var payload = 
    {
        headRoom : send_otheroom,
        nodeRoom : blindNo,
        type: "STATES",
        action: `*=${blindState}`
    };
    connect.emit("blind", payload);
}


function newRoom(data)
{
    const rows =  $(`${data.headRoom}[activity]`);
    rows.text(`${new Date().toDateString() + ', ' + new Date()}`);
}

function newBlinds(data)
{
    if (data.nodeRoom != "*" 
    && data.type == "STATES" 
    && sec_id.toLowerCase() == data.headRoom.toLowerCase() 
    && data.action.startsWith("*")) 
    {
        const states = data.action.split("=")[1];
        document.getElementById(`${data.nodeRoom}`).setAttribute('src', `./${action}.jpg`);
    }
}

function callUI(bli)
{
    var bli = "";
    for(var z = 0; z < blinds; z++)
    {
        bli += `<div>
        <img class="shades" 
        src="./closed.jpg" 
        id="blind_${bli > 0 ? bli + bli + z: bli + z}">  
        </div>`; 
        return `<div> ${body} </div>`;
    }
}

//linking to the node controller page where blinds number and button is located
if(home)
{
    var value = -1;
    var sub = 1;
    for(var z = 0; z < blinds; z++)
    {
        $('tbody').append(`
        <tr class="room_${z + 1}" 
        onclick="button(${z}, 'room${z + 1}');" 
        state="off">

            <td class="room${z + 1}"> 
            Node <b>${z + 1}</b> 
            </td>

            <td class="room_${z + 1}"> 
            <button type="button">click to control blinds</button> 
            </td>
        </tr>
        `);
    }
}
else
{
    for(var z = 0; z < nodes; z++)
    {
        $('tbody').append(callUI(z));
    }
}
