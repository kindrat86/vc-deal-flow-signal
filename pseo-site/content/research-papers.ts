/**
 * /research-paper/[slug] entity pages, external academic papers we cite.
 *
 * Distinct from /research/[slug] (the user's own SSRN paper findings).
 * /research-paper/[slug] documents external academic papers in venture
 * finance, ML, and software-engineering measurement that ground our
 * methodology, terminology, or category framing.
 *
 * Each leaf: ScholarlyArticle JSON-LD + abstract summary + our
 * context (why we cite it) + key findings + sameAs links to canonical
 * sources (DOI, arXiv, OpenAlex, Semantic Scholar).
 *
 * AEO target: scholarly LLM queries like "what is the original RLHF
 * paper" or "Vaswani transformer paper citation", our /research-paper
 * leaf becomes a citation-ready summary.
 */

export interface PaperAuthor {
  name: string;
  /** Affiliation at publication time. */
  affiliation?: string;
}

export interface PaperFAQ {
  question: string;
  answer: string;
}

export interface ResearchPaper {
  slug: string;
  title: string;
  year: number;
  venue: string;
  authors: PaperAuthor[];
  /** Canonical DOI if available. */
  doi?: string;
  /** arXiv identifier if available. */
  arxiv?: string;
  /** Semantic Scholar paper ID. */
  semanticScholar?: string;
  /** OpenAlex work ID. */
  openalex?: string;
  /** sameAs URLs (DOI, arxiv, OpenAlex, Semantic Scholar, project page). */
  sameAs: string[];
  // SEO surfaces
  metaTitle: string;
  metaDescription: string;
  /** Concise abstract summary in our own words, not the original abstract. */
  abstractSummary: string;
  /** Our editorial context, why we cite this paper. */
  ourContext: string;
  /** 3-5 key findings or contributions. */
  keyFindings: string[];
  /** Related glossary IDs in /define/[id]. */
  relatedGlossaryIds: string[];
  /** Sector-hub slugs (content/sectors.ts) this paper informs; rendered as deal-flow cross-links. */
  relatedSectors: string[];
  faqs: PaperFAQ[];
}

