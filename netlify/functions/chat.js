exports.handler = async (event) => {

try{

const { question } =
JSON.parse(event.body);

const response = await fetch(
"https://api.openai.com/v1/chat/completions",
{
method:"POST",
headers:{
"Content-Type":"application/json",
"Authorization":
`Bearer ${process.env.OPENAI_API_KEY}`
},
body:JSON.stringify({

model:"gpt-4o-mini",

messages:[
{
role:"system",
content:`
Bạn là trợ lý công chứng Việt Nam.

Nhiệm vụ:

- Giải thích pháp luật dễ hiểu.
- Hỗ trợ nghiệp vụ công chứng.
- Dẫn chiếu điều luật khi có thể.
- Phân tích tình huống thực tế.
- Không bịa đặt quy định pháp luật.

Cấu trúc trả lời:

1. Nhận định.
2. Căn cứ pháp lý.
3. Hướng xử lý.
   `
   },
   {
   role:"user",
   content:question
   }
   ],

temperature:0.3

})
}
);

const data =
await response.json();
console.log("OpenAI response:", data);

if (!response.ok) {
  return {
    statusCode: response.status,
    body: JSON.stringify({
      answer: "Lỗi OpenAI: " +
              (data.error?.message || "Không xác định")
    })
  };
}

if (!data.choices || !data.choices.length) {
  return {
    statusCode: 500,
    body: JSON.stringify({
      answer: "OpenAI không trả về câu trả lời."
    })
  };
}
console.log(JSON.stringify(data, null, 2));
return{
statusCode:200,
body:JSON.stringify({
answer:
data.choices[0].message.content
})
};

}catch(error){

return{
statusCode:500,
body:JSON.stringify({
answer:
"Lỗi server: " + error.message
})
};

}

};
