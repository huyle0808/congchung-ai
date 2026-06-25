async function askAI(){

const question =
document.getElementById("question").value.trim();

if(!question) return;

const chatBox =
document.getElementById("chatBox");

chatBox.innerHTML += `

<div class="user-message">
${question}
</div>
`;document.getElementById("question").value = "";

chatBox.innerHTML += `

<div class="bot-message" id="loading">
⏳ Đang phân tích...
</div>
`;chatBox.scrollTop = chatBox.scrollHeight;

try{

const response = await fetch(
"/.netlify/functions/chat",
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
question
})
}
);

const data = await response.json();

if (!response.ok) {
  throw new Error(data.answer || "Lỗi từ server");
}

document.getElementById("loading").remove();

chatBox.innerHTML += `

<div class="bot-message">
${data.answer}
</div>
`;chatBox.scrollTop = chatBox.scrollHeight;

}catch(error){

document.getElementById("loading").remove();

chatBox.innerHTML += `

<div class="bot-message">
❌ Lỗi kết nối AI:
${error.message}
</div>
`;}

}
