CREATE EXTENSION vector;
CREATE TABLE lines (
  id bigserial PRIMARY KEY,
  position INT,
  text TEXT,
  embedding VECTOR(1024)
);
CREATE UNIQUE INDEX position_idx ON lines (position);

CREATE INDEX ON lines USING hnsw (embedding vector_ip_ops);
CREATE INDEX ON lines USING hnsw (embedding vector_cosine_ops);
CREATE INDEX ON lines USING hnsw (embedding vector_l1_ops);
