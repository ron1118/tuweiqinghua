import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY || "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",
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "https://pickup-lines-generator.vercel.app",
    "X-Title": process.env.NEXT_PUBLIC_APP_NAME || "Pickup Lines Generator",
  },
});

export async function POST(request: NextRequest) {
  let userMessage: string = '';
  let intensity: number = 5;
  
  try {
    const body = await request.json();
    userMessage = body.userMessage || '';
    intensity = body.intensity || 5;

    if (!userMessage) {
      return NextResponse.json({ error: '用户消息不能为空' }, { status: 400 });
    }

    // 根据暧昧程度调整提示词
    const intensityDescriptions = {
      1: '非常含蓄，点到为止',
      2: '含蓄委婉，温柔体贴',
      3: '温和亲切，略带暧昧',
      4: '轻松愉快，有些暧昧',
      5: '中等暧昧，适度调情',
      6: '比较暧昧，明显调情',
      7: '相当暧昧，大胆调情',
      8: '非常暧昧，热情如火',
      9: '极度暧昧，激情四射',
      10: '超级暧昧，火辣撩人'
    };

    const intensityDesc = intensityDescriptions[intensity as keyof typeof intensityDescriptions] || '中等暧昧';

    const prompt = `用户说："${userMessage}"

请生成3条土味情话回复，暧昧程度：${intensityDesc}。

格式要求：只输出3行，每行一条情话，不要编号、标签或说明文字。

示例格式：
你是我见过最美的风景
和你聊天是我最快乐的时光
你的笑容比阳光还要温暖`;

    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.5-flash-preview-09-2025",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.8,
    });

    const response = completion.choices[0]?.message?.content;
    
    if (!response) {
      throw new Error('AI生成失败');
    }

    // 将回复按行分割成数组
    const pickupLines = response
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .slice(0, 3); // 确保只返回3条

    // 如果不足3条，补充一些默认的
    while (pickupLines.length < 3) {
      pickupLines.push('你是我见过最美的风景，让我心动不已');
    }

    return NextResponse.json({ pickupLines });

  } catch (error) {
    console.error('API Error:', error);
    
    // 如果AI API失败，使用本地备用生成器
    const fallbackLines = generateFallbackPickupLines(userMessage, intensity);
    return NextResponse.json({ pickupLines: fallbackLines });
  }
}

// 备用土味情话生成器
function generateFallbackPickupLines(userMessage: string, intensity: number): string[] {
  const baseLines = [
    "你是我见过最美的风景，让我心动不已",
    "你的笑容比阳光还要温暖，照亮了我的心",
    "和你聊天是我一天中最快乐的时光",
    "你的声音像天籁一样动听，让我沉醉其中",
    "你就像星星一样闪闪发光，让我无法移开视线",
    "和你在一起，时间都变得特别美好",
    "你的眼睛里有整个宇宙，让我想要探索",
    "你是我心中的小太阳，给我带来温暖和希望",
    "和你聊天让我忘记了所有的烦恼",
    "你就像春天的花朵，让我心情愉悦"
  ];

  const intenseLines = [
    "你的美让我无法呼吸，我的心只为你跳动",
    "你是我梦中的女神，让我夜不能寐",
    "你的魅力让我无法抗拒，我完全被你征服了",
    "你就像毒药一样，让我上瘾无法自拔",
    "你的眼神让我心跳加速，我完全沦陷了",
    "你是我生命中的唯一，没有你我活不下去",
    "你的美让我疯狂，我愿为你做任何事",
    "你就像火焰一样，点燃了我内心的激情",
    "你的存在让我无法思考，我完全被你迷住了",
    "你是我心中的女神，让我为你疯狂"
  ];

  const lines = intensity >= 7 ? intenseLines : baseLines;
  
  // 随机选择3条不同的情话
  const selectedLines: string[] = [];
  const usedIndices = new Set<number>();
  
  while (selectedLines.length < 3 && selectedLines.length < lines.length) {
    const randomIndex = Math.floor(Math.random() * lines.length);
    if (!usedIndices.has(randomIndex)) {
      usedIndices.add(randomIndex);
      selectedLines.push(lines[randomIndex]);
    }
  }
  
  return selectedLines;
}
