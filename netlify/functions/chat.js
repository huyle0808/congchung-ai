exports.handler = async (event) => {

  try {

    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({
          answer: "Method không được hỗ trợ."
        })
      };
    }

    if (!process.env.GEMINI_API_KEY) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          answer: "Chưa cấu hình GEMINI_API_KEY trên Netlify."
        })
      };
    }

    const { question } = JSON.parse(event.body || "{}");

    if (!question) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          answer: "Bạn chưa nhập câu hỏi."
        })
      };
    }

    const prompt = `
Bạn là Trợ lý Công chứng AI Việt Nam.

Nhiệm vụ:
- Giải thích pháp luật dễ hiểu.
- Hỗ trợ nghiệp vụ công chứng.
- Dẫn chiếu điều luật khi có thể.
- Không tự bịa quy định pháp luật.
- Trả lời bằng tiếng Việt.

Câu hỏi:
${question}
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    console.log("Gemini response:");
    console.log(JSON.stringify(data, null, 2));

    if (!response.ok) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          answer:
            data.error?.message ||
            "Gemini API trả về lỗi."
        })
      };
    }

    const answer =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!answer) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          answer: "Gemini không trả về nội dung."
        })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        answer
      })
    };

  } catch (error) {

    console.error(error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        answer: "Lỗi server: " + error.message
      })
    };

  }

};
