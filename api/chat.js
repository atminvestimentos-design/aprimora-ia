export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { tipo, lead, mensagem } = req.body;

  // Apenas salva o lead (sem resposta IA)
  if (tipo === 'salvar_lead') {
    console.log('NOVO LEAD:', JSON.stringify(lead));
    // Aqui você pode integrar: Google Sheets, Evolution API, email, etc.
    return res.status(200).json({ ok: true });
  }

  // Resposta IA personalizada
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(200).json({
      resposta: `Incrível, ${lead?.nome?.split(' ')[0] || 'você'}! Com automações de IA conseguimos resolver exatamente isso — reduzindo trabalho manual e aumentando seus resultados de forma rápida. 🚀`
    });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 220,
        system: `Você é a assistente virtual da Aprimora IA, empresa especializada em automações com Inteligência Artificial para pequenas e médias empresas brasileiras.

Serviços que oferecemos:
- Automação de atendimento no WhatsApp (chatbots com IA)
- Organização e qualificação automática de leads
- Geração automática de propostas comerciais
- Integração com CRM e sistemas de gestão
- Treinamento da equipe para uso de IA
- Mentorias especializadas em automação empresarial

Ao responder, seja:
- Empático e próximo (use o nome do cliente)
- Específico para o negócio e desafio mencionado
- Breve: máximo 2-3 frases
- Otimista e propositivo
- Sempre em português brasileiro`,
        messages: [{ role: 'user', content: mensagem }]
      })
    });

    const data = await response.json();
    const texto = data?.content?.[0]?.text;
    if (!texto) throw new Error('No content');

    return res.status(200).json({ resposta: texto });
  } catch (err) {
    console.error('Claude API error:', err);
    return res.status(200).json({
      resposta: `Perfeito! Com automações de IA conseguimos resolver exatamente esse desafio para a ${lead?.empresa || 'sua empresa'} — de forma simples e sem complicação. 🚀`
    });
  }
}
