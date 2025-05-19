-- Enable pgvector extension if not already enabled
CREATE EXTENSION IF NOT EXISTS vector;

-- Create HNSW index on the embedding column in MemoryBank table
CREATE INDEX IF NOT EXISTS "MemoryBank_embedding_idx" ON "MemoryBank" USING hnsw (embedding vector_cosine_ops);