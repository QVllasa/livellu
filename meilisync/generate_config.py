import os

config_template = """
database_type: postgres
database_url: {database_url}
meilisearch_url: {meilisearch_url}
meilisearch_api_key: {meilisearch_api_key}
indexes:
  - name: {index_name}
    primary_key: {primary_key}
    schema: {schema}
    table: {table_name}
"""

config_content = config_template.format(
    database_url=os.getenv('DATABASE_URL'),
    meilisearch_url=os.getenv('MEILISEARCH_URL'),
    meilisearch_api_key=os.getenv('MEILISEARCH_API_KEY'),
    index_name=os.getenv('INDEX_NAME'),
    primary_key=os.getenv('PRIMARY_KEY'),
    schema=os.getenv('SCHEMA'),
    table_name=os.getenv('TABLE_NAME')
)

with open('/app/config.yaml', 'w') as f:
    f.write(config_content)
