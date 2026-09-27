<script>
const API_URL="https://6cmkqxcivc.execute-api.ap-south-1.amazonaws.com/prod/request";

let projectRequests=[];

async function loadProjectRequests(){
    const requestList=document.getElementById("requestList");
    const notificationBody=document.getElementById("notificationBody");

    try{
        const response=await fetch(API_URL,{
            method:"GET",
            headers:{"Content-Type":"application/json"}
        });

        const result=await response.json();
        console.log("AWS GET Response:",result);

        let data=result;

        if(result && typeof result.body==="string"){
            try{
                data=JSON.parse(result.body);
            }catch{
                data=result.body;
            }
        }

        if(Array.isArray(data)){
            projectRequests=data;
        }else if(data && Array.isArray(data.requests)){
            projectRequests=data.requests;
        }else if(data && Array.isArray(data.Items)){
            projectRequests=data.Items;
        }else{
            projectRequests=[];
        }

        renderRequests();
        renderNotifications();
        updateNotificationCount();

    }catch(error){
        console.error("AWS Request Error:",error);

        if(requestList){
            requestList.innerHTML='<div class="no-request">Unable to load project requests.</div>';
        }

        if(notificationBody){
            notificationBody.innerHTML='<div class="notification-empty">Unable to load notifications.</div>';
        }
    }
}

function updateNotificationCount(){
    const count=document.getElementById("notificationCount");
    const headerCount=document.getElementById("notificationHeaderCount");

    if(!count)return;

    const total=projectRequests.length;

    if(total>0){
        count.textContent=total;
        count.classList.remove("hidden");

        if(headerCount){
            headerCount.textContent=total+" new request"+(total===1?"":"s");
        }
    }else{
        count.textContent="0";
        count.classList.add("hidden");

        if(headerCount){
            headerCount.textContent="No new requests";
        }
    }
}

function renderNotifications(){
    const body=document.getElementById("notificationBody");

    if(!body)return;

    if(projectRequests.length===0){
        body.innerHTML='<div class="notification-empty">No project requests yet.</div>';
        return;
    }

    const latestRequests=[...projectRequests].reverse();

    body.innerHTML=latestRequests.map(request=>{
        const client=escapeHTML(request.clientName||request.client||"Client");
        const project=escapeHTML(request.projectName||request.project||request.services||"Project Request");
        const description=escapeHTML(request.description||"New project request received.");
        const status=escapeHTML(request.status||"New Request");

        return `
        <div class="notification-item" onclick="openRequestPanel()">
            <div class="notification-item-title">🚀 ${client}</div>
            <div class="notification-item-text">${project}<br>${description}</div>
            <span class="notification-item-status">${status}</span>
        </div>`;
    }).join("");
}

function showNotifications(){
    const popup=document.getElementById("notificationPopup");

    if(!popup)return;

    popup.classList.toggle("show");
}

function openRequestPanel(){
    const popup=document.getElementById("notificationPopup");

    if(popup){
        popup.classList.remove("show");
    }

    const panel=document.getElementById("requestPanel");

    if(panel){
        panel.classList.add("show");
        panel.scrollIntoView({
            behavior:"smooth",
            block:"start"
        });
    }
}

function viewAllRequests(){
    openRequestPanel();
}

function renderRequests(){
    const list=document.getElementById("requestList");

    if(!list)return;

    if(projectRequests.length===0){
        list.innerHTML='<div class="no-request">No project requests received yet.</div>';
        return;
    }

    list.innerHTML=[...projectRequests].reverse().map(request=>{
        const client=escapeHTML(request.clientName||request.client||"Client");
        const email=escapeHTML(request.email||request.contact||"Not provided");
        const project=escapeHTML(request.projectName||request.project||request.services||"Project");
        const websiteType=escapeHTML(request.websiteType||request.requirement||"Website Project");
        const budget=escapeHTML(request.budget||"Not specified");
        const timeline=escapeHTML(request.timeline||"Not specified");
        const delivery=escapeHTML(request.delivery||"Not specified");
        const description=escapeHTML(request.description||"No description");
        const status=escapeHTML(request.status||"New Request");

        return `
        <div class="request-card">
            <div class="request-top">
                <div class="request-name">${client}</div>
                <div class="request-status">${status}</div>
            </div>

            <div class="request-info">
                <strong>Project:</strong> ${project}<br>
                <strong>Contact:</strong> ${email}<br>
                <strong>Website:</strong> ${websiteType}<br>
                <strong>Budget:</strong> ₹${budget}<br>
                <strong>Timeline:</strong> ${timeline}<br>
                <strong>Expected Delivery:</strong> ${delivery}
            </div>

            <div class="request-description">
                <strong>Description:</strong><br>${description}
            </div>
        </div>`;
    }).join("");
}

function escapeHTML(value){
    return String(value??"")
        .replace(/&/g,"&amp;")
        .replace(/</g,"&lt;")
        .replace(/>/g,"&gt;")
        .replace(/"/g,"&quot;")
        .replace(/'/g,"&#039;");
}

function logout(){
    localStorage.removeItem("webforgeLoggedIn");
    window.location.href="login.html";
}

document.addEventListener("click",function(event){
    const wrapper=document.querySelector(".notification-wrapper");
    const popup=document.getElementById("notificationPopup");

    if(wrapper&&popup&&!wrapper.contains(event.target)){
        popup.classList.remove("show");
    }
});

loadProjectRequests();
setInterval(loadProjectRequests,10000);
</script>