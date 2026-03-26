import logging
from celery import shared_task

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def process_document(self, document_id):
    """
    Process an uploaded document (extract text, index for search, etc.).
    This is a stub — replace with actual document processing logic
    (e.g., text extraction, embedding generation, vector indexing).
    """
    from .models import Document

    try:
        document = Document.objects.get(id=document_id)
    except Document.DoesNotExist:
        logger.error(f"Document {document_id} not found")
        return

    try:
        # TODO: Add actual processing logic here:
        # 1. Extract text from document (PyPDF2, python-docx, etc.)
        # 2. Generate embeddings
        # 3. Index in vector store
        # 4. Update metadata

        document.status = 'completed'
        document.save(update_fields=['status'])
        logger.info(f"Document {document_id} processed successfully")

    except Exception as exc:
        document.status = 'failed'
        document.save(update_fields=['status'])
        logger.exception(f"Document {document_id} processing failed")
        raise self.retry(exc=exc)