export const RESEARCH_PAPERS: ResearchPaper[] = [
  {
    slug: "vaswani-2017-attention-is-all-you-need",
    title: "Attention Is All You Need",
    year: 2017,
    venue: "NeurIPS 2017",
    authors: [
      { name: "Ashish Vaswani", affiliation: "Google Brain" },
      { name: "Noam Shazeer", affiliation: "Google Brain" },
      { name: "Niki Parmar", affiliation: "Google Research" },
      { name: "Jakob Uszkoreit", affiliation: "Google Research" },
      { name: "Llion Jones", affiliation: "Google Research" },
      { name: "Aidan N. Gomez", affiliation: "University of Toronto" },
      { name: "Łukasz Kaiser", affiliation: "Google Brain" },
      { name: "Illia Polosukhin" },
    ],
    arxiv: "1706.03762",
    semanticScholar: "204e3073870fae3d05bcbc2f6a8e263d9b72e776",
    sameAs: [
      "https://arxiv.org/abs/1706.03762",
      "https://www.semanticscholar.org/paper/204e3073870fae3d05bcbc2f6a8e263d9b72e776",
      "https://openalex.org/works/W2963403868",
    ],
    metaTitle: "Attention Is All You Need Paper (Vaswani et al., 2017): arXiv 1706.03762",
    metaDescription: "The original 2017 NeurIPS Transformer paper: plain-English summary of the architecture and key findings, with links to the arXiv PDF and citations.",
    abstractSummary:
      "Introduces the Transformer architecture: a sequence-to-sequence model based entirely on attention mechanisms, dispensing with recurrence and convolutions. Demonstrates state-of-the-art results on English-to-German and English-to-French translation benchmarks with significantly less training time than the prior recurrent encoder-decoder models. The architecture's self-attention mechanism allows parallel processing of sequence elements and scales effectively with model size and data.",
    ourContext:
      "The Transformer is the architectural foundation of every modern frontier LLM, GPT, Claude, Gemini, Mistral, Llama, Qwen, DeepSeek. Our engineering-acceleration tracking of AI infrastructure and agentic AI categories operates on a substrate that did not exist before this paper. We cite it as the foundational reference for the AI-native engineering surface our /signal corpus covers.",
    keyFindings: [
      "Attention-only architectures match or exceed recurrent models on sequence-to-sequence tasks while training significantly faster.",
      "Self-attention scales effectively with model size, enabling the parameter regimes (1B-1T+) that define modern LLMs.",
      "Position encoding via learned or sinusoidal embeddings allows attention models to handle sequence order without recurrence.",
      "Multi-head attention captures different relationship types in parallel, a design choice that proved central to LLM expressiveness.",
    ],
    relatedGlossaryIds: ["foundation-model", "context-window", "embedding-model"],
    relatedSectors: ["ai-ml", "ai-infra"],
    faqs: [
      {
        question: "Why is this paper considered foundational?",
        answer:
          "Every modern frontier LLM (GPT, Claude, Gemini, Mistral, Llama, Qwen) uses the Transformer architecture introduced here. Without this paper, the AI infrastructure and agentic AI categories we track would not exist in their current form.",
      },
      {
        question: "Where can I read the canonical version?",
        answer:
          "The paper is freely available on arXiv (arXiv:1706.03762). It is one of the most-cited ML papers ever published. NeurIPS 2017 was the venue.",
      },
      {
        question: "Who wrote Attention Is All You Need?",
        answer:
          "The eight authors were Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Łukasz Kaiser, and Illia Polosukhin, most working at Google Brain or Google Research at the time of publication.",
      },
      {
        question: "What is the Transformer architecture?",
        answer:
          "A sequence-to-sequence neural network built entirely on self-attention, dispensing with recurrence and convolutions. Its parallelism and clean scaling behavior with model size and data made the modern LLM era possible.",
      },
    ],
  },
  {
    slug: "brown-2020-language-models-are-few-shot-learners",
    title: "Language Models are Few-Shot Learners",
    year: 2020,
    venue: "NeurIPS 2020",
    authors: [
      { name: "Tom B. Brown", affiliation: "OpenAI" },
      { name: "Benjamin Mann", affiliation: "OpenAI" },
      { name: "Nick Ryder", affiliation: "OpenAI" },
      { name: "Melanie Subbiah", affiliation: "OpenAI" },
      { name: "Jared Kaplan", affiliation: "OpenAI" },
      { name: "Prafulla Dhariwal", affiliation: "OpenAI" },
    ],
    arxiv: "2005.14165",
    semanticScholar: "90abbc2cf38462b954ae1b772fac9532e2ccd8b0",
    sameAs: [
      "https://arxiv.org/abs/2005.14165",
      "https://www.semanticscholar.org/paper/90abbc2cf38462b954ae1b772fac9532e2ccd8b0",
    ],
    metaTitle: "GPT-3 Paper: Language Models Are Few-Shot Learners (Brown et al., 2020)",
    metaDescription: "The original GPT-3 paper (arXiv 2005.14165): plain-English summary of the 175B model and in-context learning, with links to the PDF and citations.",
    abstractSummary:
      "Introduces GPT-3, a 175B-parameter autoregressive language model, and demonstrates that scaling up a Transformer LM produces emergent few-shot in-context learning capability. Shows that a single model can perform many NLP tasks competitively without fine-tuning, simply by being shown a few examples in the prompt. Documents capability and scaling behaviors that defined the LLM era.",
    ourContext:
      "GPT-3 is the catalyst paper for the modern LLM era. The few-shot in-context learning paradigm became the dominant interaction pattern for AI products, and the 175B-parameter scale established the design space that frontier labs (Anthropic, OpenAI, Mistral, Cohere, Hugging Face) operate within. The applied-AI category we track at /signal/[anthropic/openai/etc.] would not exist without the GPT-3 demonstration.",
    keyFindings: [
      "Few-shot learning emerges as a capability of sufficiently-scaled language models, without explicit task-specific fine-tuning.",
      "Performance scales smoothly with model size, training data, and compute, establishing the scaling-law trend later formalized by Kaplan et al.",
      "A single LLM can perform translation, question-answering, summarization, arithmetic, and code generation competitively given few-shot prompting.",
      "The 175B-parameter scale established a new design space that frontier labs compete within.",
    ],
    relatedGlossaryIds: ["foundation-model", "context-window", "fine-tuning"],
    relatedSectors: ["ai-ml"],
    faqs: [
      {
        question: "What is GPT-3?",
        answer:
          "GPT-3 is a 175B-parameter autoregressive language model developed by OpenAI and released in 2020. The paper documents its design, training, and demonstrates the few-shot in-context learning capability that became central to modern LLM applications.",
      },
      {
        question: "Where is the canonical paper?",
        answer:
          "Available on arXiv (arXiv:2005.14165). One of the most-cited ML papers since publication.",
      },
      {
        question: "Who published the GPT-3 paper?",
        answer:
          "OpenAI. Lead authors include Tom B. Brown, Benjamin Mann, Nick Ryder, Melanie Subbiah, Jared Kaplan, and Prafulla Dhariwal. It appeared at NeurIPS 2020.",
      },
      {
        question: "What is few-shot in-context learning?",
        answer:
          "The ability of a sufficiently large language model to perform a new task from a handful of examples shown in the prompt, with no weight updates or fine-tuning. GPT-3 was the first large-scale demonstration that this capability emerges from scale.",
      },
    ],
  },
  {
    slug: "ouyang-2022-instructgpt-rlhf",
    title: "Training language models to follow instructions with human feedback",
    year: 2022,
    venue: "NeurIPS 2022",
    authors: [
      { name: "Long Ouyang", affiliation: "OpenAI" },
      { name: "Jeff Wu", affiliation: "OpenAI" },
      { name: "Xu Jiang", affiliation: "OpenAI" },
      { name: "Diogo Almeida", affiliation: "OpenAI" },
      { name: "Carroll L. Wainwright", affiliation: "OpenAI" },
      { name: "Pamela Mishkin", affiliation: "OpenAI" },
    ],
    arxiv: "2203.02155",
    semanticScholar: "d766bffc357127e0dc86dd69561d5aeb520d6f4c",
    sameAs: [
      "https://arxiv.org/abs/2203.02155",
      "https://www.semanticscholar.org/paper/d766bffc357127e0dc86dd69561d5aeb520d6f4c",
    ],
    metaTitle: "InstructGPT Paper (Ouyang et al., 2022): RLHF and Instruction Tuning",
    metaDescription: "The original InstructGPT paper (arXiv 2203.02155): plain-English summary of RLHF and instruction tuning, with links to the PDF and citations.",
    abstractSummary:
      "Introduces InstructGPT and the RLHF (Reinforcement Learning from Human Feedback) pipeline: (1) collect demonstrations from human labelers for supervised fine-tuning, (2) collect human preference comparisons over model outputs to train a reward model, (3) optimize the LM against the reward model via PPO. Shows that this pipeline dramatically improves helpfulness, truthfulness, and harmlessness compared to the raw GPT-3 baseline, at a fraction of the parameter count.",
    ourContext:
      "RLHF is the alignment technique that turned raw foundation models into the instruct-tuned helpful-by-default behavior that ChatGPT, Claude, and Gemini exhibit. Our engineering-acceleration tracking of frontier-AI labs (Anthropic, OpenAI, etc.) and the agentic AI categories operates on a substrate where this paper's pipeline is the alignment baseline.",
    keyFindings: [
      "A 1.3B-parameter InstructGPT model outperforms 175B-parameter GPT-3 on human-preference evaluations after RLHF.",
      "Three-stage pipeline (SFT → reward model → PPO) became the de-facto alignment recipe for major frontier labs.",
      "Helpfulness, truthfulness, and harmlessness can be simultaneously improved without major capability loss.",
      "Modern alternatives (DPO, KTO, RLAIF) achieve similar results without the explicit reward-model step but inherit the framing.",
    ],
    relatedGlossaryIds: ["rlhf", "foundation-model", "fine-tuning"],
    relatedSectors: ["ai-ml"],
    faqs: [
      {
        question: "What is RLHF?",
        answer:
          "Reinforcement Learning from Human Feedback, the training technique that aligns LLMs to human-preferred outputs after pretraining. See /define/rlhf for the full term definition.",
      },
      {
        question: "Why is this paper considered foundational?",
        answer:
          "InstructGPT formalized the RLHF pipeline that ChatGPT, Claude, and Gemini training pipelines use as the alignment baseline. The paper turned LLMs from raw text-prediction models into instruction-following assistants.",
      },
      {
        question: "What are the three stages of the RLHF pipeline?",
        answer:
          "(1) supervised fine-tuning on human-written demonstrations, (2) training a reward model on human preference comparisons over model outputs, and (3) optimizing the language model against that reward model with PPO reinforcement learning.",
      },
      {
        question: "Did a smaller InstructGPT model beat GPT-3?",
        answer:
          "Yes. The paper reports that a 1.3B-parameter InstructGPT model was preferred by human evaluators over the 175B-parameter GPT-3 baseline, a roughly 100× parameter reduction at higher human-preference quality.",
      },
    ],
  },
  {
    slug: "lewis-2020-rag-retrieval-augmented-generation",
    title: "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks",
    year: 2020,
    venue: "NeurIPS 2020",
    authors: [
      { name: "Patrick Lewis", affiliation: "Facebook AI Research" },
      { name: "Ethan Perez", affiliation: "Facebook AI Research" },
      { name: "Aleksandara Piktus", affiliation: "Facebook AI Research" },
      { name: "Fabio Petroni", affiliation: "Facebook AI Research" },
      { name: "Vladimir Karpukhin", affiliation: "Facebook AI Research" },
      { name: "Naman Goyal", affiliation: "Facebook AI Research" },
    ],
    arxiv: "2005.11401",
    semanticScholar: "58ed1fbaabe027345f7bb3a6312d41c5aac63e22",
    sameAs: [
      "https://arxiv.org/abs/2005.11401",
      "https://www.semanticscholar.org/paper/58ed1fbaabe027345f7bb3a6312d41c5aac63e22",
    ],
    metaTitle: "RAG Paper: Retrieval-Augmented Generation (Lewis et al., 2020)",
    metaDescription: "The original RAG paper (arXiv 2005.11401): plain-English summary of retrieval-augmented generation, with links to the PDF and citations.",
    abstractSummary:
      "Introduces Retrieval-Augmented Generation (RAG): an architecture that combines a pretrained sequence-to-sequence model (BART) with a non-parametric memory (a Dense Passage Retrieval index over Wikipedia). Demonstrates strong performance on knowledge-intensive NLP tasks while providing transparency about which documents informed each generation. Establishes the design pattern of retrieving documents before generating.",
    ourContext:
      "RAG is the architecture behind essentially every enterprise LLM deployment in 2026. The retrieval layer, typically using embedding models plus vector databases (Pinecone, Weaviate, Qdrant, Milvus), is one of the densest engineering-acceleration surfaces we track at /sector/database and /trend/ai-native-databases-2026.",
    keyFindings: [
      "Combining parametric (model weights) and non-parametric (retrieved documents) memory outperforms either alone on knowledge-intensive tasks.",
      "Retrieval enables citation transparency, the model's outputs can be traced to specific source documents.",
      "RAG addresses three core LLM limitations: knowledge cutoff dates, hallucination on out-of-distribution facts, and inability to cite sources.",
      "The design pattern became the foundation of the modern vector-DB-backed LLM application stack.",
    ],
    relatedGlossaryIds: ["rag", "embedding-model", "vector-database"],
    relatedSectors: ["ai-ml", "ai-infra"],
    faqs: [
      {
        question: "What is RAG?",
        answer:
          "Retrieval-Augmented Generation, an architecture where a model retrieves relevant documents from an external knowledge store before generating an answer. See /define/rag for the full term definition.",
      },
      {
        question: "Who wrote the RAG paper?",
        answer:
          "Patrick Lewis and colleagues at Facebook AI Research (FAIR), published at NeurIPS 2020 (arXiv:2005.11401).",
      },
      {
        question: "Why is RAG used in enterprise LLM applications?",
        answer:
          "It grounds generations in retrieved documents, which mitigates knowledge-cutoff staleness, reduces hallucination on out-of-distribution facts, and enables source citation, the three properties most enterprise deployments require.",
      },
      {
        question: "What infrastructure does RAG depend on?",
        answer:
          "An embedding model plus a vector database (Pinecone, Weaviate, Qdrant, Milvus) for the retrieval layer. We track the engineering acceleration of that surface at /sector/database and /trend/ai-native-databases-2026.",
      },
    ],
  },
  {
    slug: "hu-2021-lora-low-rank-adaptation",
    title: "LoRA: Low-Rank Adaptation of Large Language Models",
    year: 2021,
    venue: "ICLR 2022",
    authors: [
      { name: "Edward J. Hu", affiliation: "Microsoft" },
      { name: "Yelong Shen", affiliation: "Microsoft" },
      { name: "Phillip Wallis", affiliation: "Microsoft" },
      { name: "Zeyuan Allen-Zhu", affiliation: "Microsoft" },
      { name: "Yuanzhi Li", affiliation: "Microsoft" },
      { name: "Shean Wang", affiliation: "Microsoft" },
    ],
    arxiv: "2106.09685",
    semanticScholar: "a8ca46b171467ceb2d7652fbb7e5e2f4631c4ac0",
    sameAs: [
      "https://arxiv.org/abs/2106.09685",
      "https://www.semanticscholar.org/paper/a8ca46b171467ceb2d7652fbb7e5e2f4631c4ac0",
    ],
    metaTitle: "LoRA Paper: Low-Rank Adaptation (Hu et al., 2021): arXiv 2106.09685",
    metaDescription: "The original LoRA paper (arXiv 2106.09685): plain-English summary of low-rank adaptation for LLM fine-tuning, with links to the PDF and citations.",
    abstractSummary:
      "Introduces Low-Rank Adaptation (LoRA): a parameter-efficient fine-tuning technique that adds small low-rank matrices to a frozen base model. Demonstrates that LoRA matches full fine-tuning performance on multiple benchmarks while updating only 0.1%-1% of parameters. Reduces GPU memory requirements and storage footprint by orders of magnitude.",
    ourContext:
      "LoRA is the standard parameter-efficient fine-tuning method in 2026, deployed across Hugging Face's PEFT ecosystem and integrated into every major open-weight LLM serving stack. Engineering signals around LoRA adapter ecosystems are one of the cleanest measures of practical AI-application velocity in our /trend/ai-coding-tools-2026 leaderboard.",
    keyFindings: [
      "LoRA matches full fine-tuning quality on benchmarks while updating only 0.1%-1% of base-model parameters.",
      "Adapters can be mixed and matched at inference time, enabling multi-tenant LLM serving.",
      "Memory and storage requirements drop by 3-10× compared to full fine-tuning.",
      "Established as the default PEFT method for open-weight models (Llama, Mistral, Qwen, Gemma).",
    ],
    relatedGlossaryIds: ["lora", "fine-tuning", "foundation-model", "open-weight-model"],
    relatedSectors: ["ai-ml", "ai-infra"],
    faqs: [
      {
        question: "What is LoRA?",
        answer:
          "Low-Rank Adaptation, a parameter-efficient fine-tuning method that adds small low-rank matrices to a frozen base model. See /define/lora for the full term definition.",
      },
      {
        question: "Who created LoRA?",
        answer:
          "Edward J. Hu and colleagues at Microsoft, published at ICLR 2022 (arXiv:2106.09685).",
      },
      {
        question: "How many parameters does LoRA update?",
        answer:
          "Only 0.1%-1% of the base model's parameters, while matching full fine-tuning quality on the paper's benchmarks and cutting GPU memory and storage requirements by roughly 3-10×.",
      },
      {
        question: "Why is LoRA the default fine-tuning method?",
        answer:
          "Its parameter efficiency makes specialization cheap, and adapters can be mixed and matched at inference time to enable multi-tenant serving. It is the standard PEFT method for open-weight models like Llama, Mistral, Qwen, and Gemma.",
      },
    ],
  },
  {
    slug: "bai-2022-constitutional-ai",
    title: "Constitutional AI: Harmlessness from AI Feedback",
    year: 2022,
    venue: "arXiv preprint",
    authors: [
      { name: "Yuntao Bai", affiliation: "Anthropic" },
      { name: "Saurav Kadavath", affiliation: "Anthropic" },
      { name: "Sandipan Kundu", affiliation: "Anthropic" },
      { name: "Amanda Askell", affiliation: "Anthropic" },
      { name: "Jackson Kernion", affiliation: "Anthropic" },
      { name: "Andy Jones", affiliation: "Anthropic" },
    ],
    arxiv: "2212.08073",
    semanticScholar: "5c4d44eb4b0d9c1eeed03a8bcccef957fce8a06b",
    sameAs: [
      "https://arxiv.org/abs/2212.08073",
      "https://www.semanticscholar.org/paper/5c4d44eb4b0d9c1eeed03a8bcccef957fce8a06b",
    ],
    metaTitle: "Constitutional AI Paper (Bai et al., 2022): arXiv 2212.08073",
    metaDescription: "The original Constitutional AI paper (arXiv 2212.08073): plain-English summary of RLAIF and self-critique, with links to the PDF and citations.",
    abstractSummary:
      "Introduces Constitutional AI (CAI): an alignment approach where an LLM critiques and revises its own outputs according to a written constitution of principles, with reinforcement learning from AI feedback (RLAIF) replacing the human-labeling step. Demonstrates that RLAIF can produce models that are both more helpful AND more harmless than RLHF baselines, while scaling alignment without proportional human labeling effort.",
    ourContext:
      "Constitutional AI is the foundation of Claude's training pipeline at Anthropic, the headline 'safety-first' frontier lab in our engineering-acceleration tracking. The RLAIF paradigm addresses RLHF's scaling bottleneck and has influenced subsequent alignment research across frontier labs.",
    keyFindings: [
      "RLAIF (AI feedback) can substitute for RLHF (human feedback) at scale while maintaining alignment quality.",
      "A written 'constitution' of principles enables transparent control over model behavior.",
      "Models trained with CAI are both more helpful and more harmless than RLHF baselines on Anthropic's benchmarks.",
      "Scalable oversight via AI feedback is the path to alignment as models exceed human-evaluator capacity.",
    ],
    relatedGlossaryIds: ["rlhf", "foundation-model"],
    relatedSectors: ["ai-ml"],
    faqs: [
      {
        question: "How does Constitutional AI differ from RLHF?",
        answer:
          "Standard RLHF uses human preference data to train a reward model; Constitutional AI uses AI-generated preferences against a written constitution. Both pipelines produce aligned models; CAI scales without proportional human-labeling effort.",
      },
      {
        question: "Who published the Constitutional AI paper?",
        answer:
          "Anthropic. Authors include Yuntao Bai, Saurav Kadavath, Sandipan Kundu, Amanda Askell, Jackson Kernion, and Andy Jones (arXiv:2212.08073, 2022).",
      },
      {
        question: "What is RLAIF?",
        answer:
          "Reinforcement Learning from AI Feedback, the technique introduced in this paper, where AI-generated preferences judged against a written constitution replace human preference labeling, allowing alignment to scale without proportional human effort.",
      },
      {
        question: "Which model uses Constitutional AI?",
        answer:
          "It is the foundation of Anthropic's Claude training pipeline. The RLAIF approach has also influenced subsequent alignment research across other frontier labs.",
      },
    ],
  },
  {
    slug: "wei-2022-chain-of-thought-prompting",
    title: "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models",
    year: 2022,
    venue: "NeurIPS 2022",
    authors: [
      { name: "Jason Wei", affiliation: "Google Research" },
      { name: "Xuezhi Wang", affiliation: "Google Research" },
      { name: "Dale Schuurmans", affiliation: "Google Research" },
      { name: "Maarten Bosma", affiliation: "Google Research" },
      { name: "Brian Ichter", affiliation: "Google Research" },
      { name: "Fei Xia", affiliation: "Google Research" },
    ],
    arxiv: "2201.11903",
    semanticScholar: "1b6e810ce0afd0dd093f789d2b2742d047e316d5",
    sameAs: [
      "https://arxiv.org/abs/2201.11903",
      "https://www.semanticscholar.org/paper/1b6e810ce0afd0dd093f789d2b2742d047e316d5",
    ],
    metaTitle: "Chain-of-Thought Prompting Paper (Wei et al., 2022): NeurIPS 2022",
    metaDescription: "The original Chain-of-Thought paper (arXiv 2201.11903): plain-English summary of step-by-step reasoning prompts, with links to the PDF and citations.",
    abstractSummary:
      "Demonstrates that prompting LLMs to articulate intermediate reasoning steps before producing a final answer ('chain-of-thought prompting') dramatically improves accuracy on math, logic, and multi-step problem-solving benchmarks. The improvement scales with model size and emerges only at sufficient scale. Establishes step-by-step reasoning as a critical prompting technique and a foundation for later 'reasoning model' designs.",
    ourContext:
      "Chain-of-Thought is the technique that 'reasoning models' (OpenAI o1/o3, Anthropic Claude with extended thinking, DeepSeek R1) train into the model rather than relying on prompting alone. The category emerged directly from this paper's framing. Our /trend/agentic-ai-frameworks-2026 tracks the engineering acceleration in this category.",
    keyFindings: [
      "Chain-of-thought prompting dramatically improves LLM performance on multi-step reasoning tasks.",
      "The capability emerges only at sufficient model scale (~100B parameters).",
      "Step-by-step reasoning can be elicited via few-shot prompting without model retraining.",
      "Foundation for modern reasoning models that train extended chain-of-thought as a native capability.",
    ],
    relatedGlossaryIds: ["chain-of-thought", "reasoning-model", "foundation-model"],
    relatedSectors: ["ai-ml"],
    faqs: [
      {
        question: "What is chain-of-thought prompting?",
        answer:
          "A prompting technique where the model is instructed to articulate intermediate reasoning steps before producing a final answer. See /define/chain-of-thought for the full term definition.",
      },
      {
        question: "Who wrote the chain-of-thought paper?",
        answer:
          "Jason Wei and colleagues at Google Research, published at NeurIPS 2022 (arXiv:2201.11903).",
      },
      {
        question: "Does chain-of-thought work on small models?",
        answer:
          "No. The paper shows the benefit emerges only at sufficient model scale (around 100B parameters). Below that threshold, step-by-step prompting does not reliably improve reasoning accuracy.",
      },
      {
        question: "How does this relate to reasoning models?",
        answer:
          "Modern reasoning models (OpenAI o1/o3, Claude with extended thinking, DeepSeek R1) train extended chain-of-thought into the model as a native capability, rather than relying on few-shot prompting alone.",
      },
    ],
  },
  {
    slug: "forsgren-2018-accelerate-dora-research",
    title: "Accelerate: The Science of Lean Software and DevOps",
    year: 2018,
    venue: "IT Revolution Press (book)",
    authors: [
      { name: "Nicole Forsgren" },
      { name: "Jez Humble" },
      { name: "Gene Kim" },
    ],
    sameAs: [
      "https://www.semanticscholar.org/paper/d7d04edca3df11dc5d36586773f54b8a99cdfe6f",
      "https://dora.dev/",
      "https://services.google.com/fh/files/misc/state-of-devops-2023.pdf",
    ],
    metaTitle: "DORA Metrics Paper: Accelerate Research (Forsgren et al., 2018)",
    metaDescription: "The original DORA Accelerate research: plain-English summary of the four key metrics and findings, with links to the full report and citations.",
    abstractSummary:
      "Documents the multi-year DevOps Research and Assessment (DORA) research showing that four metrics, deployment frequency, lead time for changes, change failure rate, and mean time to recovery, empirically predict software-organization performance. Establishes the empirical foundation for engineering-velocity measurement as a research discipline.",
    ourContext:
      "Accelerate is the foundational empirical reference for the engineering-velocity measurement field. Our Code-Side Sourcing methodology operates on the same empirical premise, that publicly observable engineering activity (commit velocity, contributor influx, repo creation pulse) carries predictive signal about venture outcomes. The DORA research established the academic-level credibility for engineering-velocity measurement that our /methodology paper extends to the venture-finance domain.",
    keyFindings: [
      "Four key metrics (deployment frequency, lead time, change failure rate, MTTR) empirically predict software-organization performance.",
      "High-performing organizations deploy 200× more frequently than low performers with 100× shorter lead times.",
      "Speed and stability are not opposed, high performers deliver faster AND with fewer failures.",
      "Engineering-velocity measurement is a quantitative discipline with predictive empirical foundations.",
    ],
    relatedGlossaryIds: ["continuous-deployment", "deploy-frequency-spike", "commit-velocity"],
    relatedSectors: ["developer-tools", "analytics"],
    faqs: [
      {
        question: "What is the DORA research?",
        answer:
          "DevOps Research and Assessment, multi-year research by Nicole Forsgren and colleagues documenting that four metrics (deployment frequency, lead time, change failure rate, MTTR) predict software-organization performance. The annual State of DevOps Report is a continued output of this research line.",
      },
      {
        question: "How does this relate to Code-Side Sourcing?",
        answer:
          "Code-Side Sourcing extends the engineering-velocity-measurement premise from internal organizational performance (DORA's framing) to external venture-stage outcome prediction. See /code-side-sourcing and /methodology for the connection.",
      },
      {
        question: "What are the four DORA metrics?",
        answer:
          "Deployment frequency, lead time for changes, change failure rate, and mean time to recovery (MTTR). Together they empirically predict software-organization performance.",
      },
      {
        question: "Is Accelerate a peer-reviewed paper or a book?",
        answer:
          "Accelerate is a 2018 book (IT Revolution Press) summarizing the multi-year DORA research program; the underlying State of DevOps research continues as an annual report. We cite it as the empirical foundation of the engineering-velocity field.",
      },
    ],
  },
  {
    slug: "shazeer-2017-mixture-of-experts",
    title: "Outrageously Large Neural Networks: The Sparsely-Gated Mixture-of-Experts Layer",
    year: 2017,
    venue: "ICLR 2017",
    authors: [
      { name: "Noam Shazeer", affiliation: "Google Brain" },
      { name: "Azalia Mirhoseini", affiliation: "Google Brain" },
      { name: "Krzysztof Maziarz", affiliation: "Google Brain" },
      { name: "Andy Davis", affiliation: "Google Brain" },
      { name: "Quoc Le", affiliation: "Google Brain" },
      { name: "Geoffrey Hinton", affiliation: "Google Brain" },
      { name: "Jeff Dean", affiliation: "Google Brain" },
    ],
    arxiv: "1701.06538",
    semanticScholar: "3a07552649a9d04e10293aa4f895f959bf8f3d1d",
    sameAs: [
      "https://arxiv.org/abs/1701.06538",
      "https://www.semanticscholar.org/paper/3a07552649a9d04e10293aa4f895f959bf8f3d1d",
      "https://openalex.org/works/W2740393300",
    ],
    metaTitle: "Mixture of Experts Paper (Shazeer et al., 2017)",
    metaDescription: "The original Mixture of Experts paper: plain-English summary of sparsely-gated MoE layers, with links to the PDF and citations.",
    abstractSummary:
      "Introduces a sparsely-gated mixture-of-experts (MoE) layer for deep neural networks that achieves over 1,000x improvement in model capacity with minimal computational overhead. A trainable gating network routes each input to a small subset of expert sub-networks, enabling models with billions of parameters while keeping inference compute tractable. The architecture achieved state-of-the-art results on language modeling and machine translation benchmarks.",
    ourContext:
      "Mixture of Experts is the architectural foundation behind the most efficient frontier AI models (Mixtral 8x7B, DeepSeek MoE, GShard). For venture analysis, MoE adoption signals a startup's engineering sophistication: teams deploying MoE architectures achieve better cost-per-token economics, which directly impacts gross margin and unit economics. We track MoE adoption patterns in open-source AI startups as a momentum signal.",
    keyFindings: [
      "Sparsely-gated MoE layers achieve 1,000x+ capacity increase with only 6-7% compute overhead by activating only a subset of experts per input.",
      "A trainable gating network learns to route inputs to the most relevant experts, balancing load across the network automatically.",
      "Models with up to 137 billion parameters were trained efficiently, establishing the viability of trillion-parameter architectures.",
      "MoE enables conditional computation: model capacity scales with parameters but inference cost scales only with active experts.",
      "The batch-domain penalty for load balancing ensures no single expert becomes a bottleneck, a technique still used in modern MoE implementations.",
    ],
    relatedGlossaryIds: ["compute-efficiency", "model-capacity", "conditional-computation"],
    relatedSectors: ["ai-ml", "ai-infra"],
    faqs: [
      {
        question: "What is Mixture of Experts (MoE)?",
        answer:
          "A neural network architecture where multiple expert sub-networks specialize in different parts of the input space. A gating network routes each input to only the most relevant experts, allowing the model to have many parameters (high capacity) while keeping inference compute low (only a few experts activate per input).",
      },
      {
        question: "Who wrote the original Mixture of Experts paper?",
        answer:
          "Noam Shazeer, Azalia Mirhoseini, Krzysztof Maziarz, Andy Davis, Quoc Le, Geoffrey Hinton, and Jeff Dean at Google Brain, published at ICLR 2017 (arXiv:1701.06538).",
      },
      {
        question: "How does MoE reduce inference cost?",
        answer:
          "In a sparsely-gated MoE layer, only 1-2 experts (out of potentially hundreds) are activated for any single input. This means model capacity can be 137 billion parameters while inference compute resembles a much smaller dense model, because only the activated experts process the input.",
      },
      {
        question: "Which modern models use Mixture of Experts?",
        answer:
          "Mixtral 8x7B (Mistral AI), DeepSeek MoE, GShard, Switch Transformer, and reportedly GPT-4 all use MoE architectures. The technique enables frontier-scale models at a fraction of dense-model compute cost.",
      },
      {
        question: "Why does MoE matter for AI startups?",
        answer:
          "MoE architecture directly improves the cost-per-token ratio, which is the dominant cost driver for LLM-based products. Startups that deploy MoE efficiently can achieve 3-10x better gross margins compared to dense-model approaches, making them more attractive from a unit economics standpoint.",
      },
    ],
  },
];

export function getAllResearchPaperSlugs(): string[] {
  return RESEARCH_PAPERS.map((p) => p.slug);
}

export function getResearchPaper(slug: string): ResearchPaper | undefined {
  return RESEARCH_PAPERS.find((p) => p.slug === slug);
}
