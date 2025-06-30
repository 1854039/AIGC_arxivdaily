#!/bin/bash

# 配置参数
MODEL_NAME=${MODEL_NAME:-"Qwen/Qwen-1_8B-Chat"}  # 推荐中文小模型
HOST=${HOST:-"0.0.0.0"}
PORT=${PORT:-8000}
API_KEY=${API_KEY:-"your-api-key-here"}

echo "🚀 启动 vLLM API 服务器"
echo "📦 模型: $MODEL_NAME"
echo "🌐 地址: http://$HOST:$PORT"
echo "🔑 API Key: ${API_KEY:0:8}..."

# 直接使用 vLLM 启动 OpenAI 兼容的 API 服务器
python -m vllm.entrypoints.openai.api_server \
    --model $MODEL_NAME \
    --host $HOST \
    --port $PORT \
    --api-key $API_KEY \
    --served-model-name gpt-3.5-turbo \
    --max-model-len 2048 \
    --gpu-memory-utilization 0.8 \
    --enable-auto-tool-choice \
    --disable-log-requests 