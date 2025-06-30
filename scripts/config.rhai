let titles_type = ["Dataset", "Survey", "Review", "Overview"];
let titles_model = ["Diffusion","Flow Matching","Flowmatching","Flow", "GPT", "Transformer", "DDPM", "DDIM", "Score-based", "Denoising", "Rectified Flow"];
let titles_rl = ["Reinforcement Learning", "RL", "Policy", "Q-learning", "Actor-Critic", "PPO", "SAC", "DDPG", "A3C", "Rainbow", "DQN", "Multi-agent", "MARL", "Reward", "Value Function", "Bellman"];
let titles_rl_diffusion = ["Diffusion Policy", "Generative Policy", "Policy Diffusion", "Behavior Diffusion", "Trajectory Diffusion", "Action Diffusion", "Decision Diffusion", "Planning with Diffusion", "Reinforcement Learning with Diffusion", "RL Diffusion"];
let titles_method = ["Pre-train", "Pretrain", "Prompt", "Self-Supervised", "Contrastive", "Fine-tuning", "Transfer Learning", "Few-shot", "Zero-shot"];
let titles =  titles_model + titles_method + titles_type + titles_rl + titles_rl_diffusion;

let authors_array = [
    "Sergey Levine", "Pieter Abbeel", "Chelsea Finn", "John Schulman", "Wojciech Zaremba", 
    "David Silver", "DeepMind", "OpenAI", "Dario Amodei", "Ilya Sutskever",
    "Richard Sutton", "Andrew Barto", "Peter Stone", "Jan Peters", 
    "Yang Song", "Jascha Sohl-Dickstein", "Diederik Kingma", "Max Welling",
    "Jonathan Ho", "Chitwan Saharia", "Tim Salimans", "Prafulla Dhariwal",]
let titles_model = ["Diffusion","Flowmatching","Flow", "GPT", "Transformer"];
let titles_method = ["RL","Post-train","GRPO","DPO","PPO","Pre-train", "Pretrain", "Prompt", "Self-Supervised"];
let titles =  titles_model + titles_method + titles_type;
let authors_array = ["Yann LeCun", "Geoffrey Hinton", "Yoshua Bengio"];

let conferences = [
    // 机器学习顶会
    "ICML", "NeurIPS", "NIPS", "ICLR", "AISTATS", "UAI", "COLT",
    // 人工智能顶会
    "AAAI", "IJCAI", "ECAI",
    // 强化学习相关会议
    "AAMAS", "CoRL", "L4DC", "CDC", "ICRA", "IROS", "RSS",
    // 计算机视觉（扩散模型应用较多）
    "CVPR", "ICCV", "ECCV", "WACV", "BMVC",
    // 其他相关会议
    "ICLR Workshop", "NeurIPS Workshop", "ICML Workshop"
];

let start = conferences.shift();
let conferences_rg = conferences.reduce(|sum, v| sum + "|" + v, start);
let conferences_rg = "(" + conferences_rg + ")([\\s'-]*\\d+)?";

let start = titles.shift();
let title_rg = titles.reduce(|sum, v| sum + "|" + v, start);

let start = authors_array.shift();
let authors_rg = authors_array.reduce(|sum, v| sum + "|" + v, start);

export title_rg;
export authors_rg;
export conferences_rg;
