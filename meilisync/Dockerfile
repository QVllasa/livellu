FROM python:3.9-slim

# Install dependencies
RUN apt-get update && apt-get install -y gcc libpq-dev

# Create working directory
WORKDIR /app

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Copy the script to generate config
COPY generate_config.py /app/generate_config.py

# Set environment variables for the script (can also be set in CapRover UI)
ENV DATABASE_URL=postgresql://postgres:YOUR_DB_PASSWORD@YOUR_DB_HOST:5432/YOUR_DB_NAME
ENV MEILISEARCH_URL=http://YOUR_MEILISEARCH_HOST:7700
ENV MEILISEARCH_API_KEY=YOUR_MEILISEARCH_API_KEY
ENV INDEX_NAME=your_index_name
ENV PRIMARY_KEY=id
ENV SCHEMA=public
ENV TABLE_NAME=your_table_name

# Generate the config.yaml
RUN python /app/generate_config.py

# Run Meilisync
CMD ["meilisync", "-c", "/app/config.yaml"]
